import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
interface AppointmentBookingProps {
  doctorName?: string;
  specialty?: string;
  onBookingComplete: (booking: BookingData) => void;
}
interface BookingData {
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  type: 'video' | 'in-person';
  patientName: string;
  phone: string;
  reason: string;
}

// Available time slots
const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'];
export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctorName = 'Dr. Available Physician',
  specialty = 'General Medicine',
  onBookingComplete
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState(1);
  const [bookedSlots] = useState<string[]>(['10:00 AM', '02:30 PM', '04:00 PM']); // Mock booked slots

  const isSlotAvailable = (time: string) => {
    return !bookedSlots.includes(time);
  };
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !patientName || !phone) return;
    const booking: BookingData = {
      doctorName,
      specialty,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      patientName,
      phone,
      reason
    };
    onBookingComplete(booking);
  };
  const canProceed = selectedDate && selectedTime && patientName && phone;
  if (step === 2) {
    return <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Appointment Booked!</CardTitle>
          <CardDescription>
            Your appointment has been successfully scheduled
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Doctor:</span>
              <span className="text-sm font-medium">{doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium">
                {selectedDate && format(selectedDate, 'PPP')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="text-sm font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Badge variant={appointmentType === 'video' ? 'default' : 'secondary'}>
                {appointmentType === 'video' ? 'Video Call' : 'In-Person'}
              </Badge>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation SMS shortly
            </p>
            <Button onClick={() => setStep(1)} variant="outline" className="w-full">
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Book Appointment
        </CardTitle>
        <CardDescription>
          Schedule a consultation with {doctorName} - {specialty}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Appointment Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Consultation Type</label>
          <div className="grid grid-cols-2 gap-4">
            
            
            <Card className={cn("cursor-pointer transition-all hover:shadow-md", appointmentType === 'in-person' ? 'ring-2 ring-primary' : '')} onClick={() => setAppointmentType('in-person')}>
              <CardContent className="flex items-center gap-3 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">In-Person</div>
                  <div className="text-sm text-muted-foreground">Clinic visit</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={date => date < new Date() || date < new Date("1900-01-01")} initialFocus className="pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        {selectedDate && <div className="space-y-3">
            <label className="text-sm font-medium">Available Time Slots</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map(time => {
            const available = isSlotAvailable(time);
            return <Button key={time} variant={selectedTime === time ? "default" : "outline"} size="sm" disabled={!available} onClick={() => setSelectedTime(time)} className={cn("text-xs", !available && "opacity-50 cursor-not-allowed")}>
                    <Clock className="w-3 h-3 mr-1" />
                    {time}
                  </Button>;
          })}
            </div>
          </div>}

        {/* Patient Information */}
        {selectedDate && selectedTime && <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Name</label>
                <Input placeholder="Enter patient name" value={patientName} onChange={e => setPatientName(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Visit (Optional)</label>
              <Textarea placeholder="Brief description of your concern..." value={reason} onChange={e => setReason(e.target.value)} rows={3} />
            </div>
          </div>}

        {/* Book Button */}
        {canProceed && <Button onClick={handleBooking} className="w-full">
            Confirm Appointment
          </Button>}
        
        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded-lg">
          <strong>Note:</strong> This is a demo booking system. 
          In a real application, this would integrate with actual doctor schedules and booking systems.
        </div>
      </CardContent>
    </Card>;
};