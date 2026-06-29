<template>
  <tr>
    <td>
      {{ props.title }}
    </td>
    <td>
      <div v-for="(party, pIndex) in modelValue" v-bind:key="pIndex">
        <el-select
          v-model="party.role"
          title="NT: Role"
          options-restriction="documents"
          options-source="roles"
        />
        <el-select
          v-model="party.contact"
          title="NT: Contact"
          options-source="con_contacts"
          :options-source-pure="true"
        />
        <q-separator />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import elSelect from './elViewEditSelect.vue';

// Definition des v-model für Vue 3 / Quasar
const props = defineProps<{
  modelValue: string;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
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
