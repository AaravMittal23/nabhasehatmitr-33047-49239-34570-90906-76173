import { useState, useEffect } from "react";

export interface LanguageStrings {
  // Header
  loginSignup: string;
  emergency: string;
  
  // Hero Section
  heroTitle: string;
  heroDescription: string;
  findDoctorsBtn: string;
  emergencyServicesBtn: string;
  
  // Service Cards
  findDoctorsTitle: string;
  findDoctorsDesc: string;
  emergencyTitle: string;
  emergencyDesc: string;
  pharmacyTitle: string;
  pharmacyDesc: string;
  healthRecordsTitle: string;
  healthRecordsDesc: string;
  
  // Footer
  currentDateTime: string;
  contactInfo: string;
  quickLinks: string;
  aboutUs: string;
  termsConditions: string;
  privacyPolicy: string;
}

const translations: Record<string, LanguageStrings> = {
  en: {
    // Header
    loginSignup: "Login / Sign up",
    emergency: "Emergency",
    
    // Hero Section
    heroTitle: "Your Health, Our Priority",
    heroDescription: "Access comprehensive healthcare services, connect with qualified doctors, find nearby pharmacies, and manage your health records - all in one secure platform.",
    findDoctorsBtn: "Consult Available Physician",
    emergencyServicesBtn: "Emergency Services",
    
    // Service Cards
    findDoctorsTitle: "Find Doctors",
    findDoctorsDesc: "Connect with qualified medical professionals in your area",
    emergencyTitle: "Emergency Services",
    emergencyDesc: "24/7 immediate medical assistance and emergency care",
    pharmacyTitle: "Pharmacies",
    pharmacyDesc: "Locate and order from nearby pharmacies",
    healthRecordsTitle: "Health Records",
    healthRecordsDesc: "Securely manage and access your medical history",
    
    // Footer
    currentDateTime: "Current Date & Time",
    contactInfo: "Contact Information",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy"
  },
  
  hi: {
    // Header
    loginSignup: "लॉगिन / साइन अप",
    emergency: "आपातकाल",
    
    // Hero Section
    heroTitle: "आपका स्वास्थ्य, हमारी प्राथमिकता",
    heroDescription: "व्यापक स्वास्थ्य सेवाओं का उपयोग करें, योग्य डॉक्टरों से जुड़ें, नजदीकी फार्मेसी खोजें, और अपने स्वास्थ्य रिकॉर्ड का प्रबंधन करें - सब एक सुरक्षित प्लेटफॉर्म पर।",
    findDoctorsBtn: "उपलब्ध चिकित्सक से सलाह लें",
    emergencyServicesBtn: "आपातकालीन सेवाएं",
    
    // Service Cards
    findDoctorsTitle: "डॉक्टर खोजें",
    findDoctorsDesc: "अपने क्षेत्र के योग्य चिकित्सा पेशेवरों से जुड़ें",
    emergencyTitle: "आपातकालीन सेवाएं",
    emergencyDesc: "24/7 तत्काल चिकित्सा सहायता और आपातकालीन देखभाल",
    pharmacyTitle: "फार्मेसी",
    pharmacyDesc: "नजदीकी फार्मेसी का पता लगाएं और ऑर्डर करें",
    healthRecordsTitle: "स्वास्थ्य रिकॉर्ड",
    healthRecordsDesc: "अपने चिकित्सा इतिहास को सुरक्षित रूप से प्रबंधित और एक्सेस करें",
    
    // Footer
    currentDateTime: "वर्तमान दिनांक और समय",
    contactInfo: "संपर्क जानकारी",
    quickLinks: "त्वरित लिंक",
    aboutUs: "हमारे बारे में",
    termsConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति"
  },
  
  pa: {
    // Header
    loginSignup: "ਲਾਗਇਨ / ਸਾਈਨ ਅੱਪ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    
    // Hero Section
    heroTitle: "ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਤਰਜੀਹ",
    heroDescription: "ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾਵਾਂ ਦਾ ਪਹੁੰਚ ਬਣਾਓ, ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਜੁੜੋ, ਨੇੜਲੀ ਫਾਰਮੇਸੀ ਲੱਭੋ, ਅਤੇ ਆਪਣੇ ਸਿਹਤ ਰਿਕਾਰਡਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ - ਸਭ ਇੱਕ ਸੁਰੱਖਿਅਤ ਪਲੇਟਫਾਰਮ ਤੇ।",
    findDoctorsBtn: "ਉਪਲਬਧ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ",
    emergencyServicesBtn: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
    
    // Service Cards
    findDoctorsTitle: "ਡਾਕਟਰ ਲੱਭੋ",
    findDoctorsDesc: "ਆਪਣੇ ਖੇਤਰ ਦੇ ਯੋਗ ਮੈਡੀਕਲ ਪ੍ਰੋਫੈਸ਼ਨਲਾਂ ਨਾਲ ਜੁੜੋ",
    emergencyTitle: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
    emergencyDesc: "24/7 ਤੁਰੰਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ ਅਤੇ ਐਮਰਜੈਂਸੀ ਦੇਖਭਾਲ",
    pharmacyTitle: "ਫਾਰਮੇਸੀ",
    pharmacyDesc: "ਨੇੜਲੀ ਫਾਰਮੇਸੀ ਦਾ ਪਤਾ ਲਗਾਓ ਅਤੇ ਆਰਡਰ ਕਰੋ",
    healthRecordsTitle: "ਸਿਹਤ ਰਿਕਾਰਡ",
    healthRecordsDesc: "ਆਪਣੇ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੂਪ ਵਿੱਚ ਪ੍ਰਬੰਧਿਤ ਅਤੇ ਪਹੁੰਚ ਕਰੋ",
    
    // Footer
    currentDateTime: "ਮੌਜੂਦਾ ਮਿਤੀ ਅਤੇ ਸਮਾਂ",
    contactInfo: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
    quickLinks: "ਤੁਰੰਤ ਲਿੰਕਸ",
    aboutUs: "ਸਾਡੇ ਬਾਰੇ",
    termsConditions: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
    privacyPolicy: "ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ"
  }
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('nabha-sehat-language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);
  
  const changeLanguage = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    localStorage.setItem('nabha-sehat-language', newLanguage);
  };
  
  const t = translations[currentLanguage] || translations.en;
  
  return {
    currentLanguage,
    changeLanguage,
    t
  };
}