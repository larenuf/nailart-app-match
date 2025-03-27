import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, X, MessageCircle, Sparkles, Scissors, Compass, Gift, CalendarClock, User, Lightbulb, Settings, Palette, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Önerilen sorular ve ipuçları
const suggestedQuestions = [
  { text: "Tırnak bakımı için önerilerin neler?", icon: <Scissors size={14} /> },
  { text: "Bu sezonun trendleri neler?", icon: <Sparkles size={14} /> },
  { text: "Ten rengime uygun ojeler?", icon: <Compass size={14} /> },
  { text: "Özel fırsatlar var mı?", icon: <Gift size={14} /> },
  { text: "Manikür ne kadar sürer?", icon: <CalendarClock size={14} /> }
];

// Kullanıcı profili tipi
type UserProfile = {
  skinTone: string;
  skinType: string;
  location: string;
  age: string;
};

// AI Güzellik Asistanı için özel modlar
const chatModes = [
  { id: "general", name: "Genel", icon: <Sparkles size={14} />, description: "Genel güzellik tavsiyeleri" },
  { id: "nail", name: "Nail Art", icon: <Scissors size={14} />, description: "Tırnak tasarımları ve bakımı" },
  { id: "makeup", name: "Makyaj", icon: <Palette size={14} />, description: "Makyaj teknikleri ve ürünleri" },
  { id: "skin", name: "Cilt Bakımı", icon: <Lightbulb size={14} />, description: "Cilt sorunları ve çözümleri" }
];

// Ten rengi seçenekleri
const skinTones = [
  { id: "fair", name: "Açık Ten" },
  { id: "medium", name: "Orta Ten" },
  { id: "olive", name: "Zeytuni Ten" },
  { id: "tan", name: "Bronz Ten" },
  { id: "dark", name: "Koyu Ten" }
];

