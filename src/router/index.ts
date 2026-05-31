import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

// Dummy-Funktion für die Prüfung (hier den echten Check einbauen, z. B. via Pinia-Store oder LocalStorage)
function isAuthenticated(): boolean {
  return !!localStorage.getItem('user_token');
}

let Router: any;

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // --- beforeEach-Guard hier einfügen ---
  Router.beforeEach((to, from, next) => {
    // Prüft, ob die Route oder eine übergeordnete Route Authentifizierung erfordert
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !isAuthenticated()) {
      // Weiterleitung zur Login-Seite (Name muss mit dem Namen in routes.ts übereinstimmen)
      next({ name: 'Login' });
    } else if (to.name === 'Login' && isAuthenticated()) {
      // Wenn bereits eingeloggt, Weiterleitung zur Startseite verhindern und umleiten
      next({ name: 'Home' });
    } else {
      // Navigation erlauben
      next();
    }
  });

  return Router;
});

export { Router };
