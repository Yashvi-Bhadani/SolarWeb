import { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n/translations";

const STORAGE_KEY = "raghav-solar-lang";

const LanguageContext = createContext({});

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        if (typeof window === "undefined") return "en";
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === "gu" || saved === "en" ? saved : "en";
    });

    const setLang = (next) => {
        setLangState(next);
        localStorage.setItem(STORAGE_KEY, next);
    };

    useEffect(() => {
        document.documentElement.lang = lang === "gu" ? "gu" : "en";
    }, [lang]);

    const t = (keyPath) => {
        if (!keyPath) return "";
        const parts = keyPath.split(".");
        let node = translations[lang];
        for (const p of parts) {
            if (node == null) return keyPath;
            node = node[p];
        }
        return node ?? keyPath;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export default LanguageContext;
