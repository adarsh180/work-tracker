'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Home, MapPin, Lightbulb, Star, BookOpen } from 'lucide-react';

interface MemoryPalace {
  id: string;
  name: string;
  subject: string;
  locations: MemoryLocation[];
  totalConcepts: number;
  masteredConcepts: number;
}

interface MemoryLocation {
  id: string;
  name: string;
  concept: string;
  visualCue: string;
  story: string;
  difficulty: number;
  lastReviewed: string;
  mastered: boolean;
}

export function MemoryPalaceSystem() {
  const [palaces, setPalaces] = useState<MemoryPalace[]>([
    {
      id: '1',
      name: 'Misti\'s Home Palace',
      subject: 'Biology',
      locations: [
        {
          id: '1',
          name: 'Kitchen',
          concept: 'Digestive System',
          visualCue: 'Food processing like stomach',
          story: 'Imagine food being processed in kitchen like stomach processes food',
          difficulty: 3,
          lastReviewed: '2024-01-15',
          mastered: true
        },
        {
          id: '2', 
          name: 'Living Room',
          concept: 'Circulatory System',
          visualCue: 'TV cables like blood vessels',
          story: 'TV cables spread throughout room like blood vessels in body',
          difficulty: 4,
          lastReviewed: '2024-01-14',
          mastered: false
        }
      ],
      totalConcepts: 15,
      masteredConcepts: 8
    }
  ]);

  const [selectedPalace, setSelectedPalace] = useState<MemoryPalace | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const neetMemoryTechniques = [
    {
      technique: "Acronym Palace",
      description: "Create memorable acronyms for complex lists",
      example: "RICE for injury treatment: Rest, Ice, Compression, Elevation",
      subjects: ["Biology", "Chemistry"]
    },
    {
      technique: "Story Chain",
      description: "Link concepts through vivid stories",
      example: "Photosynthesis story: Chlorophyll (green superhero) captures sunlight",
      subjects: ["Biology", "Chemistry", "Physics"]
    },
    {
      technique: "Visual Association",
      description: "Connect abstract concepts to familiar objects",
      example: "Mitochondria = Power plant of cell (like home generator)",
      subjects: ["Biology"]
    },
    {
      technique: "Rhyme & Rhythm",
      description: "Create catchy rhymes for formulas",
      example: "Ohm's law: V equals I times R, remember this and you'll go far!",
      subjects: ["Physics", "Chemistry"]
    }
  ];

  const createNewPalace = () => {
    const palaceIdeas = [
      { name: "School Campus Palace", subject: "Physics", description: "Use familiar school locations for physics concepts" },
      { name: "Market Street Palace", subject: "Chemistry", description: "Chemical reactions like market transactions" },
      { name: "Garden Palace", subject: "Biology", description: "Plant biology concepts in actual garden setting" }
    ];
    
    const randomIdea = palaceIdeas[Math.floor(Math.random() * palaceIdeas.length)];
    alert(`New Palace Idea: ${randomIdea.name}\n\n${randomIdea.description}\n\nSubject: ${randomIdea.subject}`);
  };

  const reviewConcept = (palaceId: string, locationId: string) => {
    setPalaces(prev => prev.map(palace => {
      if (palace.id === palaceId) {
        return {
          ...palace,
          locations: palace.locations.map(location => {
            if (location.id === locationId) {
              return {
                ...location,
                lastReviewed: new Date().toISOString().split('T')[0],
                mastered: Math.random() > 0.3 // 70% chance of mastering
              };
            }
            return location;
          })
        };
      }
      return palace;
    }));
  };

  const getPersonalizedTips = () => {
    return [
      "🏠 Use your actual home layout - you know it perfectly!",
      "👨‍👩‍👧‍👦 Include family members in your stories for emotional connection",
      "🎭 Make stories funny or dramatic - emotions enhance memory",
      "🔄 Review your palaces every 3 days for best retention",
      "📱 Take photos of real locations to strengthen visual memory"
    ];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Memory Palace System for NEET
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Palace Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            {palaces.map((palace) => (
              <div 
                key={palace.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => setSelectedPalace(palace)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-blue-400" />
                  <h3 className="text-white font-medium">{palace.name}</h3>
                </div>
                <Badge className="mb-2">{palace.subject}</Badge>
                <div className="text-sm text-gray-300">
                  <div>Concepts: {palace.masteredConcepts}/{palace.totalConcepts}</div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(palace.masteredConcepts / palace.totalConcepts) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            
            <div 
              className="p-4 bg-dashed border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-400 transition-colors flex items-center justify-center"
              onClick={createNewPalace}
            >
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-gray-400">Create New Palace</div>
              </div>
            </div>
          </div>

          {/* Selected Palace Details */}
          {selectedPalace && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-400" />
                  {selectedPalace.name} - {selectedPalace.subject}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPalace.locations.map((location) => (
                  <div key={location.id} className="p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        {location.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {location.mastered && <Badge className="bg-green-600">Mastered</Badge>}
                        <Button 
                          size="sm"
                          onClick={() => reviewConcept(selectedPalace.id, location.id)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-blue-400">Concept:</span> <span className="text-gray-300">{location.concept}</span></div>
                      <div><span className="text-green-400">Visual Cue:</span> <span className="text-gray-300">{location.visualCue}</span></div>
                      <div><span className="text-purple-400">Story:</span> <span className="text-gray-300">{location.story}</span></div>
                      <div><span className="text-yellow-400">Last Reviewed:</span> <span className="text-gray-300">{location.lastReviewed}</span></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Memory Techniques */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                NEET Memory Techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {neetMemoryTechniques.map((technique, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">{technique.technique}</h4>
                  <p className="text-gray-300 text-sm mb-2">{technique.description}</p>
                  <div className="text-green-400 text-sm mb-2">
                    <strong>Example:</strong> {technique.example}
                  </div>
                  <div className="flex gap-2">
                    {technique.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Personalized Tips */}
          <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-pink-400" />
                Personalized Tips for Misti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPersonalizedTips().map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-pink-400 mt-1">•</div>
                    <span className="text-gray-300 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}