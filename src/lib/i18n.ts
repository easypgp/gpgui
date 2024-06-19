import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
export const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

// eslint-disable-next-line import/no-named-as-default-member
i18next
  // load translation using neutralino. See locales folder
  // learn more: https://github.com/i18next/i18next-resources-to-backend
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`)
    )
  )
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: supportedLanguages.map(({ code }) => code),
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

i18next.on("failedLoading", (_lng, _ns, msg) => console.error(msg));

const i18n = i18next;
export default i18n;
