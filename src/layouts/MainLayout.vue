<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> NT: Info-System </q-toolbar-title>

        <q-btn flat dense round icon="account_circle" aria-label="User" to="/user" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list dense>
        <q-item-label header> NT:Apps </q-item-label>
        <q-item clickable v-ripple v-if="userStore.role === 'admin'" to="/admin">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> NT: Admin </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from 'src/stores/userStore';
import _user from 'src/core/user';

const userStore = useUserStore();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  if (userStore.role === '') {
    console.log('Role is empty, fetching user role...');
    _user
      .getUserRole()
      .then(() => {
        console.log('Fetched Role:', userStore.role);
      })
      .catch((error) => {
        console.error('Error fetching user role:', error);
      });
  }
});
</script>
