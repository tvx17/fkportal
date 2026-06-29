<template>
  <tr>
    <td>{{ props.title }}</td>
    <td>
      {{ props.value }}
    </td>
  </tr>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: string;
}>();
</script>

<style scoped>
.inline-block {
  display: inline-block;
}
.cursor-pointer {
  cursor: pointer;
}
.text-underline-dashed {
  border-bottom: 1px dashed #666;
}
</style>
