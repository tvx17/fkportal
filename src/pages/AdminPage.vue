<template>
  <q-page class="items-center justify-evenly">
    <div class="text-h6 row">NT: Admin Page</div>
    <div>
      <q-expansion-item
        style="min-width: 95%"
        expand-separator
        icon="perm_identity"
        label="NT: Users"
        @show="expansionItems.users.onShow"
        @hide="expansionItems.users.onHide"
      >
        <q-toolbar dense>
          {{ expansionItems.users.open }}
          <q-space />
          <q-btn flat dense round icon="add" aria-label="Add User">
            <q-tooltip>NT: Add User</q-tooltip>
          </q-btn>
        </q-toolbar>
        <div>
          <q-list dense>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-btn flat dense round icon="delete" aria-label="User" />
              </q-item-section>
              <q-item-section>John Doe</q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-btn flat dense round icon="delete" aria-label="User" />
              </q-item-section>
              <q-item-section>Jane Smith</q-item-section>
            </q-item>
          </q-list>
        </div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos
        corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto
        suscipit iste eveniet doloribus ullam aliquid.
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';

const expansionItems = {
  users: {
    open: false,
    onShow: async () => {
      expansionItems.users.open = true;
      await api
        .get('/users/get')
        .then((response) => {
          console.log('API Response:', response.data);
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    },
    onHide: () => {
      expansionItems.users.open = false;
    },
  },
};
</script>
