import _user from './user';
import _logger from 'src/core/logger';
import _settings from 'src/core/settings';
import { Router } from 'src/router';

function activateDebugMode() {
  _logger.setNotify(true);
}

async function startUp() {
  if (_settings.runMode === 'development') {
    activateDebugMode();
  }

  _logger.info('Starting application...');

  // Warte die Validierung, den eventuellen Refresh und das Laden der Rolle ab
  const isSessionValid = await _user.initializeSession();

  const currentRoute = Router.currentRoute.value;

  if (!isSessionValid) {
    _logger.warning('User is not authenticated. Redirecting to login page...');
    if (currentRoute && currentRoute.name !== 'pageLogin') {
      Router.push({ name: 'pageLogin' });
    }
  } else {
    _logger.info('User is authenticated.');
    if (currentRoute && currentRoute.name === 'pageLogin') {
      Router.push({ name: 'pageIndex' });
    }
  }
}

export default {
  startUp,
  activateDebugMode,
};
