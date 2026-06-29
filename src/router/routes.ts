// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layoutMain',
    component: () => import('src/gui/main/lMain.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'pageIndex', component: () => import('src/gui/main/pIndex.vue') },
      { path: '/user', name: 'pageUser', component: () => import('src/gui/main/pUser.vue') },
      { path: '/admin', name: 'pageAdmin', component: () => import('src/gui/main/pAdmin.vue') },
      {
        path: '/documents',
        name: 'pageDocuments',
        component: () => import('src/gui/main/pDocuments.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'layoutLogin',
    component: () => import('src/gui/login/lLogin.vue'),
    children: [
      { path: '', name: 'pageLogin', component: () => import('src/gui/login/pLogin.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/gui/common/pErrorNotFound.vue'),
  },
];

export default routes;
