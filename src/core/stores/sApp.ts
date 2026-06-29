import { defineStore, acceptHMRUpdate } from 'pinia';
import { shallowRef } from 'vue';

import cDocumentsModules from 'src/gui/main/documents/cModules.vue';

export const useAppStore = defineStore('app', {
  state: () => ({
    currentApp: '',
    currentAppName: '',
    hasOptions: false,
    rightDrawerModule: shallowRef(),
  }),
  actions: {
    addModuleName(moduleName: string) {
      this.currentAppName += ' - ' + moduleName;
    },
    setApp(app: string) {
      this.currentApp = app;
      switch (this.currentApp) {
        case 'documents':
          this.currentAppName = 'NT: Documents';
          this.hasOptions = true;
          this.setModule('documents');
          break;
        case 'home':
          this.currentAppName = 'NT: Home';
          this.hasOptions = false;
          break;
      }
    },
    setModule(modulesComponent: string) {
      switch (modulesComponent) {
        case 'documents':
          this.rightDrawerModule = cDocumentsModules;
          break;
      }
    },
    clearApp() {
      this.currentApp = '';
      this.currentAppName = '';
    },
    clearHasOptions() {
      this.hasOptions = false;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
