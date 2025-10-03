import { useState } from "react";
import { Search, Filter, X, User, Calendar, Clock, Stethoscope, Heart, Baby, ArrowLeft, Check, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { Textarea } from "@/components/ui/textarea";
const departments = ["General Medicine", "Pediatrics", "Gynecology", "ENT", "Orthopedics", "Cardiology"];
interface Doctor {
  id: string;
  name: string;
  hospital: string;
  qualifications: string;
  bio: string;
  specialty: string;
  availableSlots: string[];
  icon: any;
}

// Demo doctors with exact data as specified
const demoDoctors: Doctor[] = [{
  id: "1",
  name: "Dr. Meera Sharma",
  hospital: "Nabha Civil Hospital",
  qualifications: "MBBS, MD (General Medicine)",
  bio: "Primary care & emergency medicine.",
  specialty: "General Medicine",
  availableSlots: ["Today 09:00", "Today 09:15", "Today 09:30", "Today 09:45", "Today 10:00", "Today 10:15"],
  icon: Stethoscope
}, {
  id: "2",
  name: "Dr. Amanpreet Kaur",
  hospital: "District Hospital Nabha",
  qualifications: "MBBS, DNB (Pediatrics)",
  bio: "Child health & vaccines.",
  specialty: "Pediatrics",
  availableSlots: ["Today 14:00", "Today 14:15", "Today 14:30", "Today 14:45", "Today 15:00", "Today 15:15"],
  icon: Baby
}, {
  id: "3",
  name: "Dr. Rajesh Kumar",
  hospital: "Nabha Community Clinic",
  qualifications: "MBBS, MS (Orthopedics)",
  bio: "Bones & injuries.",
  specialty: "Orthopedics",
  availableSlots: ["Tomorrow 10:00", "Tomorrow 10:15", "Tomorrow 10:30", "Tomorrow 10:45", "Tomorrow 11:00", "Tomorrow 11:15", "Tomorrow 11:30", "Tomorrow 11:45", "Tomorrow 12:00"],
  icon: Stethoscope
}, {
  id: "4",
  name: "Dr. Sunita Verma",
  hospital: "Nabha Women's Health Centre",
  qualifications: "MBBS, DGO",
  bio: "Women & maternal health.",
  specialty: "Gynecology",
  availableSlots: ["Tomorrow 09:00", "Tomorrow 09:15", "Tomorrow 09:30", "Tomorrow 09:45", "Tomorrow 10:00", "Tomorrow 10:15", "Tomorrow 10:30", "Tomorrow 10:45", "Tomorrow 11:00"],
  icon: Stethoscope
}, {
  id: "5",
  name: "Dr. Harpreet Singh",
  hospital: "Nabha Cardiology Unit",
  qualifications: "MBBS, MD (Cardiology)",
  bio: "Heart & chronic conditions.",
  specialty: "Cardiology",
  availableSlots: ["Today 16:00", "Today 16:15", "Today 16:30", "Today 16:45", "Today 17:00", "Today 17:15", "Today 17:30", "Today 17:45", "Today 18:00"],
  icon: Heart
}, {
  id: "6",
  name: "Dr. Pooja Bedi",
  hospital: "Nabha ENT Clinic",
  qualifications: "MBBS, DLO",
  bio: "Ear, nose and throat.",
  specialty: "ENT",
  availableSlots: ["Tomorrow 13:00", "Tomorrow 13:15", "Tomorrow 13:30", "Tomorrow 13:45", "Tomorrow 14:00", "Tomorrow 14:15", "Tomorrow 14:30", "Tomorrow 14:45", "Tomorrow 15:00"],
  icon: Stethoscope
}];
interface Booking {
  id: string;
  doctor: Doctor;
  dateTime: string;
  reason: string;
}
export default function FindDoctor() {
  const {
    currentLanguage,
    changeLanguage
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot("");
    setReason("");
    setShowBookingModal(true);
    setShowConfirmation(false);
  };
  const handleCheckAvailability = (doctor: Doctor) => {
    // For now, just show the booking modal
    handleBookAppointment(doctor);
  };
  const confirmBooking = () => {
    if (selectedDoctor && selectedSlot) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        doctor: selectedDoctor,
        dateTime: selectedSlot,
        reason
      };
      setRecentBookings(prev => [newBooking, ...prev]);
      setShowConfirmation(true);
    }
  };
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setSelectedSlot("");
    setReason("");
    setShowConfirmation(false);
  };
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
  };
  const filteredDoctors = demoDoctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.qualifications.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "" || doctor.specialty.toLowerCase().includes(selectedDepartment.toLowerCase());
    return matchesSearch && matchesDepartment;
  });
  return <div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} showCenterLogo={true} />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* Page Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">Book Appointment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search or filter by department to find available specialists in your area.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="space-y-4">
              
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search by doctor name, hospital or specialty" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base" />
              </div>

              {/* Department Filter and Clear */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                
                {/* Department Filter */}
                <div className="relative">
                  <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="min-h-[48px] justify-start w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedDepartment || "Filter by Department"}
                  </Button>
                  
                  {isFilterOpen && <div className="absolute top-full left-0 mt-2 w-64 bg-popover border rounded-md shadow-lg z-20">
                      <div className="py-2">
                        <button onClick={() => {
                      setSelectedDepartment("");
                      setIsFilterOpen(false);
                    }} className="block w-full text-left px-4 py-3 text-sm hover:bg-accent transition-smooth">
                          All Departments
                        </button>
                        {departments.map(dept => <button key={dept} onClick={() => {
                      setSelectedDepartment(dept);
                      setIsFilterOpen(false);
                    }} className={`block w-full text-left px-4 py-3 text-sm hover:bg-accent transition-smooth ${selectedDepartment === dept ? 'bg-accent font-medium' : ''}`}>
                            {dept}
                          </button>)}
                      </div>
                    </div>}
                </div>

                {/* Clear Filters */}
                <Button variant="ghost" onClick={clearFilters} className="min-h-[48px] text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          {recentBookings.length > 0 && <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {recentBookings.map(booking => <Card key={booking.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <Check className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{booking.doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.dateTime} • {booking.doctor.hospital}</p>
                        {booking.reason && <p className="text-sm text-muted-foreground">Reason: {booking.reason}</p>}
                      </div>
                    </div>
                  </Card>)}
              </div>
            </div>}

          {/* Doctor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredDoctors.map(doctor => {
            const IconComponent = doctor.icon;
            return <Card key={doctor.id} className="p-6 hover:shadow-lg transition-smooth">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      
                      {/* Avatar with Icon */}
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        
                        {/* Doctor Name */}
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {doctor.name}
                        </h3>

                        {/* Hospital */}
                        <p className="text-muted-foreground mb-1 text-sm">
                          {doctor.hospital}
                        </p>

                        {/* Qualifications */}
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {doctor.qualifications}
                        </p>

                        {/* Bio */}
                        <p className="text-sm text-muted-foreground mb-4">
                          {doctor.bio}
                        </p>

                        {/* Availability */}
                        

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button onClick={() => handleBookAppointment(doctor)} className="min-h-[48px] flex-1 bg-primary hover:bg-primary/90">
                            Book Appointment
                          </Button>
                          
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* No Results Message */}
          {filteredDoctors.length === 0 && <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No doctors found matching your search criteria.
              </p>
              <Button variant="outline" onClick={clearFilters} className="min-h-[48px]">
                Clear Filters
              </Button>
            </div>}
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {showConfirmation ? "Booking Confirmed!" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>
          
          {showConfirmation ? <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-center text-foreground">
                Booking confirmed. You will receive SMS and on-screen details.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{selectedDoctor?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDoctor?.hospital}</p>
                <p className="text-sm text-muted-foreground">{selectedSlot}</p>
                {reason && <p className="text-sm text-muted-foreground">Reason: {reason}</p>}
              </div>
              <Button onClick={closeModal} className="w-full min-h-[48px]">
                Close
              </Button>
            </div> : selectedDoctor && <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedDoctor.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDoctor.hospital}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Choose a 15-minute slot:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDoctor.availableSlots.map(slot => <Button key={slot} variant={selectedSlot === slot ? "default" : "outline"} onClick={() => setSelectedSlot(slot)} className="text-sm min-h-[40px]">
                      {slot}
                    </Button>)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Reason for visit (optional):
                </label>
                <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Brief description of your concern..." className="min-h-[80px]" />
              </div>

              <div className="flex gap-2">
                <Button onClick={confirmBooking} disabled={!selectedSlot} className="flex-1 min-h-[48px]">
                  Confirm Booking
                </Button>
                <Button variant="outline" onClick={closeModal} className="flex-1 min-h-[48px]">
                  Cancel
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Filter Dropdown Overlay */}
      {isFilterOpen && <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} aria-hidden="true" />}
      
      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                <span style={{
                color: '#0B2A4A'
              }}>Nabha</span>
                <span style={{
                color: '#45A06B'
              }}>Sehat</span>
                <span style={{
                color: '#D04B42'
              }}>Mitr</span>
              </h3>
              <p className="text-sm text-black leading-relaxed">
                Your trusted healthcare companion providing comprehensive medical services in Nabha and Punjab.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Quick Links</h4>
              <div className="space-y-2">
                <a href="/contact" className="block text-sm text-black hover:text-healthcare-green transition-smooth">Contact Us</a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">Terms & Conditions</a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">Privacy Policy</a>
                <a href="#" className="block text-sm text-black hover:text-healthcare-green transition-smooth">Help & Support</a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" style={{
                  color: '#45A06B'
                }} />
                  <span className="text-sm text-black">+91 87977 60111, +91 95137 31600</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="h-4 w-4" style={{
                  color: '#45A06B'
                }}>@</span>
                  <span className="text-sm text-black">nabhasehatmitr@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" style={{
                  color: '#45A06B'
                }} />
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
    </div>;
}