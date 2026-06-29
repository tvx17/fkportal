<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="col-12 col-md-6 col-lg-4">
      <q-card-section>
        <div class="text-h6">NT: Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="rEmail" label="NT: Email" />
        <q-input v-model="rPassword" label="NT: Password" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" @click="login" unelevated>NT: Login</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Core from 'src/core/';

const rEmail = ref('christian@familie-koester.eu');
const rPassword = ref('Chris1901!');

function login() {
  Core.App.User.login(rEmail.value, rPassword.value).catch((e) => {
    Core.App.Logger.error(e);
  });
}
</script>
