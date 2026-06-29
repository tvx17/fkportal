import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    lastAction: '',
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
    getLastAction: (state) => state.lastAction,
  },

  actions: {
    setLastAction(newAction: string) {
      this.lastAction = newAction;
    },
    clearLastAction() {
      this.lastAction = '';
    },
    setRole(newRole: string) {
      this.role = newRole;
    },
    clearRole() {
      this.role = '';
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
