import _user from './user';
import _logger from 'src/core/logger';
import _settings from 'src/core/settings';
import { Router } from 'src/router';
import { useRoute } from 'vue-router';

function activateDebugMode() {
  _logger.setNotify(true);
}

function startUp() {
  if (_settings.runMode === 'development') {
    activateDebugMode();
  }

  _logger.info('Starting application...');
  const route = useRoute();

  if (!_user.checkToken()) {
    _logger.warning('User is not authenticated. Redirecting to login page...');
    if (route.name !== 'pageLogin') {
      Router.push({ name: 'pageLogin' });
    }
  } else {
    _logger.info('User is authenticated.');
    // Nur pushen, wenn der User NICHT schon auf der Index-Seite ist
    if (route.name !== 'pageIndex') {
      Router.push({ name: 'pageIndex' });
    }
  }
}

export default {
  startUp,
  activateDebugMode,
};
