import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: 'lab_test' | 'doctor_appointment' | 'review_appointment';
  linked_id: string | null;
}

interface LabTest {
  id: string;
  test_name: string;
  test_date: string;
  is_completed: boolean;
  report_url: string | null;
  notes: string | null;
}

const Calendar = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isLabTestDialogOpen, setIsLabTestDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingLabTest, setEditingLabTest] = useState<LabTest | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(true);

  const [eventForm, setEventForm] = useState<{
    title: string;
    description: string;
    event_date: string;
    event_type: 'lab_test' | 'doctor_appointment' | 'review_appointment';
  }>({
    title: '',
    description: '',
    event_date: '',
    event_type: 'doctor_appointment',
  });

  const [labTestForm, setLabTestForm] = useState({
    test_name: '',
    test_date: '',
    notes: '',
    report_url: '',
    is_completed: false,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await Promise.all([
          fetchUserRole(),
          fetchEvents(),
          fetchLabTests()
        ]);
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setUserRole(data.role);
      }
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true });
    
    if (error) {
      toast({ title: "Error fetching events", description: error.message, variant: "destructive" });
    } else {
      setEvents(data || []);
    }
  };

  const fetchLabTests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('lab_tests')
      .select('*')
      .eq('patient_id', user.id)
      .order('test_date', { ascending: true });
    
    if (error) {
      toast({ title: "Error fetching lab tests", description: error.message, variant: "destructive" });
    } else {
      setLabTests(data || []);
    }
  };

  const handleSaveEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingEvent) {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: eventForm.title,
          description: eventForm.description,
          event_date: eventForm.event_date,
          event_type: eventForm.event_type,
        })
        .eq('id', editingEvent.id);

      if (error) {
        toast({ title: "Error updating event", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Event updated successfully" });
        fetchEvents();
        closeEventDialog();
      }
    } else {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: eventForm.title,
          description: eventForm.description,
          event_date: eventForm.event_date,
          event_type: eventForm.event_type,
        });

      if (error) {
        toast({ title: "Error creating event", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Event created successfully" });
        fetchEvents();
        closeEventDialog();
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event deleted successfully" });
      fetchEvents();
    }
  };

  const handleSaveLabTest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingLabTest) {
      const { error } = await supabase
        .from('lab_tests')
        .update({
          test_name: labTestForm.test_name,
          test_date: labTestForm.test_date,
          notes: labTestForm.notes,
          report_url: labTestForm.report_url,
          is_completed: labTestForm.is_completed,
        })
        .eq('id', editingLabTest.id);

      if (error) {
        toast({ title: "Error updating lab test", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Lab test updated successfully" });
        fetchLabTests();
        closeLabTestDialog();
      }
    } else {
      const { error } = await supabase
        .from('lab_tests')
        .insert({
          patient_id: user.id,
          test_name: labTestForm.test_name,
          test_date: labTestForm.test_date,
          notes: labTestForm.notes,
          report_url: labTestForm.report_url,
          is_completed: labTestForm.is_completed,
        });

      if (error) {
        toast({ title: "Error creating lab test", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Lab test created successfully" });
        fetchLabTests();
        closeLabTestDialog();
      }
    }
  };

  const handleDeleteLabTest = async (id: string) => {
    const { error } = await supabase
      .from('lab_tests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error deleting lab test", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lab test deleted successfully" });
      fetchLabTests();
    }
  };

  const openEventDialog = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        description: event.description || '',
        event_date: format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm"),
        event_type: event.event_type,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        event_date: '',
        event_type: 'doctor_appointment',
      });
    }
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setIsEventDialogOpen(false);
    setEditingEvent(null);
  };

  const openLabTestDialog = (labTest?: LabTest) => {
    if (labTest) {
      setEditingLabTest(labTest);
      setLabTestForm({
        test_name: labTest.test_name,
        test_date: format(new Date(labTest.test_date), "yyyy-MM-dd'T'HH:mm"),
        notes: labTest.notes || '',
        report_url: labTest.report_url || '',
        is_completed: labTest.is_completed,
      });
    } else {
      setEditingLabTest(null);
      setLabTestForm({
        test_name: '',
        test_date: '',
        notes: '',
        report_url: '',
        is_completed: false,
      });
    }
    setIsLabTestDialogOpen(true);
  };

  const closeLabTestDialog = () => {
    setIsLabTestDialogOpen(false);
    setEditingLabTest(null);
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'lab_test': return 'Lab Test';
      case 'doctor_appointment': return 'Doctor Appointment';
      case 'review_appointment': return 'Review Appointment';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={changeLanguage}
          showCenterLogo
        />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
        showCenterLogo
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Calendar & Events</h1>
          </div>
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openEventDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event_date">Date & Time</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select value={eventForm.event_type} onValueChange={(value: any) => setEventForm({ ...eventForm, event_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab_test">Lab Test</SelectItem>
                      <SelectItem value="doctor_appointment">Doctor Appointment</SelectItem>
                      <SelectItem value="review_appointment">Review Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveEvent} className="w-full">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {userRole === 'patient' && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Lab Tests</CardTitle>
                <Dialog open={isLabTestDialogOpen} onOpenChange={setIsLabTestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => openLabTestDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lab Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingLabTest ? 'Edit Lab Test' : 'Add New Lab Test'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="test_name">Test Name</Label>
                        <Input
                          id="test_name"
                          value={labTestForm.test_name}
                          onChange={(e) => setLabTestForm({ ...labTestForm, test_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="test_date">Test Date</Label>
                        <Input
                          id="test_date"
                          type="datetime-local"
                          value={labTestForm.test_date}
                          onChange={(e) => setLabTestForm({ ...labTestForm, test_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={labTestForm.notes}
                          onChange={(e) => setLabTestForm({ ...labTestForm, notes: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="report_url">Report URL</Label>
                        <Input
                          id="report_url"
                          type="url"
                          value={labTestForm.report_url}
                          onChange={(e) => setLabTestForm({ ...labTestForm, report_url: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_completed"
                          checked={labTestForm.is_completed}
                          onChange={(e) => setLabTestForm({ ...labTestForm, is_completed: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_completed">Mark as Completed</Label>
                      </div>
                      <Button onClick={handleSaveLabTest} className="w-full">
                        {editingLabTest ? 'Update Lab Test' : 'Create Lab Test'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {labTests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No lab tests found</p>
              ) : (
                <div className="space-y-3">
                  {labTests.map((test) => (
                    <Card key={test.id} className={test.is_completed ? "bg-accent/50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{test.test_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(test.test_date), "PPP p")}
                            </p>
                            {test.notes && <p className="text-sm mt-2">{test.notes}</p>}
                            {test.report_url && (
                              <a href={test.report_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                View Report
                              </a>
                            )}
                            <p className="text-sm mt-1">
                              Status: {test.is_completed ? "✓ Completed" : "Pending"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openLabTestDialog(test)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteLabTest(test.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No events found</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.event_date), "PPP p")}
                          </p>
                          <p className="text-sm text-primary mt-1">
                            {getEventTypeLabel(event.event_type)}
                          </p>
                          {event.description && <p className="text-sm mt-2">{event.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEventDialog(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Calendar;