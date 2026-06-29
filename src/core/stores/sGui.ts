import { defineStore, acceptHMRUpdate } from 'pinia';

export const useGuiStore = defineStore('gui', {
  state: () => ({
    leftDrawerOpen: false,
    rightDrawerOpen: false,
  }),
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGuiStore, import.meta.hot));
}
