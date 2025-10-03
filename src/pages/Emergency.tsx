import { useState } from "react";
import { Phone, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
interface EmergencyService {
  id: string;
  titleKey: string;
  number: string;
  callButtonKey: string;
  secondaryAction?: {
    text: string;
    action: () => void;
  };
}
export default function Emergency() {
  const {
    currentLanguage,
    changeLanguage,
    t
  } = useLanguage();
  const [isDispatcherInfoOpen, setIsDispatcherInfoOpen] = useState(false);

  // Emergency services data
  const emergencyServices: EmergencyService[] = [{
    id: "ambulance",
    titleKey: "AMBULANCE",
    number: "108",
    // India's national ambulance number
    callButtonKey: "CALL AMBULANCE"
  }, {
    id: "emergency-doctor",
    titleKey: "EMERGENCY DOCTOR",
    number: "01765-222444",
    // Nabha emergency doctor number
    callButtonKey: "CALL EMERGENCY DOCTOR"
  }, {
    id: "poison-control",
    titleKey: "POISON CONTROL / TOXIC EXPOSURE",
    number: "1066",
    // India's poison control helpline
    callButtonKey: "CALL POISON CONTROL"
  }, {
    id: "hospital",
    titleKey: "NEAREST HOSPITAL / TRAUMA CENTER",
    number: "01765-222555",
    // Nabha Civil Hospital emergency
    callButtonKey: "CALL HOSPITAL",
    secondaryAction: {
      text: "Get Directions",
      action: () => {
        window.open("https://maps.google.com?q=hospitals+near+Nabha+Punjab", "_blank");
      }
    }
  }, {
    id: "public-health",
    titleKey: "PUBLIC HEALTH HOTLINE",
    number: "1075",
    // India's national health helpline
    callButtonKey: "CALL HEALTH HOTLINE"
  }];
  const translations = {
    en: {
      urgentCare: "URGENT CARE",
      subtitle: "Immediate medical help and emergency contacts — call the right service below.",
      dispatcherTitle: "What to tell the dispatcher",
      stayCalm: "Stay calm and speak clearly",
      shareLocation: "Share your exact location",
      tellInjured: "Tell how many people are injured",
      dangerNote: "If life is in immediate danger — call your local emergency number directly.",
      getDirections: "Get Directions"
    },
    hi: {
      urgentCare: "तत्काल देखभाल",
      subtitle: "तत्काल चिकित्सा सहायता और आपातकालीन संपर्क — नीचे सही सेवा को कॉल करें।",
      dispatcherTitle: "डिस्पैचर को क्या बताना है",
      stayCalm: "शांत रहें और स्पष्ट रूप से बोलें",
      shareLocation: "अपना सटीक स्थान साझा करें",
      tellInjured: "बताएं कि कितने लोग घायल हैं",
      dangerNote: "यदि जीवन तत्काल खतरे में है — सीधे अपना स्थानीय आपातकालीन नंबर कॉल करें।",
      getDirections: "दिशा-निर्देश प्राप्त करें"
    },
    pa: {
      urgentCare: "ਤੁਰੰਤ ਦੇਖਭਾਲ",
      subtitle: "ਤੁਰੰਤ ਡਾਕਟਰੀ ਮਦਦ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ — ਹੇਠਾਂ ਸਹੀ ਸੇਵਾ ਨੂੰ ਕਾਲ ਕਰੋ।",
      dispatcherTitle: "ਡਿਸਪੈਚਰ ਨੂੰ ਕੀ ਦੱਸਣਾ ਹੈ",
      stayCalm: "ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਸਪਸ਼ਟ ਰੂਪ ਵਿੱਚ ਬੋਲੋ",
      shareLocation: "ਆਪਣਾ ਸਹੀ ਸਥਾਨ ਸਾਂਝਾ ਕਰੋ",
      tellInjured: "ਦੱਸੋ ਕਿ ਕਿੰਨੇ ਲੋਕ ਜ਼ਖਮੀ ਹਨ",
      dangerNote: "ਜੇ ਜੀਵਨ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੈ — ਸਿੱਧੇ ਆਪਣਾ ਸਥਾਨਕ ਐਮਰਜੈਂਸੀ ਨੰਬਰ ਕਾਲ ਕਰੋ।",
      getDirections: "ਦਿਸ਼ਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ"
    }
  };
  const currentT = translations[currentLanguage as keyof typeof translations] || translations.en;
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };
  return <div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            color: '#DC2626'
          }}>
              {currentT.urgentCare}
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto" style={{
            color: '#0B2A4A'
          }}>
              {currentT.subtitle}
            </p>
          </div>

          {/* Emergency Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {emergencyServices.map(service => <Card key={service.id} className="border-2 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Service Title */}
                  <h2 className="font-bold text-sm md:text-base mb-3" style={{
                color: '#0B2A4A'
              }}>
                    {service.titleKey}
                  </h2>
                  
                  {/* Phone Number */}
                  <div className="mb-4 flex-1">
                    <p className="text-2xl md:text-3xl font-bold mb-2" style={{
                  color: '#DC2626'
                }}>
                      {service.number}
                    </p>
                    {service.id === "hospital" && <p className="text-sm text-muted-foreground">
                        Nabha Civil Hospital, Nabha, Punjab
                      </p>}
                  </div>

                  {/* Primary Call Button */}
                  <Button onClick={() => handleCall(service.number)} className="w-full mb-3 h-12 text-white font-bold" style={{
                backgroundColor: '#DC2626'
              }} aria-label={`Call ${service.titleKey}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    {service.callButtonKey}
                  </Button>

                  {/* Secondary Action */}
                  {service.secondaryAction}
                </CardContent>
              </Card>)}
          </div>

          {/* Dispatcher Information */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <button onClick={() => setIsDispatcherInfoOpen(!isDispatcherInfoOpen)} className="w-full flex items-center justify-between text-left" aria-expanded={isDispatcherInfoOpen}>
                <h3 className="text-lg font-semibold" style={{
                color: '#0B2A4A'
              }}>
                  {currentT.dispatcherTitle}
                </h3>
                {isDispatcherInfoOpen ? <ChevronUp className="h-5 w-5" style={{
                color: '#0B2A4A'
              }} /> : <ChevronDown className="h-5 w-5" style={{
                color: '#0B2A4A'
              }} />}
              </button>
              
              {isDispatcherInfoOpen && <div className="mt-4 space-y-2">
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      {currentT.stayCalm}
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      {currentT.shareLocation}
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      {currentT.tellInjured}
                    </li>
                  </ul>
                </div>}
            </CardContent>
          </Card>

          {/* Emergency Warning Footer */}
          <div className="text-center">
            <p className="text-sm font-medium" style={{
            color: '#DC2626'
          }}>
              {currentT.dangerNote}
            </p>
          </div>

        </div>
      </main>
    </div>;
}