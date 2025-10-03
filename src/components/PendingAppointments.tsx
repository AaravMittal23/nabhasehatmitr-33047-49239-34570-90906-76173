import { Calendar, Clock, Video, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  type: 'video' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed';
}

// Mock pending appointments - in a real app, this would come from backend
const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    date: new Date(2025, 9, 15),
    time: '10:00 AM',
    type: 'video',
    status: 'pending'
  },
  {
    id: '2',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    date: new Date(2025, 9, 18),
    time: '02:30 PM',
    type: 'in-person',
    status: 'pending'
  }
];

export const PendingAppointments = () => {
  const navigate = useNavigate();
  const pendingAppointments = mockAppointments.filter(apt => apt.status === 'pending');

  if (pendingAppointments.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            No Pending Appointments
          </CardTitle>
          <CardDescription>
            You don't have any pending appointments at the moment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button onClick={() => navigate('/find-doctor')} size="lg" className="gap-2">
            Book New Appointment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">Pending Appointments</h3>
        <p className="text-sm text-muted-foreground">Your upcoming appointments waiting for confirmation</p>
      </div>
      
      {pendingAppointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{appointment.doctorName}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(appointment.date, 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {appointment.type === 'video' ? (
                      <>
                        <Video className="h-4 w-4 text-primary" />
                        <span>Video Consultation</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>In-Person Visit</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => navigate('/patient-dashboard')}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-center pt-4">
        <Button variant="ghost" onClick={() => navigate('/find-doctor')} className="gap-2">
          Book Another Appointment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
