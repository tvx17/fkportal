import { bus } from 'src/core/app/eventBus';

function handleDocumentResults(successDocs: any[], failedDocs: any[]) {
  bus.emit('documents-updated', {
    success: successDocs,
    failed: failedDocs,
  });
}
import { ref, onMounted, onUnmounted } from 'vue';

const successfulDocs = ref<any[]>([]);

// Callback-Funktion separat definieren, damit sie auch wieder entfernt werden kann
const handleDocs = (data: { success: any[]; failed: any[] }) => {
  successfulDocs.value = data.success;
};

onMounted(() => {
  bus.on('documents-updated', handleDocs);
});

onUnmounted(() => {
  bus.off('documents-updated', handleDocs);
});

//
