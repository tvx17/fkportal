import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import type { RouteLocationNormalized, Router } from 'vue-router';
import routes from './routes';

function isAuthenticated(): boolean {
  return !!localStorage.getItem('_wlh:access_token');
}

let localRouter: Router;

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  localRouter = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  localRouter.beforeEach((to: RouteLocationNormalized) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const authenticated = isAuthenticated();

    if (requiresAuth && !authenticated) {
      return { name: 'pageLogin' };
    }

    if (to.name === 'pageLogin' && authenticated) {
      return { name: 'pageIndex' };
    }
  });

  return localRouter;
});

export { localRouter as Router };
