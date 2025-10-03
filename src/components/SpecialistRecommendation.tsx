import React from 'react';
import { User, MapPin, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Specialist {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  location: string;
  availability: string;
  description: string;
}

// Specialist mapping based on symptoms
const specialistMapping: Record<string, { specialty: string; specialists: Specialist[] }> = {
  'headache,migraine,head pain': {
    specialty: 'Neurology',
    specialists: [
      {
        name: 'Dr. Rajesh Kumar',
        specialty: 'Neurologist',
        experience: '15 years',
        rating: 4.8,
        location: 'City Hospital, Sector 14',
        availability: 'Available today',
        description: 'Specializes in headaches, migraines, and neurological disorders'
      },
      {
        name: 'Dr. Priya Sharma',
        specialty: 'Neurologist',
        experience: '12 years',
        rating: 4.7,
        location: 'Medical Center, Sector 22',
        availability: 'Available tomorrow',
        description: 'Expert in chronic headaches and pain management'
      }
    ]
  },
  'stomach pain,nausea,vomiting,diarrhea': {
    specialty: 'Gastroenterology',
    specialists: [
      {
        name: 'Dr. Amit Singh',
        specialty: 'Gastroenterologist',
        experience: '18 years',
        rating: 4.9,
        location: 'Digestive Care Clinic, Sector 8',
        availability: 'Available today',
        description: 'Specializes in digestive disorders and stomach problems'
      }
    ]
  },
  'chest pain,heart,breathing': {
    specialty: 'Cardiology',
    specialists: [
      {
        name: 'Dr. Sunita Gupta',
        specialty: 'Cardiologist',
        experience: '20 years',
        rating: 4.9,
        location: 'Heart Care Hospital, Sector 5',
        availability: 'Emergency available',
        description: 'Expert in heart conditions and chest pain evaluation'
      }
    ]
  },
  'rash,skin,itching,allergy': {
    specialty: 'Dermatology',
    specialists: [
      {
        name: 'Dr. Meena Patel',
        specialty: 'Dermatologist',
        experience: '10 years',
        rating: 4.6,
        location: 'Skin Care Clinic, Sector 18',
        availability: 'Available today',
        description: 'Specializes in skin conditions, allergies, and rashes'
      }
    ]
  },
  'joint pain,back pain,muscle': {
    specialty: 'Orthopedics',
    specialists: [
      {
        name: 'Dr. Vikram Mehta',
        specialty: 'Orthopedic Surgeon',
        experience: '16 years',
        rating: 4.8,
        location: 'Bone & Joint Center, Sector 12',
        availability: 'Available tomorrow',
        description: 'Expert in joint disorders and musculoskeletal problems'
      }
    ]
  },
  'default': {
    specialty: 'General Medicine',
    specialists: [
      {
        name: 'Dr. Rohit Agarwal',
        specialty: 'General Physician',
        experience: '14 years',
        rating: 4.7,
        location: 'Primary Care Center, Sector 16',
        availability: 'Available today',
        description: 'Experienced in general health issues and primary care'
      },
      {
        name: 'Dr. Kavita Joshi',
        specialty: 'Family Medicine',
        experience: '11 years',
        rating: 4.6,
        location: 'Family Health Clinic, Sector 9',
        availability: 'Available today',
        description: 'Comprehensive family healthcare and preventive medicine'
      }
    ]
  }
};

interface SpecialistRecommendationProps {
  symptoms: string[];
  onBookAppointment: (specialist: Specialist) => void;
}

export const SpecialistRecommendation: React.FC<SpecialistRecommendationProps> = ({
  symptoms,
  onBookAppointment
}) => {
  const getRecommendedSpecialists = (symptoms: string[]): { specialty: string; specialists: Specialist[] } => {
    const symptomsText = symptoms.join(',').toLowerCase();
    
    // Find matching specialty based on symptoms
    for (const [keywords, specialtyData] of Object.entries(specialistMapping)) {
      if (keywords === 'default') continue;
      
      const keywordList = keywords.split(',');
      const hasMatch = keywordList.some(keyword => 
        symptomsText.includes(keyword.trim())
      );
      
      if (hasMatch) {
        return specialtyData;
      }
    }
    
    // Return default if no match found
    return specialistMapping.default;
  };

  const recommendation = getRecommendedSpecialists(symptoms);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Recommended Specialists</h3>
        <Badge variant="outline" className="mb-4">
          {recommendation.specialty}
        </Badge>
      </div>

      <div className="grid gap-4">
        {recommendation.specialists.map((specialist, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{specialist.name}</CardTitle>
                    <CardDescription className="font-medium">
                      {specialist.specialty}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{specialist.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {specialist.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{specialist.experience} experience</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{specialist.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={specialist.availability.includes('today') ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {specialist.availability}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onBookAppointment(specialist)}
                  className="flex-1"
                >
                  Book Appointment
                </Button>
                <Button variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Can't find the right specialist?
        </p>
        <Button variant="link" className="text-primary">
          Browse All Specialists
        </Button>
      </div>
    </div>
  );
};