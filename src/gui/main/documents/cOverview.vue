<template>
  <q-card>
    <q-card-section>
      <el-single-selection
        what="categories"
        label="NT: Categories"
        @onSelected="updateFilter('category_id', $event)"
      />
      <el-single-selection
        what="lifecycle_statuses"
        label="NT: Lifecycle statuses"
        @onSelected="updateFilter('lifecycle_status_id', $event)"
      />
      <el-single-selection
        what="review_statuses"
        label="NT: Review statuses"
        @onSelected="updateFilter('review_status_id', $event)"
      />
      <el-list-selection
        what="tags"
        label="NT: Tags"
        search-field-label="NT: Search tags"
        @onSelected="updateFilter('tag_ids', $event)"
      />
      <el-list-selection
        what="types"
        label="NT: Types"
        search-field-label="NT: Search types"
        @onSelected="updateFilter('type_ids', $event)"
      />
    </q-card-section>
  </q-card>

  <q-table
    flat
    bordered
    ref="tableRef"
    title="NT: Documents"
    :rows="documents"
    :columns="columns"
    row-key="id"
    v-model:pagination="pagination"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Suchen">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="q-gutter-xs">
        <q-btn dense round flat color="primary" icon="info" @click="showDetails(props.row.id)">
          <q-tooltip>NT: Details abrufen</q-tooltip>
        </q-btn>

        <!--<q-btn
          dense
          round
          flat
          color="secondary"
          icon="description"
          @click="openFile(props.row.id)"
        >
          <q-tooltip>NT: Datei öffnen</q-tooltip>
        </q-btn>-->
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import type { QTableColumn } from 'quasar';
import { QTable } from 'quasar'; // QTableColumn importiert

import elSingleSelection from 'src/gui/main/documents/elSingleSelection.vue';
import elListSelection from 'src/gui/main/documents/elListSelection.vue';

const emits = defineEmits(['onSelected']);

interface Pagination {
  sortBy: string | null;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

interface RequestProps {
  pagination: Pagination;
  filter?: string;
}

// Explizite Typisierung als QTableColumn[] hinzugefügt
const columns: QTableColumn[] = [
  {
    name: 'actions',
    label: 'Aktionen',
    field: 'actions',
    align: 'left',
  },
  { name: 'title', label: 'NT: Title', field: 'title', sortable: true, align: 'left' },
  { name: 'category', label: 'NT: Category', field: 'category', sortable: true, align: 'center' },
  { name: 'type', label: 'NT: Type', field: 'type', align: 'center', sortable: true },
  {
    name: 'lifecycle_status',
    label: 'NT: Lifecycle Status',
    field: 'lifecycle_status',
    align: 'center',
  },
  { name: 'review_status', label: 'NT: Review Status', field: 'review_status', align: 'center' },
  { name: 'created_at', label: 'NT: Created at', field: 'created_at', align: 'center' },
  { name: 'updated_at', label: 'NT: Updated at', field: 'updated_at', align: 'center' },
  { name: 'imported_from', label: 'NT: Imported from', field: 'imported_from', align: 'center' },
];

const tableRef = ref<InstanceType<typeof QTable> | null>(null);
const documents = ref([]);
const filter = ref('');
const loading = ref(false);

const extraFilters = {
  category_id: ref<number | null>(null),
  lifecycle_status_id: ref<number | null>(null),
  review_status_id: ref<number | null>(null),
  tag_ids: ref<number[]>([]),
  type_ids: ref<number[]>([]),
};

const pagination = ref<Pagination>({
  sortBy: 'title',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

function updateFilter<K extends keyof typeof extraFilters>(
  key: K,
  value: (typeof extraFilters)[K]['value'],
) {
  extraFilters[key].value = value;

  pagination.value.page = 1;
  tableRef.value?.requestServerInteraction();
}

function showDetails(documentId: number): void {
  emits('onSelected', documentId);
}

function onRequest(props: RequestProps) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const filterStr = props.filter || '';

  loading.value = true;

  api
    .get('/documents/display', {
      params: {
        page: page,
        limit: rowsPerPage,
        sort: sortBy,
        descending: descending,
        search: filterStr,
        category_id: extraFilters.category_id.value,
        lifecycle_status_id: extraFilters.lifecycle_status_id.value,
        review_status_id: extraFilters.review_status_id.value,
        tag_ids: extraFilters.tag_ids.value,
        type_ids: extraFilters.type_ids.value,
      },
    })
    .then((response) => {
      documents.value = response.data.results;
      pagination.value.rowsNumber = response.data.total;

      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  tableRef.value?.requestServerInteraction();
});
</script>
