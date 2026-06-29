import { defineStore, acceptHMRUpdate } from 'pinia';
import { shallowRef } from 'vue';

import mFindNewDocuments from 'src/gui/main/documents/mFindDocuments.vue';
import mDisplayAllDocuments from 'src/gui/main/documents/mDisplayDocuments.vue';
import mAdmin from 'src/gui/main/documents/mAdmin.vue';

export const useDocumentsStore = defineStore('documents', {
  state: () => ({
    currentModule: shallowRef(),
  }),
  actions: {
    setModule(module: string) {
      switch (module) {
        case 'findDocuments':
          this.currentModule = mFindNewDocuments;
          break;
        case 'displayDocuments':
          this.currentModule = mDisplayAllDocuments;
          break;
        case 'admin':
          this.currentModule = mAdmin;
          break;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentsStore, import.meta.hot));
}
