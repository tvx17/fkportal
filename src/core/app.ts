import _user from './user';
import _logger from 'src/core/logger';
import _settings from 'src/core/settings';
import { Router } from 'src/router';

function activateDebugMode() {
  _logger.setNotify(true);
}

function startUp() {
  if (_settings.runMode === 'development') {
    activateDebugMode();
  }

  _logger.info('Starting application...');

  // Über die Router-Instanz auf die aktuelle Route zugreifen
  const currentRoute = Router.currentRoute.value;

  if (!_user.checkToken()) {
    _logger.warning('User is not authenticated. Redirecting to login page...');
    if (currentRoute && currentRoute.name !== 'pageLogin') {
      Router.push({ name: 'pageLogin' });
    }
  } else {
    _logger.info('User is authenticated.');
    if (currentRoute && currentRoute.name !== 'pageIndex') {
      Router.push({ name: 'pageIndex' });
    }
  }
}

export default {
  startUp,
  activateDebugMode,
};
