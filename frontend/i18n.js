import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "./src/Languages/EN.json";
import AR from "./src/Languages/AR.json";
import SP from "./src/Languages/SP.json";
import FR from "./src/Languages/FR.json";

i18n.use(initReactI18next).init({
  resources: {
    EN: { translation: EN },
    AR: { translation: AR },
    SP: { translation: SP },
    FR: { translation: FR },
  },
  lng: localStorage.getItem("lang") || "EN",
  fallbackLng: "EN",
  interpolation: { escapeValue: false },
});

export default i18n;
