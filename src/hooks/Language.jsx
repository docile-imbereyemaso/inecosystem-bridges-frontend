
import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"

const languages = [
  { code: "en", name: "English", imgUrl:'https://flagcdn.com/w320/vg.png' },
  { code: "rw", name: "Rwanda",imgUrl:'https://flagcdn.com/w320/rw.png' },
  { code: "fr", name: "French", imgUrl:"https://flagcdn.com/w320/fr.png" },
  { code: "sw", name: "Swahili",imgUrl:"https://flagcdn.com/w320/cg.png" },
  { code: "de", name: "German",imgUrl:"https://flagcdn.com/w320/de.png" },
  { code: "es", name: "Spanish", imgUrl:"https://flagcdn.com/w320/es.png" },
  { code: "pt", name: "Portuguese", imgUrl:"https://flagcdn.com/w320/pt.png" },


]

export default function Language({
  onLanguageChange,
  defaultLanguage = "en",
  className = "",
  showTitle = true,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((lang) => lang.code === defaultLanguage) || languages[0],
  )
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    if (onLanguageChange) onLanguageChange(language)
  }

  const updateLanguage = (code)=>{
    const findL = languages.find((lan)=>lan.code === code)
    setSelectedLanguage(findL)
  }
useEffect(() => {
  const interval = setInterval(() => {
    const select = document.querySelector('.goog-te-combo');
    if (select && select.value) {
        updateLanguage(select.value)
      
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
}, []);


  return (
    <div className={`w-full max-w-[120px] ${className}`}>
     
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-2 py-2 gap-2
          bg-white border border-gray-300 rounded-3xl hover:bg-gray-50 focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-900" translate="no">
                {selectedLanguage.name}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-200 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className="flex items-center justify-between px-2 py-3 cursor-pointer hover:bg-gray-50"
            >
                
              <div className="flex items-center gap-2">
                <img src={language.imgUrl} alt={language.name} className="h-4 w-4 rounded"/>
                <span className="text-sm text-gray-500" translate="no" >{language.name}</span>
              </div>
              {selectedLanguage.code === language.code && (
                <Check size={16} className=" text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
