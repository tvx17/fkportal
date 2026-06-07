<template>
  <q-page class="items-center justify-evenly">
    <div class="text-h6 row">{{ t('admin.title') }}</div>
    <div>
      <comp-users />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import compUsers from 'src/components/pages/adminPage/expansionItemUsers.vue';

import { useI18n } from 'vue-i18n';
import { useComponentI18n } from 'src/composables/useComponentI18n';

useComponentI18n('admin');

const { t } = useI18n();
</script>
