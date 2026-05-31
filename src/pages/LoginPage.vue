<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="col-12 col-md-6 col-lg-4">
      <q-card-section>
        <div class="text-h6">NT: Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" label="NT: Email" />
        <q-input v-model="password" label="NT: Password" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" @click="login" unelevated>NT: Login</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import _user from 'src/core/user';

const email = ref('');
const password = ref('');

function login() {
  _user.login(email.value, password.value);
}
</script>
