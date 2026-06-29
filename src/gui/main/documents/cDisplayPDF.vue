<template>
  <q-page padding>
    <div class="q-gutter-md q-mb-lg" style="max-width: 300px">
      <q-select
        v-model="selectedDocument"
        :options="documentOptions"
        emit-value
        map-options
        label="Dokument auswählen"
        @update:model-value="fetchPdf"
      />
    </div>

    <q-card flat bordered class="relative-position" style="height: 70vh">
      <object v-if="pdfUrl" :data="pdfUrl" type="application/pdf" width="100%" height="100%">
        <q-banner class="bg-warning text-white">
          Ihr Browser unterstützt die direkte PDF-Anzeige nicht.
          <a :href="pdfUrl" target="_blank" class="text-white text-weight-bold">
            Klicken Sie hier, um das PDF herunterzuladen.
          </a>
        </q-banner>
      </object>

      <div v-else class="flex flex-center full-height text-grey-6">
        Bitte wählen Sie ein Dokument aus der Liste aus.
      </div>

      <q-inner-loading :showing="isLoading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';

//import axios from 'axios';

/*async function fetchPdfWithAxios(fileKey: string): Promise<void> {
  try {
    const response = await axios.get(`/api/pdf/${fileKey}`, {
      responseType: 'blob', // Zwingend erforderlich für Binärdaten
    });

    pdfUrl.value = URL.createObjectURL(response.data);
  } catch (error) {
    // Fehlerbehandlung
  }
}*/

const $q = useQuasar();

const selectedDocument = ref<string | null>(null);
const pdfUrl = ref<string>('');
const isLoading = ref<boolean>(false);

const documentOptions = [
  { label: 'Handbuch', value: 'handbuch' },
  { label: 'Rechnung 123', value: 'rechnung' },
];

async function fetchPdf(fileKey: string | null): Promise<void> {
  if (!fileKey) return;

  isLoading.value = true;

  // Wichtig: Vorherige Object-URL freigeben, um Speicherlecks zu vermeiden
  revokeCurrentUrl();

  try {
    // Pfad an Ihre Slim-Route anpassen (z. B. /api/pdf/handbuch)
    const response = await fetch(`/api/pdf/${fileKey}`, {
      method: 'GET',
      headers: {
        // Falls Authentifizierung benötigt wird:
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Server antwortete mit Status ${response.status}`);
    }

    // Die Response als Binärdaten (Blob) verarbeiten
    const blob = await response.blob();

    // Temporäre lokale URL im Browser generieren (blob:http://...)
    pdfUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Fehler beim Laden des PDFs:', error);
    $q.notify({
      type: 'negative',
      message: 'Das Dokument konnte nicht geladen werden.',
    });
    pdfUrl.value = '';
  } finally {
    isLoading.value = false;
  }
}

function revokeCurrentUrl(): void {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
}

onBeforeUnmount(() => {
  revokeCurrentUrl();
});
</script>
