import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/chat/messages'],
    refetchOnWindowFocus: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat/messages', { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      setInput('');
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessageMutation.mutate(input);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-[#FF5864] to-[#FF876C] hover:opacity-90"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 md:w-96 p-0 rounded-xl shadow-xl h-96 flex flex-col"
          sideOffset={10}
        >
          <div className="p-3 bg-gradient-to-r from-[#FF5864] to-[#FF876C] text-white rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <img src="https://images.pexels.com/photos/3065015/pexels-photo-3065015.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AI Beauty Consultant" />
              </Avatar>
              <span className="font-medium">AI Güzellik Danışmanı</span>
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

          <ScrollArea className="flex-1 p-3 bg-white">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF5864]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
                <p className="mt-2 text-sm">Tırnak bakımı, oje renkleri veya nail art stilleri hakkında sorular sorabilirsiniz.</p>
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
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form 
            onSubmit={handleSendMessage} 
            className="border-t p-3 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit"
              size="icon"
              disabled={!input.trim() || sendMessageMutation.isPending}
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