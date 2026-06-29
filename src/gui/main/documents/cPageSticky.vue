<template>
  <q-page-sticky position="top-right" :offset="[18, 18]">
    <q-fab icon="fa-solid fa-bars" direction="down" color="primary" unelevated>
      <q-fab-action
        @click="m.onSetMode('findNewDocuments')"
        color="primary"
        icon="fa-solid fa-magnifying-glass-plus"
        label="NT: Find new documents"
        external-label
        label-position="left"
        unelevated
      />
      <q-fab-action
        color="primary"
        icon="fa-solid fa-plus"
        label="NT: Add document"
        external-label
        label-position="left"
        unelevated
      />
      <q-fab-action
        @click="m.onSetMode('displayAllDocuments')"
        color="primary"
        icon="fa-solid fa-eye"
        label="NT: Display"
        external-label
        label-position="left"
        unelevated
      />
      <q-fab-action
        @click="m.onSetMode('displayAdmin')"
        color="primary"
        icon="fa-solid fa-screwdriver-wrench"
        label="NT: Admin"
        external-label
        label-position="left"
        unelevated
      />
    </q-fab>
  </q-page-sticky>
</template>
<script lang="ts" setup>
const emits = defineEmits(['set-mode']);

const m = {
  onSetMode(mode: string) {
    emits('set-mode', mode);
  },
};
</script>
