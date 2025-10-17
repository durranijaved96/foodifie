/* eslint-disable @typescript-eslint/no-unused-vars */
// App.tsx

import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Router from "./routes";
import ThemeProvider from "./theme/Index";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import { useI18n } from "./hooks/use-i18n";


// Import the Elements provider from @stripe/react-stripe-js

function App() {
  
  const {t, i18n} = useI18n();
  useEffect(() => {
    // Initialize the preferred language from localStorage
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    if (preferredLanguage) {
      i18n.changeLanguage(preferredLanguage);
    }

    // Save the language to localStorage on change
    const handleLanguageChange = (language: string) => {
      localStorage.setItem("preferredLanguage", language);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);
  
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
