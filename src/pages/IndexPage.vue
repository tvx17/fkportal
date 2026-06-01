<template>
  <q-page class="row items-center justify-evenly">
    <div>{{ t('basic') }}</div>
    <div>{{ t('home.title') }}</div>
    <div>Role: {{ userStore.role }}</div>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/composables/useComponentI18n';
import { useUserStore } from 'src/stores/userStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

useComponentI18n('home', 'pages');

const { t } = useI18n();

onMounted(() => {
  console.log('Role:', userStore.role);
});
</script>
