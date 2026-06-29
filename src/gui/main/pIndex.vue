<template>
  <q-page class="row items-center justify-evenly">
    <div>{{ t('basic') }}</div>
    <div>{{ t('home.title') }}</div>
    <div>Role: {{ userStore.role }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/core/composables/useComponentI18n';
import { onMounted } from 'vue';
import Core from 'src/core';

const userStore = Core.Stores.useUserStore();
const appStore = Core.Stores.useAppStore();

useComponentI18n('home', 'pages');

const { t } = useI18n();

onMounted(() => {
  Core.App.Logger.info('Role: ' + userStore.role);
  appStore.setApp('home');
});
</script>
