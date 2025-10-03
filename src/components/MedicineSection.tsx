import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Medicine {
  id: string;
  name: string;
  timeSlot: string;
  daysLeft: number;
}

interface MedicineSectionProps {
  t: any;
  currentLanguage: string;
}

// Medicine section translations
const medicineTranslations = {
  en: {
    yourMedicine: "Your Medicine",
    add: "Add",
    addNewMedicine: "Add New Medicine",
    medicineName: "Medicine Name",
    enterMedicineName: "Enter medicine name",
    timeSlot: "Time Slot",
    selectTimeSlot: "Select time slot",
    morning: "Morning",
    afternoon: "Afternoon", 
    evening: "Evening",
    night: "Night",
    daysLeft: "Days Left",
    enterDays: "Enter number of days",
    addMedicine: "Add Medicine",
    noMedicines: "No medicines added yet. Click \"Add\" to add your first medicine.",
    daysLeftSuffix: "days left"
  },
  hi: {
    yourMedicine: "आपकी दवाइयां",
    add: "जोड़ें",
    addNewMedicine: "नई दवा जोड़ें",
    medicineName: "दवा का नाम",
    enterMedicineName: "दवा का नाम दर्ज करें",
    timeSlot: "समय स्लॉट",
    selectTimeSlot: "समय स्लॉट का चयन करें",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात",
    daysLeft: "दिन बाकी",
    enterDays: "दिनों की संख्या दर्ज करें",
    addMedicine: "दवा जोड़ें",
    noMedicines: "अभी तक कोई दवाइयां नहीं जोड़ी गईं। अपनी पहली दवा जोड़ने के लिए \"जोड़ें\" पर क्लिक करें।",
    daysLeftSuffix: "दिन बाकी"
  },
  pa: {
    yourMedicine: "ਤੁਹਾਡੀਆਂ ਦਵਾਈਆਂ",
    add: "ਸ਼ਾਮਲ ਕਰੋ",
    addNewMedicine: "ਨਵੀਂ ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ",
    medicineName: "ਦਵਾਈ ਦਾ ਨਾਮ",
    enterMedicineName: "ਦਵਾਈ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ",
    timeSlot: "ਸਮਾਂ ਸਲਾਟ",
    selectTimeSlot: "ਸਮਾਂ ਸਲਾਟ ਚੁਣੋ",
    morning: "ਸਵੇਰ",
    afternoon: "ਦੁਪਹਿਰ",
    evening: "ਸ਼ਾਮ",
    night: "ਰਾਤ",
    daysLeft: "ਦਿਨ ਬਾਕੀ",
    enterDays: "ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ ਦਰਜ ਕਰੋ",
    addMedicine: "ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ",
    noMedicines: "ਅਜੇ ਤੱਕ ਕੋਈ ਦਵਾਈਆਂ ਸ਼ਾਮਲ ਨਹੀਂ ਹੋਈਆਂ। ਆਪਣੀ ਪਹਿਲੀ ਦਵਾਈ ਸ਼ਾਮਲ ਕਰਨ ਲਈ \"ਸ਼ਾਮਲ ਕਰੋ\" ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    daysLeftSuffix: "ਦਿਨ ਬਾਕੀ"
  }
};

export function MedicineSection({ t, currentLanguage }: MedicineSectionProps) {
  const mt = medicineTranslations[currentLanguage as keyof typeof medicineTranslations] || medicineTranslations.en;
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Modafinil 200mg",
      timeSlot: "morning",
      daysLeft: 15
    },
    {
      id: "2", 
      name: "Iron Sulfate 325mg",
      timeSlot: "morning",
      daysLeft: 22
    },
    {
      id: "3",
      name: "Coenzyme Q10 100mg", 
      timeSlot: "afternoon",
      daysLeft: 18
    },
    {
      id: "4",
      name: "Methylphenidate 10mg",
      timeSlot: "morning", 
      daysLeft: 12
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    timeSlot: "",
    daysLeft: ""
  });

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.timeSlot && newMedicine.daysLeft) {
      const medicine: Medicine = {
        id: Date.now().toString(),
        name: newMedicine.name,
        timeSlot: newMedicine.timeSlot,
        daysLeft: parseInt(newMedicine.daysLeft)
      };
      
      setMedicines([...medicines, medicine]);
      setNewMedicine({ name: "", timeSlot: "", daysLeft: "" });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            {mt.yourMedicine}
          </h2>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-healthcare-green hover:bg-healthcare-green/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {mt.add}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{mt.addNewMedicine}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="medicine-name">{mt.medicineName}</Label>
                  <Input
                    id="medicine-name"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                    placeholder={mt.enterMedicineName}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-slot">{mt.timeSlot}</Label>
                  <Select 
                    value={newMedicine.timeSlot} 
                    onValueChange={(value) => setNewMedicine({...newMedicine, timeSlot: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={mt.selectTimeSlot} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">{mt.morning}</SelectItem>
                      <SelectItem value="afternoon">{mt.afternoon}</SelectItem>
                      <SelectItem value="evening">{mt.evening}</SelectItem>
                      <SelectItem value="night">{mt.night}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="days-left">{mt.daysLeft}</Label>
                  <Input
                    id="days-left"
                    type="number"
                    value={newMedicine.daysLeft}
                    onChange={(e) => setNewMedicine({...newMedicine, daysLeft: e.target.value})}
                    placeholder={mt.enterDays}
                    min="1"
                  />
                </div>
                
                <Button 
                  onClick={handleAddMedicine}
                  className="w-full bg-healthcare-green hover:bg-healthcare-green/90 text-white"
                >
                  {mt.addMedicine}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {medicines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{mt.noMedicines}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className="relative bg-white shadow-sm hover:shadow-md transition-shadow">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 left-2 p-1 h-auto text-medical-red hover:text-medical-red hover:bg-medical-red/10"
                  onClick={() => handleDeleteMedicine(medicine.id)}
                  aria-label={`Delete ${medicine.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <CardContent className="p-4 pt-10">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-lg text-primary line-clamp-2">
                      {medicine.name}
                    </h3>
                    
                    <div className="py-2">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {mt[medicine.timeSlot as keyof typeof mt] || medicine.timeSlot}
                      </span>
                    </div>
                    
                    <div className="pt-1">
                      <span className="text-2xl font-bold text-healthcare-green">
                        {medicine.daysLeft}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {mt.daysLeftSuffix}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}