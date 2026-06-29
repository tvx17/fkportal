<template>
  <q-drawer v-model="guiStore.leftDrawerOpen" bordered>
    <q-list dense>
      <q-item-label header> NT:Apps </q-item-label>
      <q-item clickable v-ripple to="/documents">
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: Documents </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: Schedule </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: School </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: Weather </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: Tasks </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: Einkaufen </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section> NT: User </q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple v-if="userStore.role === 'admin'" to="/admin">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section> NT: Admin </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>
<script setup lang="ts">
import Core from 'src/core';

const guiStore = Core.Stores.useGuiStore();

//const drawerOpen = defineModel<boolean>('drawer-open', { default: false });

const userStore = Core.Stores.useUserStore();
</script>
