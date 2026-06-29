import _notify from 'src/core/gui/notifies';

let _level = 'info';
let _notifyActive = false;

function info(message: string, data?: unknown) {
  if (_level === 'warning' || _level === 'error' || _level === 'info') {
    console.log(`INFO: ${message}`, data || '');
    if (_notifyActive) {
      _notify.info(message);
    }
  }
}
function warning(message: string, data?: unknown) {
  if (_level === 'warning' || _level === 'error') {
    console.warn(`WARNING: ${message}`, data || '');
    if (_notifyActive) {
      _notify.warning(message);
    }
  }
}
function error(message: string, data?: unknown) {
  if (_level === 'error') {
    console.error(`ERROR: ${message}`, data || '');
    if (_notifyActive) {
      _notify.error(message);
    }
  }
}

function setLevel(level: 'info' | 'warning' | 'error' | 'off') {
  _level = level;
}

function setNotify(notify: boolean) {
  _notifyActive = notify;
}

export default {
  info,
  warning,
  error,
  setLevel,
  setNotify,
};
