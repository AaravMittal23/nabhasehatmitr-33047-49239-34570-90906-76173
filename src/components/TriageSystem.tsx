import React from 'react';
import { AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface TriageResult {
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: string;
  color: string;
  icon: React.ReactNode;
}

export interface SymptomInput {
  symptoms: string[];
  duration: string;
  intensity: number; // 1-10 scale
  additionalSymptoms: string[];
}

// Triage rules database
const triageRules = {
  severe: [
    {
      symptoms: ['chest pain', 'difficulty breathing'],
      keywords: ['chest pain', 'shortness of breath', 'chest tightness', 'breathing trouble'],
      recommendation: 'Seek immediate emergency care. Call emergency services now.'
    },
    {
      symptoms: ['severe bleeding', 'heavy bleeding'],
      keywords: ['heavy bleeding', 'severe bleeding', 'blood loss', 'uncontrolled bleeding'],
      recommendation: 'Apply pressure to wound and seek immediate emergency care.'
    },
    {
      symptoms: ['unconscious', 'loss of consciousness'],
      keywords: ['unconscious', 'passed out', 'loss of consciousness', 'fainted'],
      recommendation: 'Call emergency services immediately. Do not leave person alone.'
    },
    {
      symptoms: ['severe abdominal pain', 'intense pain'],
      keywords: ['severe stomach pain', 'intense abdominal pain', 'sharp stomach pain'],
      recommendation: 'Seek immediate medical attention at emergency department.'
    }
  ],
  moderate: [
    {
      symptoms: ['persistent fever', 'high fever'],
      keywords: ['fever', 'high temperature', 'burning up'],
      condition: (input: SymptomInput) => input.intensity >= 7 || input.duration.includes('days'),
      recommendation: 'Schedule appointment with doctor within 24-48 hours.'
    },
    {
      symptoms: ['persistent headache', 'severe headache'],
      keywords: ['headache', 'migraine', 'head pain'],
      condition: (input: SymptomInput) => input.intensity >= 6,
      recommendation: 'Consider seeing doctor if headache persists or worsens.'
    },
    {
      symptoms: ['persistent vomiting', 'dehydration'],
      keywords: ['vomiting', 'throwing up', 'nausea', 'dehydrated'],
      recommendation: 'Monitor hydration. See doctor if symptoms persist beyond 24 hours.'
    }
  ],
  mild: [
    {
      symptoms: ['mild fever', 'common cold'],
      keywords: ['runny nose', 'sneezing', 'mild fever', 'cough', 'sore throat'],
      recommendation: 'Rest, stay hydrated, monitor symptoms. Seek care if worsening.'
    },
    {
      symptoms: ['minor cuts', 'bruises'],
      keywords: ['cut', 'scratch', 'bruise', 'minor injury'],
      recommendation: 'Clean wound, apply bandage. Monitor for signs of infection.'
    },
    {
      symptoms: ['mild headache', 'fatigue'],
      keywords: ['tired', 'fatigue', 'mild headache', 'stressed'],
      recommendation: 'Rest, hydration, stress management. Monitor symptoms.'
    }
  ]
};

export const assessSymptoms = (input: SymptomInput): TriageResult => {
  const userText = input.symptoms.join(' ').toLowerCase();
  
  // Check severe conditions first
  for (const rule of triageRules.severe) {
    const hasKeywords = rule.keywords.some(keyword => 
      userText.includes(keyword.toLowerCase())
    );
    if (hasKeywords) {
      return {
        severity: 'severe',
        recommendation: rule.recommendation,
        color: 'bg-red-50 border-red-200 text-red-800',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      };
    }
  }
  
  // Check moderate conditions
  for (const rule of triageRules.moderate) {
    const hasKeywords = rule.keywords.some(keyword => 
      userText.includes(keyword.toLowerCase())
    );
    const meetsCondition = rule.condition ? rule.condition(input) : true;
    
    if (hasKeywords && meetsCondition) {
      return {
        severity: 'moderate',
        recommendation: rule.recommendation,
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: <Activity className="h-5 w-5 text-yellow-500" />
      };
    }
  }
  
  // Check mild conditions
  for (const rule of triageRules.mild) {
    const hasKeywords = rule.keywords.some(keyword => 
      userText.includes(keyword.toLowerCase())
    );
    if (hasKeywords) {
      return {
        severity: 'mild',
        recommendation: rule.recommendation,
        color: 'bg-green-50 border-green-200 text-green-800',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      };
    }
  }
  
  // Default to moderate for unknown symptoms
  return {
    severity: 'moderate',
    recommendation: 'Unable to assess severity. Please consult with a healthcare professional for proper evaluation.',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Activity className="h-5 w-5 text-blue-500" />
  };
};

interface TriageDisplayProps {
  result: TriageResult;
}

export const TriageDisplay: React.FC<TriageDisplayProps> = ({ result }) => {
  return (
    <Alert className={`${result.color} my-4`}>
      <div className="flex items-start gap-3">
        {result.icon}
        <div>
          <div className="font-semibold capitalize mb-1">
            {result.severity} Priority
          </div>
          <AlertDescription>
            {result.recommendation}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};