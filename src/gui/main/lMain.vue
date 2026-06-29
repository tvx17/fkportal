<template>
  <q-layout view="lHh Lpr lFf">
    <c-header />
    <d-left />
    <d-right />
    <!--<c-right-drawer v-model:drawer-open="rRightDrawerOpen" />-->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Core from 'src/core';

import cHeader from 'src/gui/main/cHeader.vue';
import dLeft from 'src/gui/main/dLeft.vue';
import dRight from 'src/gui/main/dRight.vue';

const userStore = Core.Stores.useUserStore();

onMounted(() => {
  if (userStore.role === '') {
    Core.App.Logger.info('NT: Role is empty, fetching user role...');
    Core.App.User.getUserRole()
      .then(() => {
        Core.App.Logger.info('NT: Fetched Role:', userStore.role);
      })
      .catch((error) => {
        Core.App.Logger.info('Error fetching user role:', error);
      });
  }
});
</script>
