<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/composables/useComponentI18n';

useComponentI18n('home');

const { t } = useI18n();
</script>

<template>
  <div>
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.description') }}</p>
  </div>
</template>
