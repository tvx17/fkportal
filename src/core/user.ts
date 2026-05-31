import _logger from 'src/core/logger';
import { api } from 'src/boot/axios';
import { Router } from 'src/router';
import { useUserStore } from 'src/stores/userStore'; // Pfad ggf. anpassen

const userStore = useUserStore();

function login(email: string, password: string) {
  _logger.info('Attempting login with email: ' + email);
  api
    .post('/api/v1/user/login', { email, password })
    .then((response) => {
      _logger.info('Login successful');
      setToken(response.data.access_token, 'accessToken');
      setToken(response.data.refresh_token, 'refreshToken');
      userStore.setRole(response.data.role);
      Router.push({ name: 'pageIndex' });
    })
    .catch((error) => {
      _logger.error('Login failed: ' + error);
    });
}

function refreshToken() {
  _logger.info('Attempting to refresh token...');
  api
    .post('/api/v1/user/refresh', {}, { withCredentials: true })
    .then((response) => {
      _logger.info('Token refresh successful');
      setToken(response.data.access_token, 'accessToken');
      setToken(response.data.refresh_token, 'refreshToken');
      userStore.setRole(response.data.role);
    })
    .catch((error) => {
      _logger.error('Token refresh failed: ' + error);
      removeToken();
      userStore.clearRole();
      Router.push({ name: 'login' });
    });
}

function checkToken() {
  _logger.info('Checking token...');
  const token = getToken();
  if (!token) {
    console.warn('No token found. User is not authenticated.');
    return false;
  } else {
    _logger.info('Token found. User is authenticated.');
    return true;
  }
}

function setLastAction() {
  userStore.setLastAction(new Date().toISOString());
}

function getToken() {
  _logger.info('Retrieving token...');

  if (!localStorage.getItem('_wlh:access_token') || !localStorage.getItem('_wlh:refresh_token')) {
    _logger.warning('No access or refresh token found in localStorage.');
    return false;
  } else {
    _logger.info('Token retrieved successfully.');
    if (userStore.getLastAction === '' || userStore.getLastAction === null) {
      refreshToken();
      userStore.setLastAction(new Date().toISOString());
    }
    if (userStore.role === '' || userStore.role === null) {
      getUserRole();
    }

    return true;
  }
}

function removeToken() {
  _logger.info('Removing token...');
  localStorage.removeItem('_wlh:access_token');
  localStorage.removeItem('_wlh:refresh_token');
}
function setToken(token: string, whichToken: 'accessToken' | 'refreshToken' = 'accessToken') {
  _logger.info('Setting token...');
  const _tokenKey = whichToken === 'accessToken' ? '_wlh:access_token' : '_wlh:refresh_token';

  localStorage.setItem(_tokenKey, token);
}

function getUserRole() {
  _logger.info('Retrieving user role...');
  api
    .get('/api/v1/user/role', { withCredentials: true })
    .then((response) => {
      userStore.setRole(response.data.role);
    })
    .catch((error) => {
      _logger.error('Error retrieving user role: ' + error);
    });

  return userStore.role;
}

export default {
  checkToken,
  getToken,
  removeToken,
  setToken,
  login,
  refreshToken,
  setLastAction,
};
