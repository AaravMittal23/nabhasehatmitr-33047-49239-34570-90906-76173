import { useState } from "react";
import { Phone, MapPin, Clock, Search, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logo.jpg";

// NOTE: When backend is connected, replace this static data with API data from GET /pharmacies
// Cards should render using backend fields: id, name, address, phone, hours, availability
interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

const pharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "Prem Medical Store",
    address: "Bhawra Bazar, Nabha, Punjab",
    phone: "+91 87279 10383",
    hours: "Daily: 08:00 – 22:00"
  },
  {
    id: "2", 
    name: "King Pharmacy",
    address: "Circular Road, Patel Nagar, Nabha, Punjab",
    phone: "+91 73553 22221",
    hours: "24 hours"
  },
  {
    id: "3",
    name: "Nabha Medical",
    address: "Bouran Gate, Malerkotla Road, Nabha, Punjab", 
    phone: "+91 99148 40056",
    hours: "Mon–Sat: 08:00 – 20:30; Sun: 10:00 – 20:30"
  },
  {
    id: "4",
    name: "Janaushadhi Nabha",
    address: "95M3+RJM, Alohran Kalan Rd, Moti Bagh, Nabha, Punjab",
    phone: "+91 98159 12022", 
    hours: "Daily: 08:30 – 20:30"
  },
  {
    id: "5",
    name: "Mittal Medical Hall",
    address: "Near Rotary Club, Patiala Gate, Nabha, Punjab",
    phone: "+91 99887 81708",
    hours: "Daily: 07:30 – 20:00"
  },
  {
    id: "6",
    name: "Vijay Health Care Vision - Nabha", 
    address: "Channo Rd, Nabha, Punjab",
    phone: "+91 98552 49979",
    hours: "Mon–Sat: 09:00 – 21:00"
  }
];

const API_BASE = import.meta.env.VITE_API_BASE || ""; // Will be set when backend is connected

export default function Pharmacies() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [medicineName, setMedicineName] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleCheckAvailability = async () => {
    if (!medicineName.trim() || !selectedPharmacy) return;

    setIsCheckingAvailability(true);
    setAvailabilityResult(null);

    if (!API_BASE) {
      // No backend connected yet
      setAvailabilityResult("We don't have live stock yet — we'll alert you when integrated. Please call the pharmacy to confirm.");
      setIsCheckingAvailability(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/pharmacies/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacy: selectedPharmacy.name,
          medicine: medicineName.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('API unavailable');
      }

      const data = await response.json();
      
      if (data.available) {
        setAvailabilityResult(`Available — ${data.details || "in stock"}`);
      } else {
        setAvailabilityResult("Not available at this pharmacy.");
      }
    } catch (error) {
      setAvailabilityResult("Availability unknown — we'll check later. Please call the pharmacy.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const openAvailabilityModal = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setMedicineName("");
    setAvailabilityResult(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPharmacy(null);
    setMedicineName("");
    setAvailabilityResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo={true}
      />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-montserrat text-4xl md:text-5xl font-bold text-primary mb-4">
              Pharmacies
            </h1>
            <p className="font-lato text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Local pharmacies with opening times, phone numbers and quick directions.
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by pharmacy name or area"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-lato pl-10 h-12"
                aria-label="Search pharmacies"
              />
            </div>
          </div>

          {/* Pharmacy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Pharmacy Name */}
                    <h3 className="font-montserrat text-xl font-bold text-navy">
                      {pharmacy.name}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="font-lato text-muted-foreground text-sm leading-relaxed">
                        {pharmacy.address}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-lato text-muted-foreground text-sm">
                          {pharmacy.phone}
                        </p>
                        <p className="font-lato text-xs text-muted-foreground/80 mt-1">
                          Tap to call — fast help
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-start space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="font-lato text-xs text-muted-foreground">
                        {pharmacy.hours}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        onClick={() => handleCall(pharmacy.phone)}
                        className="bg-pharmacy-blue hover:bg-pharmacy-blue/90 text-white font-lato font-medium rounded-lg h-11 flex-1"
                        style={{ minHeight: '44px' }}
                        aria-label={`Call ${pharmacy.name}`}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Pharmacy
                      </Button>
                      
                      <Button
                        onClick={() => handleGetDirections(pharmacy.address)}
                        className="bg-pharmacy-blue hover:bg-pharmacy-blue/90 text-white font-lato font-medium rounded-lg h-11 flex-1"
                        style={{ minHeight: '44px' }}
                        title="Open in Maps"
                        aria-label={`Get directions to ${pharmacy.name}`}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>

                    <Button
                      onClick={() => openAvailabilityModal(pharmacy)}
                      variant="outline"
                      className="w-full font-lato font-medium rounded-lg h-11 border-pharmacy-blue text-pharmacy-blue hover:bg-pharmacy-blue hover:text-white"
                      style={{ minHeight: '44px' }}
                      aria-label={`Check medicine availability at ${pharmacy.name}`}
                    >
                      Check medicine availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPharmacies.length === 0 && (
            <div className="text-center py-12">
              <p className="font-lato text-muted-foreground">
                No pharmacies found matching "{searchTerm}". Try searching with different terms.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Check Medicine Availability Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-montserrat font-bold">
              Check Medicine Availability
            </DialogTitle>
            {selectedPharmacy && (
              <p className="font-lato text-sm text-muted-foreground">
                {selectedPharmacy.name}
              </p>
            )}
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter medicine name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="font-lato"
                aria-label="Medicine name"
              />
            </div>

            {availabilityResult && (
              <div className={`p-3 rounded-lg text-sm font-lato ${
                availabilityResult.includes('Available') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : availabilityResult.includes('Not available')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {availabilityResult}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCheckAvailability}
                disabled={!medicineName.trim() || isCheckingAvailability}
                className="bg-pharmacy-blue hover:bg-pharmacy-blue/90 text-white font-lato font-medium rounded-lg flex-1"
                aria-label="Check availability"
              >
                {isCheckingAvailability ? "Checking..." : "Check"}
              </Button>
              
              <Button
                onClick={closeModal}
                variant="outline"
                className="font-lato font-medium rounded-lg border-gray-300"
                aria-label="Cancel"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="Nabha Sehat Mitr"
                  className="h-10 w-10 object-contain"
                />
                <h3 className="text-xl font-bold">
                  <span className="text-primary">Nabha</span>
                  <span className="text-healthcare-green">Sehat</span>
                  <span className="text-medical-red">Mitr</span>
                </h3>
              </div>
              <p className="text-sm text-black leading-relaxed">
                Your trusted healthcare companion in Nabha, Punjab. Find doctors, pharmacies, and emergency services.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  About Us
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Terms & Conditions
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">
                  Help & Support
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">+91 87977 60111, +91 95137 31600</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-black">nabhasehatmitr@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-healthcare-green" />
                  <span className="text-sm text-black">Nabha, Punjab, India</span> 
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-muted-foreground/20 mt-12 pt-8">
            <div className="text-center text-sm text-black">
              <p>&copy; 2025 NabhaSehatMitr. All rights reserved. | Providing quality healthcare services to Nabha and Punjab.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}