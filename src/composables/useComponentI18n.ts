import { onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { i18n } from 'src/boot/i18n';

export function useComponentI18n(
  componentKey: string,
  type: 'components' | 'pages' | 'layouts' = 'pages',
) {
  const { locale } = useI18n();

  async function loadMessages(lang: string) {
    try {
      console.log(`Lade Übersetzungen für "${type}/${componentKey}" in "${lang}"...`);
      const messages = await import(`src/i18n/${type}/${componentKey}/${lang}.json`);

      const current = i18n.global.getLocaleMessage(lang);
      i18n.global.setLocaleMessage(lang, {
        ...current,
        [componentKey]: messages.default,
      });
    } catch (e) {
      console.warn(`Keine Übersetzungen für "${type}/${componentKey}/${lang}" gefunden.`);
    }
  }

  function removeMessages(lang: string) {
    const current = { ...i18n.global.getLocaleMessage(lang) };
    delete current[componentKey];
    i18n.global.setLocaleMessage(lang, current);
  }

  onMounted(async () => {
    await loadMessages(locale.value);
  });

  onUnmounted(() => {
    removeMessages(locale.value);
  });

  watch(locale, async (newLang, oldLang) => {
    removeMessages(oldLang);
    await loadMessages(newLang);
  });

  return { loadMessages, removeMessages };
}
