import React, { useState, useEffect } from 'react';
import { Save, Shield, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MedicalHistory {
  personalInfo: {
    dateOfBirth: string;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  conditions: string[];
  allergies: string[];
  medications: string[];
  surgeries: string[];
  familyHistory: string[];
  lifestyle: {
    smoking: string;
    drinking: string;
    exercise: string;
    diet: string;
  };
  additionalNotes: string;
}

const commonConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
  'Depression', 'Anxiety', 'High Cholesterol', 'Thyroid Disorder',
  'Kidney Disease', 'Liver Disease', 'Cancer History'
];

const commonAllergies = [
  'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Shellfish', 'Nuts',
  'Dairy', 'Eggs', 'Latex', 'Pollen', 'Dust', 'Animal Dander'
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

interface MedicalHistoryFormProps {
  onSave: (history: MedicalHistory) => void;
  initialData?: Partial<MedicalHistory>;
}

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  onSave,
  initialData
}) => {
  const [history, setHistory] = useState<MedicalHistory>({
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      height: '',
      weight: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    conditions: [],
    allergies: [],
    medications: [],
    surgeries: [],
    familyHistory: [],
    lifestyle: {
      smoking: '',
      drinking: '',
      exercise: '',
      diet: ''
    },
    additionalNotes: ''
  });

  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('medicalHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading medical history:', error);
      }
    } else if (initialData) {
      setHistory({ ...history, ...initialData });
    }
  }, [initialData]);

  const updatePersonalInfo = (field: string, value: string) => {
    setHistory(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateLifestyle = (field: string, value: string) => {
    setHistory(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value
      }
    }));
  };

  const toggleCondition = (condition: string) => {
    setHistory(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setHistory(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setHistory(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setHistory(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }));
  };

  const addSurgery = () => {
    if (newSurgery.trim()) {
      setHistory(prev => ({
        ...prev,
        surgeries: [...prev.surgeries, newSurgery.trim()]
      }));
      setNewSurgery('');
    }
  };

  const removeSurgery = (surgery: string) => {
    setHistory(prev => ({
      ...prev,
      surgeries: prev.surgeries.filter(s => s !== surgery)
    }));
  };

  const handleSave = () => {
    if (!consentGiven) return;
    
    // Save to localStorage
    localStorage.setItem('medicalHistory', JSON.stringify(history));
    onSave(history);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Privacy Notice:</strong> This medical information is stored locally on your device only. 
          It is not transmitted to any servers. This is a demonstration of a medical history form.
        </AlertDescription>
      </Alert>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={history.personalInfo.dateOfBirth}
                onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select 
                value={history.personalInfo.gender} 
                onValueChange={(value) => updatePersonalInfo('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Type</label>
              <Select 
                value={history.personalInfo.bloodType} 
                onValueChange={(value) => updatePersonalInfo('bloodType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Height (cm)</label>
              <Input
                type="number"
                placeholder="170"
                value={history.personalInfo.height}
                onChange={(e) => updatePersonalInfo('height', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                placeholder="70"
                value={history.personalInfo.weight}
                onChange={(e) => updatePersonalInfo('weight', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Contact</label>
              <Input
                placeholder="Contact name"
                value={history.personalInfo.emergencyContact}
                onChange={(e) => updatePersonalInfo('emergencyContact', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Emergency Phone</label>
              <Input
                placeholder="Phone number"
                value={history.personalInfo.emergencyPhone}
                onChange={(e) => updatePersonalInfo('emergencyPhone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Conditions</CardTitle>
          <CardDescription>Select any conditions you currently have or have had</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonConditions.map(condition => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={history.conditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <label htmlFor={condition} className="text-sm">{condition}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Select any known allergies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {commonAllergies.map(allergy => (
              <div key={allergy} className="flex items-center space-x-2">
                <Checkbox
                  id={allergy}
                  checked={history.allergies.includes(allergy)}
                  onCheckedChange={() => toggleAllergy(allergy)}
                />
                <label htmlFor={allergy} className="text-sm">{allergy}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>List all medications you are currently taking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add medication (name, dosage, frequency)"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <Button onClick={addMedication} type="button">Add</Button>
          </div>
          
          {history.medications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {history.medications.map((medication, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeMedication(medication)}
                >
                  {medication} ×
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Surgery History */}
      <Card>
        <CardHeader>
          <CardTitle>Surgery History</CardTitle>
          <CardDescription>List any surgeries or procedures you've had</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add surgery/procedure with date"
              value={newSurgery}
              onChange={(e) => setNewSurgery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSurgery()}
            />
            <Button onClick={addSurgery} type="button">Add</Button>
          </div>
          
          {history.surgeries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {history.surgeries.map((surgery, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSurgery(surgery)}
                >
                  {surgery} ×
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Smoking Status</label>
              <Select 
                value={history.lifestyle.smoking} 
                onValueChange={(value) => updateLifestyle('smoking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never smoked</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="current">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Alcohol Consumption</label>
              <Select 
                value={history.lifestyle.drinking} 
                onValueChange={(value) => updateLifestyle('drinking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Exercise Frequency</label>
              <Select 
                value={history.lifestyle.exercise} 
                onValueChange={(value) => updateLifestyle('exercise', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="2-3-times">2-3 times per week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Diet Type</label>
              <Select 
                value={history.lifestyle.diet} 
                onValueChange={(value) => updateLifestyle('diet', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="restricted">Medically restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Any other important medical information</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any other important medical information..."
            value={history.additionalNotes}
            onChange={(e) => setHistory(prev => ({ ...prev, additionalNotes: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Consent and Save */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked === true)}
            />
            <label htmlFor="consent" className="text-sm">
              I consent to storing this medical information locally on my device. 
              I understand this is for demonstration purposes only and should not 
              replace actual medical records maintained by healthcare providers.
            </label>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={!consentGiven}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Medical History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};