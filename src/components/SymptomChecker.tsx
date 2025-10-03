import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Common symptoms database with autocomplete
const commonSymptoms = [
  'headache', 'fever', 'cough', 'sore throat', 'runny nose', 'fatigue', 
  'nausea', 'vomiting', 'diarrhea', 'stomach pain', 'chest pain', 
  'difficulty breathing', 'dizziness', 'back pain', 'muscle aches',
  'rash', 'itching', 'swelling', 'joint pain', 'loss of appetite',
  'insomnia', 'anxiety', 'depression', 'confusion', 'memory loss'
];

interface SymptomData {
  selectedSymptoms: string[];
  duration: string;
  intensity: number;
  customSymptom: string;
  additionalInfo: string;
}

interface SymptomCheckerProps {
  onSymptomSubmit: (data: SymptomData) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onSymptomSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState([5]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  );

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSearchTerm('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      addSymptom(customSymptom.trim());
      setCustomSymptom('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    const data: SymptomData = {
      selectedSymptoms,
      duration,
      intensity: intensity[0],
      customSymptom,
      additionalInfo
    };

    onSymptomSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Symptom Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symptom Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What symptoms are you experiencing?</label>
            
            {/* Search and autocomplete */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              
              {/* Autocomplete dropdown */}
              {searchTerm && filteredSymptoms.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredSymptoms.slice(0, 8).map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom symptom input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Or type a custom symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
              />
              <Button type="button" onClick={addCustomSymptom} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(symptom => (
                  <Badge key={symptom} variant="secondary" className="flex items-center gap-1">
                    {symptom}
                    <button
                      type="button"
                      onClick={() => removeSymptom(symptom)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">How long have you had these symptoms?</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less-than-1-hour">Less than 1 hour</SelectItem>
                <SelectItem value="1-6-hours">1-6 hours</SelectItem>
                <SelectItem value="6-24-hours">6-24 hours</SelectItem>
                <SelectItem value="1-3-days">1-3 days</SelectItem>
                <SelectItem value="3-7-days">3-7 days</SelectItem>
                <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Intensity */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Rate your symptom intensity (1 = mild, 10 = severe): {intensity[0]}
            </label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Mild</span>
              <span>5 - Moderate</span>
              <span>10 - Severe</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional information (optional)</label>
            <textarea
              className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Any additional details about your symptoms..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={selectedSymptoms.length === 0 || !duration}
          >
            Assess My Symptoms
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};