import { useState } from "react";
import { Edit, Phone, Calendar, Clock, Video, AudioLines, X, Plus, Eye, Download, MapPin, Pill, FileText, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hasCallLink: boolean;
}
interface Medicine {
  id: string;
  name: string;
  slot: 'morning' | 'afternoon' | 'evening';
  daysLeft: number;
}
interface Report {
  id: string;
  title: string;
  date: string;
  viewLink: string;
  downloadLink: string;
}
export default function PatientDashboard() {
  const {
    currentLanguage,
    changeLanguage
  } = useLanguage();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Demo patient data
  const [patientData, setPatientData] = useState({
    name: "Rajesh Kumar",
    phone: "1234567890",
    dob: "1985-03-15",
    gender: "male",
    address: "123 Gandhi Road, Nabha, Punjab 147201",
    memberSince: "2023-01-15"
  });

  // Demo appointments
  const [appointments] = useState<Appointment[]>([{
    id: "1",
    doctorName: "Dr. Meera Sharma",
    hospital: "Nabha Civil Hospital",
    specialty: "General Medicine",
    date: "2025-01-15",
    time: "10:00 AM",
    status: "upcoming",
    hasCallLink: true
  }, {
    id: "2",
    doctorName: "Dr. Amanpreet Kaur",
    hospital: "District Hospital Nabha",
    specialty: "Pediatrics",
    date: "2025-01-18",
    time: "2:30 PM",
    status: "upcoming",
    hasCallLink: false
  }]);

  // Demo medicines
  const [medicines, setMedicines] = useState<Medicine[]>([{
    id: "1",
    name: "Metformin 500mg",
    slot: "morning",
    daysLeft: 15
  }, {
    id: "2",
    name: "Lisinopril 10mg",
    slot: "evening",
    daysLeft: 8
  }, {
    id: "3",
    name: "Vitamin D3",
    slot: "afternoon",
    daysLeft: 30
  }]);

  // Demo reports
  const reports: Report[] = [{
    id: "1",
    title: "Blood Test Report - Dec 2024",
    date: "2024-12-15",
    viewLink: "https://drive.google.com/file/d/demo1/view",
    downloadLink: "https://drive.google.com/file/d/demo1/export?format=pdf"
  }, {
    id: "2",
    title: "X-Ray Chest - Nov 2024",
    date: "2024-11-28",
    viewLink: "https://drive.google.com/file/d/demo2/view",
    downloadLink: "https://drive.google.com/file/d/demo2/export?format=pdf"
  }, {
    id: "3",
    title: "ECG Report - Nov 2024",
    date: "2024-11-20",
    viewLink: "https://drive.google.com/file/d/demo3/view",
    downloadLink: "https://drive.google.com/file/d/demo3/export?format=pdf"
  }, {
    id: "4",
    title: "Prescription - Oct 2024",
    date: "2024-10-30",
    viewLink: "https://drive.google.com/file/d/demo4/view",
    downloadLink: "https://drive.google.com/file/d/demo4/export?format=pdf"
  }];
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    slot: "morning",
    days: "30"
  });
  const handleProfileUpdate = (field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
    toast({
      title: "Profile Updated",
      description: "Changes saved successfully (demo)"
    });
  };
  const handleAddMedicine = () => {
    if (newMedicine.name.trim()) {
      const medicine: Medicine = {
        id: Date.now().toString(),
        name: newMedicine.name,
        slot: newMedicine.slot as 'morning' | 'afternoon' | 'evening',
        daysLeft: parseInt(newMedicine.days)
      };
      setMedicines(prev => [...prev, medicine]);
      setNewMedicine({
        name: "",
        slot: "morning",
        days: "30"
      });
      setIsAddMedicineOpen(false);
      toast({
        title: "Medicine Added",
        description: "Medicine added to your list (demo)"
      });
    }
  };
  const handleViewReport = (viewLink: string) => {
    window.open(viewLink, '_blank');
  };
  const handleDownloadReport = (downloadLink: string) => {
    window.open(downloadLink, '_blank');
  };
  const handleJoinCall = (appointmentId: string) => {
    toast({
      title: "Joining Call",
      description: "Connecting to video call (demo)"
    });
  };
  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled (demo)"
    });
  };
  return <div className="min-h-screen bg-background">
      <Header currentLanguage={currentLanguage} onLanguageChange={changeLanguage} showCenterLogo={true} />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{
            color: '#0B2A4A'
          }}>Patient Dashboard</h1>
            <p className="text-muted-foreground">Manage your health information and appointments</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile & Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name (editable)</label>
                        <div className="flex items-center gap-2">
                          <Input value={patientData.name} onChange={e => handleProfileUpdate('name', e.target.value)} className="mt-1" />
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone (fixed)</label>
                        <Input value={patientData.phone} disabled className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date of Birth (fixed)</label>
                        <Input value={patientData.dob} disabled className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Gender (editable)</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Select value={patientData.gender} onValueChange={value => handleProfileUpdate('gender', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Member since: {new Date(patientData.memberSince).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map(appointment => <Card key={appointment.id} className="border-l-4" style={{
                    borderLeftColor: '#45A06B'
                  }}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold">{appointment.doctorName}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.hospital}</p>
                              <p className="text-sm font-medium" style={{
                            color: '#45A06B'
                          }}>{appointment.specialty}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">{appointment.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">{appointment.time}</span>
                                </div>
                                <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {appointment.hasCallLink}
                              <Button variant="outline" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button className="h-16 flex flex-col gap-1" style={{
                    backgroundColor: '#45A06B'
                  }} onClick={() => navigate('/find-doctor')}>
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm">Book Appointment</span>
                    </Button>
                    
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Medicines, Reports, Reminders */}
            <div className="space-y-6">
              
              {/* Medications */}
              

              {/* Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reports.map(report => <Card key={report.id} className="border">
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm mb-1">{report.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{report.date}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleViewReport(report.viewLink)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleDownloadReport(report.downloadLink)}>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </CardContent>
              </Card>

              {/* Reminders */}
              <Card>
                
                
              </Card>

            </div>
          </div>
        </div>
      </main>

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