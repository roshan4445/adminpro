import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageSquare, X, Send, Mic, MicOff, Volume2, Languages, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface AIAssistantProps {
  role: 'state' | 'district' | 'mandal';
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

export function AIAssistant({ role }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();
  
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, role]);

  const getWelcomeMessage = () => {
    const roleMessages = {
      state: "Hello! I'm your State-level Civic Intelligence Assistant. I can help you with complaint analysis, scheme management, traffic coordination, and administrative tasks across all districts.",
      district: "Hello! I'm your District-level Civic Intelligence Assistant. I can help you manage complaints, coordinate with mandals, analyze traffic patterns, and oversee district schemes.",
      mandal: "Hello! I'm your Mandal-level Civic Intelligence Assistant. I can help you with local complaints, voice dictation, traffic issues, and daily reporting tasks."
    };
    return roleMessages[role];
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Smart filtering suggestions
    if (lowerMessage.includes('filter') || lowerMessage.includes('priority')) {
      return "I recommend filtering complaints by:\n\n🔥 **High Priority**: Water supply issues in dense areas\n📍 **Location**: Focus on complaints within 5km radius\n⏰ **Time**: Issues pending more than 3 days\n📊 **Category**: Sanitation (weight: 0.9) > Infrastructure (0.7) > Roads (0.5)\n\nWould you like me to apply these filters automatically?";
    }
    
    // Complaint summarization
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      return "📋 **Complaint Summary Generated**\n\n**English**: Water supply disruption affecting 50+ households in Sector 15 for 3 days.\n\n**हिंदी**: सेक्टर 15 में 50+ घरों में 3 दिनों से पानी की आपूर्ति बाधित।\n\n**తెలుగు**: సెక్టర్ 15లో 50+ ఇళ్లకు 3 రోజులుగా నీటి సరఫరా ఆటంకం.\n\n**اردو**: سیکٹر 15 میں 50+ گھروں میں 3 دنوں سے پانی کی فراہمی میں خلل۔";
    }
    
    // Scheme eligibility
    if (lowerMessage.includes('scheme') || lowerMessage.includes('eligibility')) {
      return "🎯 **Scheme Eligibility Analysis**\n\n✅ **PM Awas Yojana**: Income < ₹3L, Age 21-55\n✅ **Digital India**: Any age, Basic computer skills\n✅ **Skill Development**: Age 18-45, Unemployed\n\nFor detailed eligibility criteria, I can check specific applicant profiles. Would you like me to analyze any pending applications?";
    }
    
    // Traffic management
    if (lowerMessage.includes('traffic') || lowerMessage.includes('road')) {
      return "🚦 **Traffic Intelligence Report**\n\n📍 **Hotspots**: MG Road Junction (15 complaints)\n⚠️ **Critical**: NH-44 pothole causing accidents\n🔧 **Assignments**: 3 issues pending with Highway Dept\n\nRecommendation: Prioritize traffic light repair at MG Road - high congestion area affecting 10,000+ daily commuters.";
    }
    
    // Voice assistance for mandal
    if (role === 'mandal' && (lowerMessage.includes('voice') || lowerMessage.includes('dictate'))) {
      return "🎤 **Voice Assistant Ready**\n\nI can help you with:\n• Voice-to-text complaint recording\n• Multilingual dictation (Telugu, Hindi, English, Urdu)\n• Real-time translation\n• Audio complaint playback\n\nClick the microphone button to start voice dictation, or say 'Start recording complaint' to begin.";
    }
    
    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('guide')) {
      const roleHelp = {
        state: "🏛️ **State Admin Features**:\n• View all district complaints\n• Analyze state-wide trends\n• Manage inter-district schemes\n• Export comprehensive reports\n• Monitor scam alerts\n• Coordinate traffic management",
        district: "🏙️ **District Admin Features**:\n• Manage district complaints\n• Coordinate with mandals\n• Approve district schemes\n• Monitor traffic patterns\n• Handle scam verifications\n• Generate district reports",
        mandal: "🏘️ **Mandal Admin Features**:\n• Handle local complaints\n• Voice complaint recording\n• Quick traffic reporting\n• Daily activity logs\n• Local scheme applications\n• Community scam alerts"
      };
      return roleHelp[role];
    }
    
    // Default responses
    const responses = [
      "I understand you're asking about civic management. Could you be more specific about complaints, schemes, traffic issues, or administrative tasks?",
      "I'm here to help with your civic intelligence needs. Would you like assistance with filtering data, generating reports, or analyzing trends?",
      "As your AI assistant, I can help with complaint prioritization, scheme eligibility checks, traffic analysis, or administrative guidance. What would you like to focus on?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    resetTranscript();
    setIsTyping(true);
    
    try {
      const response = await getAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text);
    }
  };

  return (
    <>
      {/* Floating AI Button - Responsive */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </Button>
      </motion.div>

      {/* AI Assistant Panel - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-4 bottom-20 md:right-6 md:bottom-24 md:left-auto z-50 w-auto md:w-96 h-[70vh] md:h-[600px]"
          >
            <Card className="h-full shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 md:h-5 md:w-5" />
                    <CardTitle className="text-base md:text-lg">AI Assistant</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                      {role.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 h-6 w-6 md:h-8 md:w-8 p-0"
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 p-3 md:p-4">
                  <div className="space-y-3 md:space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-xs md:text-sm">
                            {message.content}
                          </div>
                          {message.type === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeak(message.content)}
                              className="mt-1 md:mt-2 h-5 md:h-6 px-1 md:px-2 text-xs opacity-70 hover:opacity-100"
                            >
                              <Volume2 className="h-2 w-2 md:h-3 md:w-3 mr-1" />
                              {isSpeaking ? 'Stop' : 'Speak'}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 md:p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input */}
                <div className="p-3 md:p-4 border-t">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('ai.inputPlaceholder')}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-8 md:pr-10 text-sm"
                      />
                      {isListening && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`${isListening ? 'bg-red-50 border-red-200' : ''} h-9 w-9 md:h-10 md:w-10 p-0`}
                    >
                      {isListening ? <MicOff className="h-3 w-3 md:h-4 md:w-4" /> : <Mic className="h-3 w-3 md:h-4 md:w-4" />}
                    </Button>
                    <Button 
                      onClick={handleSendMessage} 
                      size="sm"
                      disabled={isTyping}
                      className="h-9 w-9 md:h-10 md:w-10 p-0"
                    >
                      {isTyping ? (
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions - Responsive */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('Show high priority complaints')}
                      className="text-xs h-5 md:h-6 px-2"
                    >
                      🔥 Priority
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('Summarize recent complaints')}
                      className="text-xs h-5 md:h-6 px-2"
                    >
                      📋 Summary
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue('Help me with navigation')}
                      className="text-xs h-5 md:h-6 px-2"
                    >
                      ❓ Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}