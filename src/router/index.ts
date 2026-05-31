import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

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
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !isAuthenticated()) {
      // Namen angepasst an routes.ts (pageLogin statt Login)
      next({ name: 'pageLogin' });
    } else if (to.name === 'pageLogin' && isAuthenticated()) {
      // Namen angepasst an routes.ts (pageIndex statt Home)
      next({ name: 'pageIndex' });
    } else {
      next();
    }
  });

  return Router;
});

export { Router };
