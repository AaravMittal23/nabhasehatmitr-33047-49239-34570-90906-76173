import { useState, useEffect } from "react";
import { Stethoscope, AlertTriangle, Pill, FileText, MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "./Header";
import { ServiceCard } from "./ServiceCard";
import { PendingAppointments } from "./PendingAppointments";
import { ConsultModal } from "./ConsultModal";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logo.jpg";

// Homepage-specific translations
const homepageTranslations = {
  en: {
    siteNamePart1: "Health",
    siteNamePart2: "Connect",
    siteNamePart3: "",
    heroTitle: "Your Health, Our Priority",
    heroDescription: "Access comprehensive healthcare services — connect with verified doctors and manage medical records.",
    ctaPrimary: "Consult Available Physician",
    ctaSecondary: "Emergency Services",
    findDoctorsTitle: "Find Doctors",
    emergencyTitle: "Emergency Services",
    pharmacyTitle: "Pharmacies",
    healthRecordsTitle: "Health Records",
    calendarTitle: "Calendar",
    findDoctorsDescription: "Connect with verified doctors and specialists for consultations and medical advice.",
    emergencyDescription: "Get immediate help for medical emergencies and urgent health situations.",
    pharmacyDescription: "Find nearby pharmacies and check medicine availability in your area.",
    healthRecordsDescription: "Access and manage your medical records, prescriptions, and health reports.",
    calendarDescription: "View and manage your appointments, lab tests, and health events in one place.",
    findDoctorsCta: "Book Appointment",
    emergencyCta: "Emergency",
    pharmacyCta: "Locate Nearby Pharmacy",
    healthRecordsCta: "Health Records",
    calendarCta: "View Calendar",
    currentDateTime: "Current Date & Time",
    contactInfo: "Contact Information",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    helpSupport: "Help & Support"
  },
  hi: {
    siteNamePart1: "हेल्थ",
    siteNamePart2: "कनेक्ट",
    siteNamePart3: "",
    heroTitle: "आपका स्वास्थ्य, हमारी प्राथमिकता",
    heroDescription: "व्यापक स्वास्थ्य सेवाएँ — सत्यापित डॉक्टरों से जुड़ें और मेडिकल रिकॉर्ड प्रबंधित करें।",
    ctaPrimary: "उपलब्ध चिकित्सक से परामर्श",
    ctaSecondary: "आपातकालीन सेवाएँ",
    findDoctorsTitle: "डॉक्टर्स खोजें",
    emergencyTitle: "आपातकालीन सेवाएँ",
    pharmacyTitle: "फार्मेसियां",
    healthRecordsTitle: "स्वास्थ्य रिकॉर्ड",
    calendarTitle: "कैलेंडर",
    findDoctorsDescription: "सत्यापित डॉक्टरों और विशेषज्ञों से परामर्श और चिकित्सा सलाह के लिए जुड़ें।",
    emergencyDescription: "चिकित्सा आपातकाल और तत्काल स्वास्थ्य स्थितियों के लिए तुरंत सहायता प्राप्त करें।",
    pharmacyDescription: "नज़दीकी फार्मेसियां खोजें और अपने क्षेत्र में दवाओं की उपलब्धता जांचें।",
    healthRecordsDescription: "अपने चिकित्सा रिकॉर्ड, नुस्खे और स्वास्थ्य रिपोर्ट तक पहुंचें और प्रबंधित करें।",
    calendarDescription: "अपने अपॉइंटमेंट, लैब टेस्ट और स्वास्थ्य इवेंट्स को एक जगह देखें और प्रबंधित करें।",
    findDoctorsCta: "अपॉइंटमेंट बुक करें",
    emergencyCta: "आपातकाल",
    pharmacyCta: "नज़दीकी फ़ार्मेसी खोजें",
    healthRecordsCta: "रिपोर्ट्स/रिपोर्ट देखें",
    calendarCta: "कैलेंडर देखें",
    currentDateTime: "वर्तमान दिनांक और समय",
    contactInfo: "संपर्क जानकारी",
    quickLinks: "त्वरित लिंक",
    contactUs: "संपर्क करें",
    termsConditions: "नियम और शर्तें",
    privacyPolicy: "गोपनीयता नीति",
    helpSupport: "सहायता और समर्थन"
  },
  pa: {
    siteNamePart1: "ਹੈਲਥ",
    siteNamePart2: "ਕਨੈਕਟ",
    siteNamePart3: "",
    heroTitle: "ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਪ੍ਰਾਥਮਿਕਤਾ",
    heroDescription: "ਵਿਆਪਕ ਸਿਹਤ ਸੇਵਾਵਾਂ — ਪਕੀ ਕੀਤੇ ਡਾਕਟਰੀਂ ਨਾਲ ਜੁੜੋ ਅਤੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਸੰਭਾਲੋ।",
    ctaPrimary: "ਉਪਲਬਧ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ",
    ctaSecondary: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
    findDoctorsTitle: "ਡਾਕਟਰ ਲੱਭੋ",
    emergencyTitle: "ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ",
    pharmacyTitle: "ਫਾਰਮੇਸੀ",
    healthRecordsTitle: "ਸਿਹਤ ਰਿਕਾਰਡ",
    calendarTitle: "ਕੈਲੰਡਰ",
    findDoctorsDescription: "ਪਰਾਮਰਸ਼ ਅਤੇ ਡਾਕਟਰੀ ਸਲਾਹ ਲਈ ਪ੍ਰਮਾਣਿਤ ਡਾਕਟਰਾਂ ਅਤੇ ਮਾਹਿਰਾਂ ਨਾਲ ਜੁੜੋ।",
    emergencyDescription: "ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਅਤੇ ਤੁਰੰਤ ਸਿਹਤ ਸਥਿਤੀਆਂ ਲਈ ਤੁਰੰਤ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ।",
    pharmacyDescription: "ਨਜ਼ਦੀਕੀ ਫਾਰਮੇਸੀ ਲੱਭੋ ਅਤੇ ਆਪਣੇ ਖੇਤਰ ਵਿੱਚ ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ ਚੈੱਕ ਕਰੋ।",
    healthRecordsDescription: "ਆਪਣੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ, ਨੁਸਖੇ ਅਤੇ ਸਿਹਤ ਰਿਪੋਰਟਾਂ ਤੱਕ ਪਹੁੰਚ ਕਰੋ ਅਤੇ ਪ੍ਰਬੰਧ ਕਰੋ।",
    calendarDescription: "ਆਪਣੇ ਅਪਾਇੰਟਮੈਂਟ, ਲੈਬ ਟੈਸਟ ਅਤੇ ਸਿਹਤ ਈਵੈਂਟਸ ਨੂੰ ਇੱਕ ਥਾਂ ਤੇ ਵੇਖੋ ਅਤੇ ਪ੍ਰਬੰਧ ਕਰੋ।",
    findDoctorsCta: "ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
    emergencyCta: "ਐਮਰਜੈਂਸੀ",
    pharmacyCta: "ਨੇੜੇ ਦੀਆਂ ਫਾਰਮੇਸੀ ਲੱਭੋ",
    healthRecordsCta: "ਰਿਪੋਰਟਸ/ਡਾਉਨਲੋਡ",
    calendarCta: "ਕੈਲੰਡਰ ਵੇਖੋ",
    currentDateTime: "ਮੌਜੂਦਾ ਮਿਤੀ ਅਤੇ ਸਮਾਂ",
    contactInfo: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
    quickLinks: "ਤੁਰੰਤ ਲਿੰਕਸ",
    contactUs: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    termsConditions: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
    privacyPolicy: "ਪ੍ਰਾਈਵੇਸੀ ਨੀਤੀ",
    helpSupport: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ"
  }
};
export function HomePage() {
  const {
    currentLanguage,
    changeLanguage
  } = useLanguage();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get translations for current language
  const t = homepageTranslations[currentLanguage as keyof typeof homepageTranslations] || homepageTranslations.en;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const formatDateTime = (date: Date, language: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const locales = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN'
    };
    return date.toLocaleDateString(locales[language as keyof typeof locales] || 'en-IN', options);
  };
  const handleServiceClick = (service: string) => {
    console.log(`Navigating to ${service}`);
    // Placeholder for navigation - will be implemented when building other pages
  };
  const handleFindDoctorsClick = () => {
    navigate('/find-doctor');
  };
  const handleConsultClick = () => {
    setIsConsultModalOpen(true);
  };
  const closeConsultModal = () => {
    setIsConsultModalOpen(false);
  };
  return <div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-background via-accent/30 to-healthcare-green/10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">

            {/* Logo and Site Title */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <img src={logo} alt="Health Connect Logo" className="h-20 w-20 object-contain" />
              <div className="flex items-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                  <span style={{
                  color: '#0B2A4A'
                }}>{t.siteNamePart1} </span>
                  <span style={{
                  color: '#45A06B'
                }}>{t.siteNamePart2}</span>
                </h1>
              </div>
            </div>

            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
                  {t.heroTitle}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t.heroDescription}
                </p>
              </div>

              <div className="flex justify-center">
                
              </div>
            </div>

          </div>
        </section>

        {/* Consult Modal */}
        <ConsultModal isOpen={isConsultModalOpen} onClose={closeConsultModal} />

        {/* Services Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceCard icon={Stethoscope} title={t.findDoctorsTitle} description={t.findDoctorsDescription} buttonText={t.findDoctorsCta} onClick={() => navigate('/find-doctor')} />
              
              <ServiceCard icon={AlertTriangle} title={t.emergencyTitle} description={t.emergencyDescription} buttonText={t.emergencyCta} onClick={() => navigate('/emergency')} variant="emergency" />
              
              <ServiceCard icon={FileText} title={t.healthRecordsTitle} description={t.healthRecordsDescription} buttonText={t.healthRecordsCta} onClick={() => navigate('/reports')} variant="health-records" />
              
              <ServiceCard icon={Calendar} title={t.calendarTitle} description={t.calendarDescription} buttonText={t.calendarCta} onClick={() => navigate('/calendar')} />
            </div>
          </div>
        </section>

        {/* Pending Appointments Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <PendingAppointments />
          </div>
        </section>

        {/* Current Date and Time Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-r from-healthcare-green/5 to-coral/5 border-healthcare-green/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="h-5 w-5 text-healthcare-green" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t.currentDateTime}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {formatDateTime(currentDateTime, currentLanguage)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Health Connect" className="h-10 w-10 object-contain" />
                <h3 className="text-xl font-bold">
                  <span style={{
                  color: '#0B2A4A'
                }}>{t.siteNamePart1} </span>
                  <span style={{
                  color: '#45A06B'
                }}>{t.siteNamePart2}</span>
                </h3>
              </div>
              <p className="text-sm text-black leading-relaxed">
                {t.heroDescription}
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">{t.quickLinks}</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  {t.contactUs}
                </Link>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  {t.termsConditions}
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  {t.privacyPolicy}
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  {t.helpSupport}
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">{t.contactInfo}</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">+91 8800852822, +91 9899489078</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">daamn32322@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">Chennai, Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-muted-foreground/20 mt-12 pt-8">
            <div className="text-center text-sm text-black">
              <p>&copy; 2025 HealthConnect. All rights reserved. | Providing quality healthcare services.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}