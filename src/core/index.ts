import Config from 'src/configuration/index';
import App from 'src/core/app';
import Stores from 'src/core/stores';
import Gui from 'src/core/gui';

import { Router } from 'src/router';
import { api } from 'src/boot/axios';

import Composables from './composables';

export default {
  Composables,
  Gui,
  Config,
  App,
  Router,
  Api: api,
  Stores,
};