// Cilt tipi seçenekleri
const skinTypes = [
  { id: "normal", name: "Normal" },
  { id: "dry", name: "Kuru" },
  { id: "oily", name: "Yağlı" },
  { id: "combination", name: "Karma" },
  { id: "sensitive", name: "Hassas" }
];

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState("general");
  const { toast } = useToast();
  
  // Kullanıcı profili (cilt tipi, ten rengi vb.)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skinTone: "medium",
    skinType: "normal",
    location: "İstanbul",
    age: "25-35"
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetching chat history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/ai-chat/messages'],
    refetchOnWindowFocus: false,
  });

  // Send message mutation with enhanced profile data
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setTyping(true);
      const response = await apiRequest('POST', '/api/ai-chat/messages', { 
        message,
        userProfile: {
          ...userProfile,
          mode
        }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat/messages'] });
      setInput('');
      
      // Add typing indicator and then remove it after response comes
      setTimeout(() => {
        setTyping(false);
      }, 1200);
    },
    onError: (error) => {
      console.error("AI chat error:", error);
      toast({
        title: "Mesaj gönderilemedi",
        description: "Lütfen daha sonra tekrar deneyin",
        variant: "destructive",
      });
      setTyping(false);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessageMutation.mutate(input);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setShowSettings(false);
    toast({
      title: `Mod değiştirildi: ${chatModes.find(m => m.id === newMode)?.name}`,
      description: "AI asistanı artık bu alanda uzmanlaşmış şekilde yanıt verecek",
    });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  // Format message text with line breaks
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-[#FF5864] to-[#FF876C] hover:opacity-90 relative"
          >
            <MessageCircle className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">AI</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 md:w-96 p-0 rounded-xl shadow-xl h-[500px] flex flex-col"
          sideOffset={10}
        >
          <div className="p-3 bg-gradient-to-r from-[#FF5864] to-[#FF876C] text-white rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <img src="https://images.pexels.com/photos/3065015/pexels-photo-3065015.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Beauty Consultant" />
              </Avatar>
              <div>
                <span className="font-medium block">AI Güzellik Danışmanı</span>
                <span className="text-xs text-white/80 flex items-center gap-1">
                  {mode === "general" && <Sparkles size={12} />}
                  {mode === "nail" && <Scissors size={12} />}
                  {mode === "makeup" && <Palette size={12} />}
                  {mode === "skin" && <Lightbulb size={12} />}
                  <span>
                    {chatModes.find(m => m.id === mode)?.name || "Genel"} mod
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-8 w-8" 
                onClick={() => setShowSettings(!showSettings)}
                title="Ayarlar"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-8 w-8" 
                onClick={() => setOpen(false)}
                title="Kapat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Kullanıcı Profili ve Ayarlar Paneli */}
          {showSettings && (
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1" /> Kişisel Profil
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-gray-500" 
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Konuşma Modu</label>
                  <div className="grid grid-cols-2 gap-2">
                    {chatModes.map((chatMode) => (
                      <Button
                        key={chatMode.id}
                        variant={mode === chatMode.id ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "text-xs h-auto py-1 flex justify-start gap-1",
                          mode === chatMode.id 
                            ? "bg-pink-500 hover:bg-pink-600 text-white" 
                            : "text-gray-600"
                        )}
                        onClick={() => handleModeChange(chatMode.id)}
                      >
                        {chatMode.icon}
                        <span>{chatMode.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ten Rengi</label>
                    <Select 
                      value={userProfile.skinTone}
                      onValueChange={(value) => setUserProfile({...userProfile, skinTone: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Ten rengi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {skinTones.map((tone) => (
                          <SelectItem key={tone.id} value={tone.id} className="text-xs">
                            {tone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cilt Tipi</label>
                    <Select 
                      value={userProfile.skinType}
                      onValueChange={(value) => setUserProfile({...userProfile, skinType: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Cilt tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {skinTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="text-xs">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 flex items-center pt-1">
                  <Info className="h-3 w-3 mr-1" />
                  <span>Kişisel ayarlar size özel tavsiyeler almanızı sağlar</span>
                </div>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-3 bg-white" type="always">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF5864]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center py-10 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#FF5864]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Güzellik Danışmanınız</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-[250px]">
                    Tırnak bakımı, oje renkleri, nail art ve daha fazlası hakkında size yardımcı olabilirim.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2 w-full mt-4">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="justify-start text-xs gap-2 h-auto py-2 bg-gray-50 hover:bg-gray-100 border-gray-100"
                      onClick={() => handleSuggestedQuestionClick(question.text)}
                    >
                      {question.icon}
                      <span className="truncate">{question.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!message.isUser && (
                      <Avatar className="h-8 w-8 mr-2">
                        <img src="https://images.pexels.com/photos/3065015/pexels-photo-3065015.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Assistant" />
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "px-4 py-2 rounded-lg max-w-[80%]",
                        message.isUser
                          ? "bg-[#FF5864] text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{formatMessageText(message.text)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typing && (
                  <div className="flex items-end justify-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <img src="https://images.pexels.com/photos/3065015/pexels-photo-3065015.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Assistant" />
                    </Avatar>
                    <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {messages.length > 0 && !typing && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-1 overflow-x-auto scrollbar-none">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="cursor-pointer whitespace-nowrap text-xs py-1 px-2 bg-white hover:bg-gray-100"
                  onClick={() => handleSuggestedQuestionClick(question.text)}
                >
                  {question.icon} 
                  <span className="ml-1">{question.text}</span>
                </Badge>
              ))}
            </div>
          )}

          <form 
            onSubmit={handleSendMessage} 
            className="border-t p-3 flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1"
              disabled={sendMessageMutation.isPending || typing}
            />
            <Button 
              type="submit"
              size="icon"
              disabled={!input.trim() || sendMessageMutation.isPending || typing}
              className="bg-[#FF5864] hover:bg-[#FF5864]/90"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}