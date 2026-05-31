import { Notify } from 'quasar';

function message(message: string) {
  Notify.create({
    message,
    color: 'info',
  });
}

function info(message: string) {
  Notify.create({
    message,
    color: 'info',
  });
}

function warning(message: string) {
  Notify.create({
    message,
    color: 'warning',
  });
}

function error(message: string) {
  Notify.create({
    message,
    color: 'negative',
  });
}

export default {
  info,
  warning,
  error,
  message,
};
