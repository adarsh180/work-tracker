'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Gift, MessageCircle, Star } from 'lucide-react';

interface RelationshipData {
  supportMoments: number;
  encouragementGiven: number;
  dateNightsPlanned: number;
  loveMessagesReceived: number;
  lastAppreciation: string;
}

export function RelationshipCareSystem() {
  const [relationshipData, setRelationshipData] = useState<RelationshipData>({
    supportMoments: 0,
    encouragementGiven: 0,
    dateNightsPlanned: 0,
    loveMessagesReceived: 0,
    lastAppreciation: ''
  });

  // Load existing relationship data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('relationshipData');
    if (savedData) {
      setRelationshipData(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('relationshipData', JSON.stringify(relationshipData));
  }, [relationshipData]);

  const [showLoveMessage, setShowLoveMessage] = useState(false);

  const loveMessages = [
    "💕 You make every day brighter, my beautiful Misti! Your dedication inspires me!",
    "🌟 Watching you chase your dreams makes me fall in love with you all over again!",
    "👩⚕️ I can already see Dr. Misti saving lives and making the world better!",
    "💪 Your strength and determination amaze me every single day!",
    "✨ You're not just my wife, you're my hero and inspiration!"
  ];

  const appreciationActions = [
    { action: "Made her favorite tea during study break", points: 5 },
    { action: "Gave encouraging hug after tough test", points: 10 },
    { action: "Planned surprise date night", points: 15 },
    { action: "Listened to her study stress", points: 8 },
    { action: "Celebrated her small wins", points: 12 }
  ];

  const logSupportMoment = (action: string, points: number) => {
    setRelationshipData(prev => ({
      ...prev,
      supportMoments: prev.supportMoments + 1,
      encouragementGiven: prev.encouragementGiven + points,
      lastAppreciation: action
    }));
  };

  const sendLoveMessage = () => {
    const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    setShowLoveMessage(true);
    
    fetch('/api/whatsapp/love-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: randomMessage })
    });

    setTimeout(() => setShowLoveMessage(false), 3000);
  };

  const planDateNight = () => {
    const dateIdeas = [
      "🍕 Pizza night after her mock test",
      "🌙 Stargazing break from studies", 
      "🎬 Movie night with her favorite film",
      "🚶♀️ Evening walk and ice cream",
      "🏠 Cozy home dinner with candles"
    ];
    
    const randomDate = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    alert(`Date Night Planned: ${randomDate}`);
    
    setRelationshipData(prev => ({
      ...prev,
      dateNightsPlanned: prev.dateNightsPlanned + 1
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-400" />
            Relationship Care Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-pink-900/20 rounded-lg">
              <div className="text-2xl font-bold text-pink-400">{relationshipData.supportMoments}</div>
              <div className="text-sm text-gray-300">Support Moments</div>
            </div>
            <div className="text-center p-3 bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{relationshipData.encouragementGiven}</div>
              <div className="text-sm text-gray-300">Love Points</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{relationshipData.dateNightsPlanned}</div>
              <div className="text-sm text-gray-300">Date Nights</div>
            </div>
            <div className="text-center p-3 bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">💕</div>
              <div className="text-sm text-gray-300">Love Level</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Love Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={sendLoveMessage}
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={showLoveMessage}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {showLoveMessage ? 'Love Sent! 💕' : 'Send Love Message'}
              </Button>
              
              <Button 
                onClick={planDateNight}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Plan Date Night
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Log Support Given</h3>
            <div className="grid gap-2">
              {appreciationActions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-300">{item.action}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-600">+{item.points} pts</Badge>
                    <Button 
                      size="sm"
                      onClick={() => logSupportMoment(item.action, item.points)}
                    >
                      Log It
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relationshipData.lastAppreciation && (
            <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Latest Support Given:</h4>
              <p className="text-gray-300">{relationshipData.lastAppreciation}</p>
            </div>
          )}

          <div className="p-4 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/20 rounded-lg">
            <h4 className="text-pink-400 font-medium mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Our Journey Together
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🎯 Goal: Support Misti to become Dr. Misti</p>
              <p>💕 Mission: Build our future together</p>
              <p>🌟 Vision: Celebrate every milestone as a team</p>
              <p>💪 Promise: Never let her feel alone in this journey</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}