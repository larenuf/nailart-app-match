import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, X, MessageCircle, Sparkles, Scissors, Compass, Gift, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetching chat history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/ai-chat/messages'],
    refetchOnWindowFocus: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      setTyping(true);
      const response = await apiRequest('POST', '/api/ai-chat/messages', { message });
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
    onError: () => {
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
                <span className="text-xs text-white/80">Her zaman yanınızda 💅</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

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