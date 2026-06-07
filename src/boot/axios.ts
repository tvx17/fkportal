import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Basis-Instanz für die API
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // WICHTIG: Erlaubt das Senden und Empfangen von HttpOnly-Cookies (Refresh-Token)
});

// Variable, um mehrfache parallele Refresh-Anfragen zu verhindern
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export default defineBoot(({ app }) => {
  // 1. Request Interceptor: Fügt das aktuelle Access-Token an jeden Request an
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 2. Response Interceptor: Behandelt abgelaufene Tokens (401)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Wenn der Fehler kein 401 ist oder die Anfrage bereits wiederholt wurde
      if (!error.response || error.response.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // Wenn wir bereits auf der Refresh-Route sind und ein 401 fliegt, ist auch das Refresh-Token ungültig
      if (originalRequest.url === '/user/refresh') {
        localStorage.removeItem('access_token');
        // Hier optional: Weiterleitung zum Login oder Store-Reset triggerbar
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Backend aufrufen, um Token zu erneuern.
        // Das HttpOnly-Cookie wird dank 'withCredentials: true' automatisch mitgesendet.
        const response = await api.post('/user/refresh');

        if (response.data && response.data.access_token) {
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);

          // Falls im Response-Body ein neues rotierendes Refresh-Token mitkommt,
          // wird das vom Browser direkt über den 'Set-Cookie'-Header neu gesetzt.

          processQueue(null, newToken);

          // Ursprüngliche Anfrage mit neuem Token wiederholen
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        // Logout erzwingen, da Sitzung endgültig abgelaufen ist
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

      return Promise.reject(error);
    },
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
