import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MicOff, Volume2, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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
      state: "🏛️ Hello! I'm your State-level Civic Intelligence Assistant powered by Gemini AI. I can help you with:\n\n• Complaint analysis & prioritization\n• Scheme management across districts\n• Traffic coordination\n• Administrative insights\n• Multi-language support\n\nHow can I assist you today?",
      district: "🏙️ Hello! I'm your District-level Civic Intelligence Assistant powered by Gemini AI. I can help you with:\n\n• District complaint management\n• Mandal coordination\n• Traffic pattern analysis\n• Scheme oversight\n• Administrative guidance\n\nWhat would you like to know?",
      mandal: "🏘️ Hello! I'm your Mandal-level Civic Intelligence Assistant powered by Gemini AI. I can help you with:\n\n• Local complaint handling\n• Voice complaint processing\n• Traffic issue reporting\n• Daily activity logs\n• Community assistance\n\nHow can I help you today?"
    };
    return roleMessages[role];
  };

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyArEUNEuoe_eGJ2WqW_No-UJB2VJN7oIO4";
    
    const currentLanguage = i18n.language === 'en' ? 'English' : 
                           i18n.language === 'hi' ? 'Hindi' : 
                           i18n.language === 'te' ? 'Telugu' : 
                           i18n.language === 'ur' ? 'Urdu' : 'English';

    const prompt = `
You are an AI assistant for a Smart Civic Intelligence System serving ${role.toUpperCase()} level administration.

🎯 CONTEXT:
- User Role: ${role.toUpperCase()} Admin
- Current Language: ${currentLanguage}
- System: Smart Civic Intelligence Platform
- Platform Features: Complaint Management, Scheme Administration, Traffic Monitoring, Elderly Skills Program, Scam Alert System

🎯 YOUR CAPABILITIES:
1. **Complaint Analysis**: Help prioritize, categorize, and suggest actions for citizen complaints
2. **Scheme Management**: Assist with eligibility verification, application processing, and scheme recommendations
3. **Traffic Intelligence**: Analyze traffic patterns, suggest infrastructure improvements, coordinate with departments
4. **Administrative Guidance**: Provide insights on civic management, policy implementation, and resource allocation
5. **Data Insights**: Generate summaries, identify trends, and provide actionable recommendations
6. **Multilingual Support**: Communicate in English, Hindi, Telugu, and Urdu

🎯 RESPONSE GUIDELINES:
- Respond in ${currentLanguage} language
- Be professional, helpful, and civic-focused
- Provide actionable insights and specific recommendations
- Use relevant emojis to enhance readability
- Keep responses concise but comprehensive
- If asked about specific data, provide realistic examples
- Suggest practical next steps when appropriate

📩 USER MESSAGE: "${userMessage}"

📤 RESPONSE:
Provide a helpful, professional response as a civic intelligence AI assistant. Focus on practical solutions and actionable advice for ${role} level administration.`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Provide intelligent fallback responses based on user input
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('complaint') || lowerMessage.includes('issue')) {
        return `🔍 **Complaint Management Assistance**\n\nI'm currently experiencing connectivity issues, but I can still help you with complaint management:\n\n• **High Priority**: Water supply, safety hazards, traffic emergencies\n• **Medium Priority**: Infrastructure issues, sanitation problems\n• **Low Priority**: Aesthetic concerns, minor inconveniences\n\n**Quick Actions:**\n✅ Filter complaints by severity\n✅ Assign to appropriate departments\n✅ Set up automated responses\n\nPlease try your question again, and I'll provide more detailed assistance.`;
      }
      
      if (lowerMessage.includes('scheme') || lowerMessage.includes('eligibility')) {
        return `📋 **Scheme Management Support**\n\nConnection issue detected, but here's immediate guidance:\n\n**Common Eligibility Criteria:**\n• Income limits (usually ₹3L-8L annually)\n• Age requirements (varies by scheme)\n• Documentation (Aadhar, income certificate)\n• Residency proof\n\n**Quick Verification Steps:**\n✅ Check income against scheme limits\n✅ Verify age criteria\n✅ Confirm document completeness\n\nPlease retry your query for more specific assistance.`;
      }
      
      return `⚠️ **Temporary Connectivity Issue**\n\nI'm experiencing technical difficulties connecting to my AI services, but I'm still here to help!\n\n**Available Assistance:**\n🔍 Complaint filtering and prioritization\n📊 Scheme eligibility guidance\n🚦 Traffic management suggestions\n📈 Administrative best practices\n\n**Quick Tips for ${role.toUpperCase()} Admin:**\n• Review pending high-priority complaints\n• Check scheme application deadlines\n• Monitor traffic incident reports\n• Update administrative logs\n\nPlease try your question again - my connection should restore shortly!`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    resetTranscript();
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      const response = await callGeminiAPI(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "🔧 I apologize for the technical issue. My AI services are temporarily unavailable, but I'm still here to provide basic civic administration guidance. Please try your question again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Service Issue",
        description: "Temporary connectivity problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
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

  const quickActions = [
    { text: 'Show high priority complaints', emoji: '🔥', key: 'priority' },
    { text: 'Summarize recent complaints', emoji: '📋', key: 'summary' },
    { text: 'Help me with navigation', emoji: '❓', key: 'help' },
    { text: 'Analyze traffic patterns', emoji: '🚦', key: 'traffic' },
  ];

  return (
    <>
      {/* Floating AI Button - Enhanced with proper icon */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 1,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          size="lg"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          
          {/* AI Icon with animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Bot className="h-6 w-6 md:h-7 md:w-7 text-white relative z-10" />
          </motion.div>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
        </Button>
      </motion.div>

      {/* AI Assistant Panel - Enhanced with proper close button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3
            }}
            className="fixed inset-x-4 bottom-20 md:right-6 md:bottom-24 md:left-auto z-50 w-auto md:w-96 h-[70vh] md:h-[600px]"
          >
            <Card className="h-full shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="h-5 w-5" />
                    </motion.div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      AI Assistant
                      <Sparkles className="h-4 w-4" />
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                      {role.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <X className="h-4 w-4" />
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
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-gray-500">Gemini AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Section - Fixed alignment and improved layout */}
                <div className="p-3 md:p-4 border-t bg-white dark:bg-gray-900 space-y-3">
                  {/* Main input row */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('ai.inputPlaceholder')}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        className="pr-10 text-sm h-10"
                        disabled={isLoading}
                      />
                      {isListening && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`${isListening ? 'bg-red-50 border-red-200 text-red-600' : ''} h-10 w-10 p-0 flex-shrink-0`}
                      disabled={isLoading}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button 
                      onClick={handleSendMessage} 
                      size="sm"
                      disabled={isLoading || !inputValue.trim()}
                      className="h-10 w-10 p-0 flex-shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions - Responsive */}
                  <div className="flex flex-wrap gap-1">
                    {quickActions.map((action) => (
                      <Button
                        key={action.key}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputValue(action.text)}
                        className="text-xs h-6 px-2 flex-shrink-0"
                        disabled={isLoading}
                      >
                        {action.emoji} {action.key === 'priority' ? 'Priority' : action.key === 'summary' ? 'Summary' : action.key === 'help' ? 'Help' : 'Traffic'}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Powered by Gemini */}
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Powered by Gemini AI
                    </span>
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