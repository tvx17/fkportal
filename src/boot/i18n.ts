import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

function detectLocale(): string {
  const saved = localStorage.getItem('locale');
  if (saved) return saved;

  const browser = navigator.language?.split('-')[0];
  const supported = ['de', 'en', 'fr'];

  return browser && supported.includes(browser) ? browser : 'de';
}

const locale = detectLocale();

const messages = await import(`src/i18n/base/${locale}.json`);

export const i18n = createI18n({
  locale,
  fallbackLocale: 'de',
  legacy: false,
  messages: {
    [locale]: messages.default,
  },
});

export async function setLocale(lang: string) {
  if (!i18n.global.availableLocales.includes(lang)) {
    const messages = await import(`src/i18n/base/${lang}.json`);
    i18n.global.setLocaleMessage(lang, messages.default);
  }

  i18n.global.locale.value = lang;
  localStorage.setItem('locale', lang);
}

export default boot(({ app }) => {
  app.use(i18n);
});
