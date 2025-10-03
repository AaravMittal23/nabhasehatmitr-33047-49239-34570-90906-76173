import { useState } from "react";
import { User, AlertTriangle, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

// Header translations
const headerTranslations = {
  en: {
    login: "Login / Sign up",
    emergency: "Emergency",
    siteNamePart1: "Health",
    siteNamePart2: "Connect",
    siteNamePart3: "",
    home: "Home",
    bookAppointment: "Book Appointment",
    pharmacies: "Pharmacies",
    reports: "Reports",
    contactUs: "Contact Us",
    calendar: "Calendar",
    aboutUs: "About Us"
  },
  hi: {
    login: "लॉगिन / साइन अप",
    emergency: "आपातकाल",
    siteNamePart1: "हेल्थ",
    siteNamePart2: "कनेक्ट",
    siteNamePart3: "",
    home: "होम",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    pharmacies: "फार्मेसियां",
    reports: "रिपोर्ट्स",
    contactUs: "संपर्क करें",
    calendar: "कैलेंडर",
    aboutUs: "हमारे बारे में"
  },
  pa: {
    login: "ਲਾਗਇਨ / ਸਾਈਨ ਅੱਪ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    siteNamePart1: "ਹੈਲਥ",
    siteNamePart2: "ਕਨੈਕਟ",
    siteNamePart3: "",
    home: "ਘਰ",
    bookAppointment: "ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
    pharmacies: "ਫਾਰਮੇਸੀ",
    reports: "ਰਿਪੋਰਟਸ",
    contactUs: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    calendar: "ਕੈਲੰਡਰ",
    aboutUs: "ਸਾਡੇ ਬਾਰੇ"
  }
};
const languages = [{
  code: 'en',
  name: 'English',
  flag: 'EN'
}, {
  code: 'hi',
  name: 'हिंदी',
  flag: 'हि'
}, {
  code: 'pa',
  name: 'ਪੰਜਾਬੀ',
  flag: 'ਪੰ'
}];
interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  showCenterLogo?: boolean;
  hideLoginButton?: boolean;
}
export function Header({
  currentLanguage,
  onLanguageChange,
  showCenterLogo = false,
  hideLoginButton = false
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleLanguage = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const t = headerTranslations[currentLanguage as keyof typeof headerTranslations] || headerTranslations.en;
  return <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side icons - Login and Emergency */}
            <div className="flex items-center space-x-3 flex-1">
              {!hideLoginButton && <Button variant="ghost" size="sm" className="touch-target transition-smooth hover:bg-accent" aria-label="Login or Sign up" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{t.login}</span>
                  </Link>
                </Button>}

              <Button variant="ghost" size="sm" className="touch-target transition-smooth hover:bg-destructive/10 text-medical-red hover:text-medical-red" aria-label="Emergency services - call for immediate help" asChild>
                <Link to="/emergency">
                  <AlertTriangle className="h-4 w-4 mr-2 text-medical-red" />
                  <span className="text-sm font-medium text-medical-red">{t.emergency}</span>
                </Link>
              </Button>
            </div>

            {/* Center Logo and Title (for non-home pages) */}
            {showCenterLogo && <div className="flex items-center space-x-3 justify-center flex-1">
                <img src={logo} alt="Health Connect Logo" className="h-10 w-10 object-contain" />
                <Link to="/" className="flex items-center">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                    <span className="text-primary">{t.siteNamePart1}</span>
                    <span className="text-healthcare-green">{t.siteNamePart2}</span>
                    <span className="text-medical-red">{t.siteNamePart3}</span>
                  </h1>
                </Link>
              </div>}

            {/* Right side - Language Toggle and Burger Menu */}
            <div className="flex items-center space-x-2 justify-end flex-1">
              {/* Language Toggle */}
              <div className="relative">
                

                {/* Language Dropdown */}
                {isLanguageOpen && <div className="absolute right-0 mt-2 w-40 bg-popover border rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {languages.map(lang => <button key={lang.code} onClick={() => {
                    onLanguageChange(lang.code);
                    setIsLanguageOpen(false);
                  }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-smooth ${lang.code === currentLanguage ? 'bg-accent font-medium' : ''}`}>
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>)}
                    </div>
                  </div>}
              </div>

              {/* Burger Menu Button */}
              <Button variant="ghost" size="sm" onClick={toggleMenu} className="touch-target transition-smooth hover:bg-accent" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
                <div className="flex flex-col justify-center items-center w-5 h-5">
                  <span className={`burger-line block h-0.5 w-5 bg-foreground rounded ${isMenuOpen ? 'open' : ''}`} />
                  <span className={`burger-line block h-0.5 w-5 bg-foreground rounded mt-1 ${isMenuOpen ? 'open' : ''}`} />
                  <span className={`burger-line block h-0.5 w-5 bg-foreground rounded mt-1 ${isMenuOpen ? 'open' : ''}`} />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-down Menu */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background border-b shadow-lg transform transition-all duration-300 ease-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="space-y-4">
            <Link to="/" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.home}
            </Link>
            <Link to="/find-doctor" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.bookAppointment}
            </Link>
            <Link to="/calendar" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.calendar}
            </Link>
            <Link to="/reports" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.reports}
            </Link>
            <Link to="/contact" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.contactUs}
            </Link>
            <Link to="/about" className="block py-2 text-lg font-medium hover:text-healthcare-green transition-smooth">
              {t.aboutUs}
            </Link>
            
            {/* Mobile-only login and emergency */}
            <div className="sm:hidden pt-4 border-t space-y-2">
              {!hideLoginButton && <Button variant="outline" className="w-full justify-start touch-target" aria-label="Login or Sign up" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    {t.login}
                  </Link>
                </Button>}
              
              <Button variant="outline" className="w-full justify-start touch-target border-medical-red text-medical-red hover:bg-medical-red hover:text-white" aria-label="Emergency services - call for immediate help" asChild>
                <Link to="/emergency">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t.emergency}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 top-16 bg-black/20 z-30" onClick={toggleMenu} aria-hidden="true" />}
      
      {/* Language dropdown overlay */}
      {isLanguageOpen && <div className="fixed inset-0 z-5" onClick={() => setIsLanguageOpen(false)} aria-hidden="true" />}
    </>;
}