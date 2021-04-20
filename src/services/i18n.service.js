import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Config from 'react-native-config';
import { getLocales } from 'react-native-localize';

import en from 'assets/languages/en';

const DEFAULT_I18NEXT_NAMESPACE = 'translation';

const resources = {
  en: { [DEFAULT_I18NEXT_NAMESPACE]: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: DEFAULT_I18NEXT_NAMESPACE,
    lng: getLocales?.[0]?.languageCode,
    fallbackLng: 'en',
    debug: Config.APP_ENV === 'DEV',
  });

export default i18n;
