import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

// Basis-Instanz für die API
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error ?? new Error('Token-Refresh fehlgeschlagen'));
    }
  });
  failedQueue = [];
};

export default defineBoot(({ app }) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      const finalError = error instanceof Error ? error : new Error(String(error));
      return Promise.reject(finalError);
    },
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;
      const finalError = error instanceof Error ? error : new Error(String(error));

      if (!error?.response || error.response.status !== 401 || originalRequest?._retry) {
        return Promise.reject(finalError);
      }

      if (originalRequest.url === '/user/refresh') {
        localStorage.removeItem('access_token');
        return Promise.reject(finalError);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest?.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            const finalErr = err instanceof Error ? err : new Error(String(err));
            return Promise.reject(finalErr);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/user/refresh');

        if (response.data && response.data.access_token) {
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);

          processQueue(null, newToken);

          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        const fallbackError =
          refreshError instanceof Error ? refreshError : new Error(String(refreshError));
        processQueue(fallbackError, null);
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(fallbackError);
      } finally {
        isRefreshing = false;
      }

      return Promise.reject(finalError);
    },
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
