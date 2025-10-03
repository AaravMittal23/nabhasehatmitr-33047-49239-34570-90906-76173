import { useState, useRef, useEffect } from "react";
import { X, Send, Phone, Calendar, FileText, MessageCircle, Maximize2, Minimize2, Stethoscope, Users, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { SymptomChecker } from "./SymptomChecker";
import { TriageDisplay, assessSymptoms, TriageResult } from "./TriageSystem";
import { SpecialistRecommendation } from "./SpecialistRecommendation";
import { AppointmentBooking } from "./AppointmentBooking";
import { MedicalHistoryForm } from "./MedicalHistoryForm";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  type: 'emergency' | 'appointment' | 'pharmacy' | 'contact' | 'demo' | 'symptom-check' | 'specialist' | 'history';
}

const RobotIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="NabhaSehatMitr assistant"
  >
    {/* Robot head */}
    <rect
      x="12"
      y="18"
      width="40"
      height="32"
      rx="8"
      fill="white"
      stroke="#0B2A4A"
      strokeWidth="2"
    />
    
    {/* Left eye */}
    <circle cx="22" cy="28" r="4" fill="#45A06B" />
    <circle cx="22" cy="28" r="2" fill="white" />
    
    {/* Right eye */}
    <circle cx="42" cy="28" r="4" fill="#45A06B" />
    <circle cx="42" cy="28" r="2" fill="white" />
    
    {/* Smile */}
    <path
      d="M24 38 Q32 44 40 38"
      stroke="#0B2A4A"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Antenna */}
    <line
      x1="32"
      y1="18"
      x2="32"
      y2="8"
      stroke="#0B2A4A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="32" cy="6" r="3" fill="#D04B42" />
  </svg>
);

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'symptom-check' | 'specialist' | 'appointment' | 'history'>('chat');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [userSymptoms, setUserSymptoms] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  // Emergency keywords for detection
  const emergencyKeywords = [
    'unconscious', 'not breathing', 'no pulse', 'severe chest pain', 'chest pain',
    'heavy bleeding', 'severe bleeding', 'seizure', 'sudden severe weakness',
    'blue lips', 'difficulty breathing', 'loss of consciousness'
  ];

  // Translations for bot messages
  const botMessages = {
    en: {
      greeting: "Hi 👋, I'm NabhaCare Assistant. I can share quick first-aid steps and basic health guidance. I am not a doctor, so for emergencies or if symptoms persist, please consult a doctor. How may I help you today?",
      emergency: "This may be life-threatening. If someone is unconscious, having severe chest pain, uncontrolled bleeding, or severe trouble breathing — call emergency services now or go to the nearest emergency department.",
      noDiagnosis: "I can't provide a diagnosis. Please consult a doctor.",
      noMedicine: "I'm not able to recommend medicines or doses. For safe treatment, please ask a pharmacist or doctor.",
      followUp: "I hope this helps. Would you like me to book an appointment?",
      greeting_response: "Hello! How are you feeling today?",
      redirect: "I'm here to help with health concerns. Can you describe what you're feeling?",
      callEmergency: "Call Emergency",
      bookAppointment: "Book Appointment",
      speakToHuman: "Speak to Human",
      symptomChecker: "Check Symptoms",
      findSpecialist: "Find Specialist",
      medicalHistory: "Medical History"
    },
    hi: {
      greeting: "नमस्ते 👋, मैं नभाकेयर सहायक हूँ। मैं त्वरित प्राथमिक चिकित्सा और बुनियादी स्वास्थ्य मार्गदर्शन साझा कर सकता हूँ। मैं डॉक्टर नहीं हूँ, इसलिए आपातकाल या यदि लक्षण बने रहते हैं तो कृपया डॉक्टर से सलाह लें। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      emergency: "यह जानलेवा हो सकता है। अगर कोई बेहोश है, सीने में तेज़ दर्द है, बहुत खून बह रहा है, या सांस लेने में बहुत दिक़्क़त है — तुरंत इमरजेंसी नंबर पर कॉल करें या नज़दीकी अस्पताल जाएँ।",
      noDiagnosis: "मैं निदान नहीं दे सकता। कृपया डॉक्टर से परामर्श करें।",
      noMedicine: "मैं दवाइयों या खुराक की सिफारिश नहीं कर सकता। सुरक्षित उपचार के लिए कृपया किसी फार्मासिस्ट या डॉक्टर से पूछें।",
      followUp: "मुझे उम्मीद है कि यह मदद करेगा। क्या आप चाहेंगे कि मैं अपॉइंटमेंट बुक करूं?",
      greeting_response: "नमस्ते! आज आप कैसा महसूस कर रहे हैं?",
      redirect: "मैं स्वास्थ्य संबंधी चिंताओं में मदद के लिए यहाँ हूँ। क्या आप बता सकते हैं कि आप क्या महसूस कर रहे हैं?",
      callEmergency: "इमरजेंसी कॉल",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      speakToHuman: "व्यक्ति से बात करें",
      symptomChecker: "लक्षण जांच",
      findSpecialist: "विशेषज्ञ खोजें",
      medicalHistory: "चिकित्सा इतिहास"
    },
    pa: {
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ 👋, ਮੈਂ ਨਾਭਾਕੇਅਰ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਮੈਂ ਤੇਜ਼ ਪਹਿਲੀ ਸਹਾਇਤਾ ਅਤੇ ਬੁਨਿਆਦੀ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ ਸਾਂਝਾ ਕਰ ਸਕਦਾ ਹਾਂ। ਮੈਂ ਡਾਕਟਰ ਨਹੀਂ ਹਾਂ, ਇਸਲਈ ਐਮਰਜੈਂਸੀ ਜਾਂ ਜੇ ਲੱਛਣ ਬਣੇ ਰਹਿੰਦੇ ਹਨ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
      emergency: "ਇਹ ਜ਼ਿੰਦਗੀ-ਖ਼ਤਰਨਾਕ ਹੋ ਸਕਦਾ ਹੈ। ਜੇ ਕੋਈ ਬੇਹੋਸ਼ ਹੈ, ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ ਹੈ, ਜ਼ਿਆਦਾ ਖੂਨ ਬਹਿ ਰਿਹਾ ਹੈ ਜਾਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੈ — ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ।",
      noDiagnosis: "ਮੈਂ ਨਿਦਾਨ ਨਹੀਂ ਦੇ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      noMedicine: "ਮੈਂ ਦਵਾਈਆਂ ਜਾਂ ਖੁਰਾਕ ਦੀ ਸਿਫਾਰਿਸ਼ ਨਹੀਂ ਕਰ ਸਕਦਾ। ਸੁਰੱਖਿਤ ਇਲਾਜ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਕਿਸੇ ਫਾਰਮਾਸਿਸਟ ਜਾਂ ਡਾਕਟਰ ਨੂੰ ਪੁੱਛੋ।",
      followUp: "ਮੈਨੂੰ ਉਮੀਦ ਹੈ ਕਿ ਇਹ ਮਦਦ ਕਰੇਗਾ। ਕੀ ਤੁਸੀਂ ਚਾਹੋਗੇ ਕਿ ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰਾਂ?",
      greeting_response: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਅੱਜ ਤੁਸੀਂ ਕਿਹੋ ਜਿਹਾ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
      redirect: "ਮੈਂ ਸਿਹਤ ਸੰਬੰਧੀ ਚਿੰਤਾਵਾਂ ਵਿੱਚ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ। ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਤੁਸੀਂ ਕੀ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
      callEmergency: "ਐਮਰਜੈਂਸੀ ਕਾਲ",
      bookAppointment: "ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
      speakToHuman: "ਇਨਸਾਨ ਨਾਲ ਗੱਲ ਕਰੋ",
      symptomChecker: "ਲੱਛਣ ਜਾਂਚ",
      findSpecialist: "ਮਾਹਿਰ ਲੱਭੋ",
      medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ"
    }
  };

  const currentMessages = botMessages[currentLanguage as keyof typeof botMessages] || botMessages.en;

  // Check if message contains emergency keywords
  const isEmergency = (message: string) => {
    return emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Generate bot response
  const getBotResponse = (userMessage: string): { text: string; quickActions?: QuickAction[] } => {
    const message = userMessage.toLowerCase();
    
    // Emergency detection
    if (isEmergency(message)) {
      return {
        text: currentMessages.emergency,
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' }
        ]
      };
    }

    // Greetings
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') ||
        message.includes('नमस्ते') || message.includes('हैलो') ||
        message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ') || message.includes('ਹੈਲੋ')) {
      return {
        text: currentMessages.greeting_response,
        quickActions: [
          { label: currentMessages.symptomChecker, action: 'symptom-check', type: 'symptom-check' },
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    // Medicine/diagnosis refusal
    if (message.includes('dose') || message.includes('medicine') || message.includes('prescription') || 
        message.includes('diagnose') || message.includes('what do i have')) {
      return {
        text: message.includes('dose') || message.includes('medicine') ? 
          currentMessages.noMedicine : currentMessages.noDiagnosis,
        quickActions: [
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    // Symptom-based responses with simple home remedies
    if (message.includes('fever')) {
      return {
        text: "Drink fluids, take rest. Take a paracetamol if fever is above 100°F. If fever persists, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('headache')) {
      return {
        text: "Rest in a quiet, dark room and drink water. Apply a cool compress to your forehead. If headache is severe or continues, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('dizziness') || message.includes('dizzy')) {
      return {
        text: "Sit or lie down in a cool place and drink water slowly. Avoid sudden movements. If dizziness continues, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('stomach') || message.includes('stomach ache') || message.includes('nausea')) {
      return {
        text: "Drink small sips of water and rest. Try eating plain foods like rice or bananas. Avoid spicy foods. If pain is severe or continues, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('throat') || message.includes('sore throat')) {
      return {
        text: "Drink hot water or tea, and try gargling with warm salt water. If sore throat continues, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('cough')) {
      return {
        text: "Drink warm water with honey and lemon. Rest your voice and avoid cold drinks. If cough persists or has blood, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('sprain') || message.includes('ankle') || message.includes('injury')) {
      return {
        text: "Apply ice wrapped in cloth for 15-20 minutes. Rest and elevate the injured area. Use compression bandage if available. If swelling is severe, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    if (message.includes('cut') || message.includes('bleeding')) {
      return {
        text: "Clean your hands first. Apply direct pressure with a clean cloth to stop bleeding. Clean the wound with water and apply a bandage. If bleeding won't stop, consult a doctor.",
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    // Check if message is random/unrelated
    const healthKeywords = ['pain', 'hurt', 'sick', 'feel', 'symptom', 'health', 'medical', 'doctor'];
    const hasHealthKeyword = healthKeywords.some(keyword => message.includes(keyword));
    
    if (!hasHealthKeyword && message.length < 50) {
      return {
        text: currentMessages.redirect,
        quickActions: [
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
        ]
      };
    }

    // Default response for other health concerns
    return {
      text: `I understand you're concerned about "${userMessage}". For proper evaluation of your symptoms, I recommend consulting with a healthcare professional. ${currentMessages.followUp}`,
      quickActions: [
        { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
        { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
      ]
    };
  };

  // Handle quick action clicks
  const handleQuickAction = (action: string, type: string) => {
    switch (type) {
      case 'emergency':
        navigate('/emergency');
        break;
      case 'appointment':
        setActiveView('appointment');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'symptom-check':
        setActiveView('symptom-check');
        break;
      case 'specialist':
        setActiveView('specialist');
        break;
      case 'history':
        setActiveView('history');
        break;
    }
  };

  // Handle symptom checker submission
  const handleSymptomSubmit = (data: any) => {
    const result = assessSymptoms({
      symptoms: data.selectedSymptoms,
      duration: data.duration,
      intensity: data.intensity,
      additionalSymptoms: []
    });
    
    setTriageResult(result);
    setUserSymptoms(data.selectedSymptoms);
    
    // Add message about assessment
    addBotMessage(`Based on your symptoms, I've completed an assessment. ${result.recommendation}`, [
      { label: currentMessages.findSpecialist, action: 'specialist', type: 'specialist' },
      { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
      { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' }
    ]);
    
    setActiveView('chat');
  };

  // Handle specialist booking
  const handleSpecialistBooking = (specialist: any) => {
    addBotMessage(`Great choice! Let's book an appointment with ${specialist.name}.`, []);
    setActiveView('appointment');
  };

  // Handle appointment booking completion
  const handleBookingComplete = (booking: any) => {
    addBotMessage(`Your appointment has been successfully booked with ${booking.doctorName} on ${booking.date.toDateString()} at ${booking.time}.`, [
      { label: currentMessages.medicalHistory, action: 'history', type: 'history' },
      { label: currentMessages.speakToHuman, action: 'contact', type: 'contact' }
    ]);
    setActiveView('chat');
  };

  // Handle medical history save
  const handleHistorySave = (history: any) => {
    addBotMessage("Your medical history has been saved securely on your device. This information can help healthcare providers give you better care.", [
      { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
      { label: currentMessages.symptomChecker, action: 'symptom-check', type: 'symptom-check' }
    ]);
    setActiveView('chat');
  };

  // Add messages to chat
  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addBotMessage = (text: string, quickActions: QuickAction[] = []) => {
    const message: Message = {
      id: Date.now().toString() + '_bot',
      text,
      isUser: false,
      timestamp: new Date(),
      quickActions
    };
    setMessages(prev => [...prev, message]);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(userMsg);
      addBotMessage(response.text, response.quickActions || []);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(currentMessages.greeting, [
          { label: currentMessages.symptomChecker, action: 'symptom-check', type: 'symptom-check' },
          { label: currentMessages.callEmergency, action: 'emergency', type: 'emergency' },
          { label: currentMessages.bookAppointment, action: 'appointment', type: 'appointment' },
          { label: currentMessages.medicalHistory, action: 'history', type: 'history' }
        ]);
      }, 500);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-4 bg-background border border-border rounded-lg shadow-lg z-50 transition-all duration-200 ${
          isExpanded 
            ? 'w-[480px] h-[600px]' 
            : 'w-80 md:w-96 h-96'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <RobotIcon className="w-6 h-6" />
              <span className="font-medium">NabhaCare Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isExpanded ? 'h-[480px]' : 'h-64'
          }`}>
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
                
                {/* Quick Actions */}
                {message.quickActions && message.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action, action.type)}
                        className="text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-2 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={isTyping || !inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-4 right-4 z-50 transition-all duration-200 hover:scale-106 hover:shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-label="Open NabhaSehatMitr assistant chat"
      >
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center">
            {isOpen ? (
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            ) : (
              <RobotIcon className="w-10 h-10 md:w-12 md:h-12" />
            )}
          </div>
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </>
  );
}