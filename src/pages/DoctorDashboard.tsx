import { useState } from "react";
import { Edit, Phone, Calendar, Clock, Video, AudioLines, X, Plus, Users, Award, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

interface DoctorProfile {
  name: string;
  phone: string;
  hospital: string;
  specialization: string;
  verified: boolean;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
}

interface Appointment {
  id: string;
  patientName: string;
  reason: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  callType?: 'audio' | 'video';
}

export default function DoctorDashboard() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { toast } = useToast();
  
  // Demo doctor data
  const [doctorData, setDoctorData] = useState<DoctorProfile>({
    name: "Dr. Amanpreet Singh",
    phone: "0000000000",
    hospital: "Nabha Civil Hospital",
    specialization: "General Medicine",
    verified: true
  });

  // Demo time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "09:00",
      endTime: "11:00",
      date: "2025-01-15"
    },
    {
      id: "2", 
      startTime: "14:00",
      endTime: "16:00",
      date: "2025-01-15"
    }
  ]);

  // Demo appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Rajesh Kumar",
      reason: "General checkup and blood pressure monitoring",
      time: "09:15",
      status: "scheduled"
    },
    {
      id: "2",
      patientName: "Priya Sharma", 
      reason: "Follow-up consultation for diabetes",
      time: "09:45",
      status: "scheduled"
    },
    {
      id: "3",
      patientName: "Hardeep Singh",
      reason: "Chest pain and breathing issues",
      time: "14:30",
      status: "completed"
    }
  ]);

  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: "09:00", endTime: "10:00", date: "2025-01-15" });
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');

  const handleProfileUpdate = (field: string, value: string) => {
    setDoctorData(prev => ({ ...prev, [field]: value }));
    toast({
      title: "Profile Updated",
      description: "Changes saved successfully (demo)",
    });
  };

  const handleAddTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime && newSlot.date) {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        date: newSlot.date
      };
      setTimeSlots(prev => [...prev, slot]);
      setNewSlot({ startTime: "09:00", endTime: "10:00", date: "2025-01-15" });
      setIsAddSlotOpen(false);
      toast({
        title: "Time Slot Added",
        description: "New availability slot added (demo)",
      });
    }
  };

  const handleRemoveSlot = (slotId: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Time Slot Removed",
      description: "Availability slot removed (demo)",
    });
  };

  const handleStartCall = (appointment: Appointment, type: 'audio' | 'video') => {
    setSelectedAppointment(appointment);
    setCallType(type);
    setIsCallModalOpen(true);
  };

  const handleConfirmCall = () => {
    toast({
      title: `Starting ${callType} call`,
      description: `Connecting to ${selectedAppointment?.patientName} (demo)`,
    });
    setIsCallModalOpen(false);
    // Simulate call start
    setTimeout(() => {
      toast({
        title: "Call Started",
        description: "Connected successfully (demo)",
      });
    }, 2000);
  };

  const handleMarkComplete = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed' as const }
          : apt
      )
    );
    toast({
      title: "Appointment Completed",
      description: "Appointment marked as completed (demo)",
    });
  };

  const handleReschedule = (appointmentId: string) => {
    toast({
      title: "Reschedule Request",
      description: "Rescheduling functionality (demo)",
    });
  };

  const getTotalSlotsToday = () => {
    const today = "2025-01-15"; // Demo date
    const todaySlots = timeSlots.filter(slot => slot.date === today);
    return todaySlots.reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.startTime}`);
      const end = new Date(`2000-01-01T${slot.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      return total + Math.floor(diffMinutes / 15); // 15-minute slots
    }, 0);
  };

  const todaysAppointments = appointments.filter(apt => apt.time >= "00:00");

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo={true}
      />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#0B2A4A' }}>Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your practice and patient appointments</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile & Schedule */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Doctor Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Doctor Profile
                    {doctorData.verified && (
                      <Badge className="ml-2" style={{ backgroundColor: '#45A06B' }}>
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Name (editable)</label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={doctorData.name}
                          onChange={(e) => handleProfileUpdate('name', e.target.value)}
                          className="mt-1"
                        />
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone (fixed)</label>
                      <Input value={doctorData.phone} disabled className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hospital (editable)</label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={doctorData.hospital}
                          onChange={(e) => handleProfileUpdate('hospital', e.target.value)}
                          className="mt-1"
                        />
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Specialization (editable)</label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={doctorData.specialization}
                          onChange={(e) => handleProfileUpdate('specialization', e.target.value)}
                          className="mt-1"
                        />
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Manage Time Slots
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setIsAddSlotOpen(true)}
                      style={{ backgroundColor: '#45A06B' }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Total slots available today: {getTotalSlotsToday()}</p>
                    <p className="text-xs text-blue-600">Each slot is 15 minutes</p>
                  </div>
                  
                  <div className="space-y-3">
                    {timeSlots.map((slot) => (
                      <Card key={slot.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                              <p className="text-sm text-muted-foreground">{slot.date}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRemoveSlot(slot.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Appointments ({todaysAppointments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaysAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-l-4" style={{ 
                        borderLeftColor: appointment.status === 'completed' ? '#45A06B' : 
                                       appointment.status === 'in-progress' ? '#F59E0B' : '#0B2A4A'
                      }}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{appointment.patientName}</h4>
                                <Badge variant={
                                  appointment.status === 'completed' ? 'default' : 
                                  appointment.status === 'in-progress' ? 'secondary' : 
                                  'outline'
                                }>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{appointment.reason}</p>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">{appointment.time}</span>
                              </div>
                            </div>
                            
                            {appointment.status === 'scheduled' && (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleStartCall(appointment, 'audio')}
                                    style={{ backgroundColor: '#45A06B' }}
                                    className="text-white hover:opacity-90"
                                  >
                                    <AudioLines className="h-4 w-4 mr-1" />
                                    Audio
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleStartCall(appointment, 'video')}
                                    style={{ backgroundColor: '#0B2A4A' }}
                                    className="text-white hover:opacity-90"
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Video
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleMarkComplete(appointment.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReschedule(appointment.id)}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Stats & Patient Management */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Today's Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Appointments</span>
                      <span className="font-semibold text-lg">{todaysAppointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-semibold text-lg" style={{ color: '#45A06B' }}>
                        {todaysAppointments.filter(apt => apt.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-semibold text-lg" style={{ color: '#0B2A4A' }}>
                        {todaysAppointments.filter(apt => apt.status === 'scheduled').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Available Slots</span>
                      <span className="font-semibold text-lg">{getTotalSlotsToday()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patient Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaysAppointments.slice(0, 3).map((appointment) => (
                      <Card key={appointment.id} className="border">
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm mb-1">{appointment.patientName}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{appointment.time}</p>
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            View Reports
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">New Appointment</p>
                      <p className="text-xs text-blue-600">Rajesh Kumar booked for tomorrow 10:00 AM</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm font-medium text-orange-800">Schedule Update</p>
                      <p className="text-xs text-orange-600">Next appointment in 15 minutes</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">System Alert</p>
                      <p className="text-xs text-green-600">All systems operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      {/* Add Time Slot Modal */}
      <Dialog open={isAddSlotOpen} onOpenChange={setIsAddSlotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTimeSlot} className="flex-1">Add Slot</Button>
              <Button variant="outline" onClick={() => setIsAddSlotOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Confirmation Modal */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start {callType === 'audio' ? 'Audio' : 'Video'} Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Start {callType} call with {selectedAppointment?.patientName}?</p>
            <p className="text-sm text-muted-foreground">
              Appointment: {selectedAppointment?.reason}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleConfirmCall} className="flex-1">
                {callType === 'audio' ? <AudioLines className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                Start Call
              </Button>
              <Button variant="outline" onClick={() => setIsCallModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-muted-foreground/20 text-muted-foreground py-16 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">
                <span style={{ color: '#0B2A4A' }}>Nabha</span>
                <span style={{ color: '#45A06B' }}>Sehat</span>
                <span style={{ color: '#D04B42' }}>Mitr</span>
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
                  <Phone className="h-4 w-4" style={{ color: '#45A06B' }} />
                  <span className="text-sm text-black">+91 87977 60111, +91 95137 31600</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="h-4 w-4" style={{ color: '#45A06B' }}>@</span>
                  <span className="text-sm text-black">nabhasehatmitr@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" style={{ color: '#45A06B' }} />
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