import _user from './user';
import _logger from 'src/core/app/logger';
import _settings from 'src/core/app/settings';
import _config from 'src/configuration/index';
import _setter from 'src/core/app/setter';

import { Router } from 'src/router';

function activateDebugMode() {
  if (!_config.app.isFullRelease) {
    _logger.setNotify(true);
  }
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
      Router.push({ name: 'pageLogin' }).catch((e) => {
        _logger.error(String(e));
      });
    }
  } else {
    _logger.info('User is authenticated.');
    if (currentRoute && currentRoute.name === 'pageLogin') {
      Router.push({ name: 'pageIndex' }).catch((e) => {
        _logger.error(String(e));
      });
    }
  }
}

export default {
  startUp,
  activateDebugMode,
  User: _user,
  Logger: _logger,
  Settings: _settings,
  Setter: _setter,
};
