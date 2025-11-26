import { computed } from 'vue';
import { useUiStore } from '../stores/uiStore';
import { translations } from '../locales/translations';

export function useI18n() {
    const uiStore = useUiStore();

    const locale = computed(() => uiStore.locale);

    const t = (key) => {
        const currentLocale = uiStore.locale;

        // Try current locale
        if(translations[currentLocale] && translations[currentLocale][key] !== undefined) {
            return translations[currentLocale][key];
        }

        // Fallback to English
        if(translations['en'] && translations['en'][key] !== undefined) {
            return translations['en'][key];
        }

        return key; // Return key if not found in fallback
    };

    return {
        t,
        locale,
    };
}
