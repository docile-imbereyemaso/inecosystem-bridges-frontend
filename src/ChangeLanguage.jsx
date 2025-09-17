import React from 'react'
import { useEffect, useRef } from "react";
import Language from './hooks/Language';
import "./App.css";
// import Language from 'react-language-select';

const ChangeLanguage = () => {

  const googleTranslateRef = useRef(null);

      // Language change handler
      const handleLanguageChange = (value) => {
        const lang = value.code;
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
          combo.value = lang;
          const event = new Event("change");
          combo.dispatchEvent(event);
        }
      };
    
      // Google translate init
      useEffect(() => {
        let intervalId;
        const googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            clearInterval(intervalId);
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                autoDisplay: false,
                includedLanguages: "fr,es,sw,rw,en,de,pt",
                layout: window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
              },
              googleTranslateRef.current
            );
          }
        };
        intervalId = setInterval(googleTranslateElementInit, 100);
      }, []);

  return (
    <div>
         <div
          id="google_translate_element"
          style={{ display: "none" }}
          ref={googleTranslateRef}
        ></div>
        <Language onLanguageChange={handleLanguageChange} className="bg-transparent w-full" />
        
    </div>
  )
}

export default ChangeLanguage