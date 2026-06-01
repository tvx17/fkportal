// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutMain',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // <-- Schützt alle Kind-Routen (Index, User, Admin)
    children: [
      { path: '', name: 'pageIndex', component: () => import('pages/IndexPage.vue') },
      { path: '/user', name: 'pageUser', component: () => import('pages/UserPage.vue') },
      { path: '/admin', name: 'pageAdmin', component: () => import('pages/AdminPage.vue') },
    ],
  },
  {
    path: '/login',
    name: 'layoutLogin',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', name: 'pageLogin', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
