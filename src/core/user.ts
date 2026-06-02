import _logger from 'src/core/logger';
import { api } from 'src/boot/axios';
import { Router } from 'src/router';
import { useUserStore } from 'src/stores/userStore';

// Hilfsfunktion zum Setzen der Axios-Authorization-Header
function setApiHeader(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

async function login(email: string, password: string) {
  const userStore = useUserStore();
  _logger.info('Attempting login with email: ' + email);

  try {
    const response = await api.post('/user/login', { email, password });
    _logger.info('Login successful');

    setToken(response.data.access_token);
    setApiHeader(response.data.access_token);

    userStore.setRole(response.data.role);
    userStore.setLastAction(new Date().toISOString());

    Router.push({ name: 'pageIndex' });
  } catch (error) {
    _logger.error('Login failed: ' + error);
  }
}

async function refreshToken(): Promise<boolean> {
  const userStore = useUserStore();
  _logger.info('Attempting to refresh token...');

  const storedRefreshToken = localStorage.getItem('_wlh:refresh_token');
  if (!storedRefreshToken) {
    _logger.warning('No refresh token available for rotation.');
    return false;
  }

  try {
    // Das Backend erwartet das Refresh-Token im Body (siehe $body['refresh_token'])
    const response = await api.post('/user/refresh', {
      refresh_token: storedRefreshToken,
    });

    _logger.info('Token refresh successful');
    setToken(response.data.access_token);
    setApiHeader(response.data.access_token);

    userStore.setRole(response.data.role || userStore.role);
    userStore.setLastAction(new Date().toISOString());
    return true;
  } catch (error) {
    _logger.error('Token refresh failed: ' + error);
    removeToken();
    userStore.clearRole();
    userStore.clearLastAction();
    setApiHeader(null);
    Router.push({ name: 'pageLogin' });
    return false;
  }
}

async function getUserRole(): Promise<string> {
  const userStore = useUserStore();
  _logger.info('Retrieving user role...');

  const currentToken = localStorage.getItem('_wlh:access_token');

  try {
    // Übergib den Header hier explizit für DIESEN Request,
    // um globale Race-Conditions zu umgehen
    const response = await api.get('/user/getRole', {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (response.data && response.data.role) {
      userStore.setRole(response.data.role);
    }
  } catch (error) {
    _logger.error('Error retrieving user role: ' + error);
  }
  return userStore.role;
}

function checkToken(): boolean {
  return !!localStorage.getItem('_wlh:access_token');
}

async function initializeSession(): Promise<boolean> {
  const userStore = useUserStore();
  _logger.info('Initializing session and validating tokens...');

  const accessToken = localStorage.getItem('_wlh:access_token');

  if (!accessToken) {
    _logger.warning('Missing access token in localStorage.');
    return false;
  }

  setApiHeader(accessToken);

  if (!userStore.getLastAction) {
    userStore.setLastAction(new Date().toISOString());
  }

  // Falls im Pinia-Store die Rolle fehlt, vom Server holen
  if (!userStore.role) {
    await getUserRole();
  }

  return true;
}
function getToken() {
  return !!localStorage.getItem('_wlh:access_token');
}

function removeToken() {
  _logger.info('Removing token...');
  localStorage.removeItem('_wlh:access_token');
}

function setToken(token: string) {
  _logger.info('Setting token...');
  localStorage.setItem('_wlh:access_token', token);
}

export default {
  checkToken,
  getToken,
  removeToken,
  setToken,
  login,
  refreshToken,
  getUserRole,
  initializeSession,
};
