import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutMain',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', name: 'pageIndex', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/login',
    name: 'layoutLogin',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', name: 'pageLogin', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
