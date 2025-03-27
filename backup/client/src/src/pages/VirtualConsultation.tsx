import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { Camera, Image, RefreshCw, Check, X, MessageCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const NAIL_STYLES = [
  {
    id: 1,
    name: "Fransız Manikür",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371",
    description: "Klasik ve zarif bir stil, her ortama uygun."
  },
  {
    id: 2,
    name: "Ombre Tırnaklar",
    imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53",
    description: "Bir renkten diğerine yumuşak geçiş için mükemmel."
  },
  {
    id: 3,
    name: "Geometrik Desenler",
    imageUrl: "https://images.unsplash.com/photo-1613896640137-bb5b31496315",
    description: "Modern ve göz alıcı bir görünüm için."
  },
  {
    id: 4,
    name: "Çiçek Desenleri",
    imageUrl: "https://images.unsplash.com/photo-1636018074333-9c7b5d7a88ba",
    description: "Doğadan ilham alan narin ve feminen bir stil."
  },
  {
    id: 5,
    name: "Minimal Çizgiler",
    imageUrl: "https://images.unsplash.com/photo-1607779097040-a6d2f86d769d",
    description: "Sade ama şık bir görünüm isteyenler için."
  },
  {
    id: 6,
    name: "Mermere Benzeyen",
    imageUrl: "https://images.unsplash.com/photo-1640444830875-de72513f0389",
    description: "Lüks ve sofistike bir görünüm için."
  }
];

export default function VirtualConsultation() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("camera");
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    {text: "Merhaba! Ben sanal tırnak sanatı danışmanınız. Size nasıl yardımcı olabilirim?", isUser: false}
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCaptureImage = () => {
    // In a real app, this would access the device camera
    // For this mockup, we'll use a sample image
    setUserImage("https://images.unsplash.com/photo-1581172983039-4bfa42d2aaa9");
    toast({
      description: "Fotoğraf başarıyla çekildi.",
    });
  };
  
  const resetImage = () => {
    setUserImage(null);
    setResultImage(null);
    setSelectedStyle(null);
  };
  
  const processImage = () => {
    if (!userImage || selectedStyle === null) {
      toast({
        title: "Hata",
        description: "Lütfen bir fotoğraf ve tırnak stili seçin.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simüle edilmiş AI görüntü işleme - gerçek projede bir AI API'si kullanılırdı
    // Burada compositing yapıyoruz
    setTimeout(() => {
      // Bu mock bir demo için, gerçek bir görüntü işleme işlevi olacaktır
      // Burada el fotoğrafının üzerine seçilen tırnak stilini uyguluyoruz
      
      // Demo için, tırnak stilini uygulanmış gibi göstermek için bir demo resim kullanıyoruz
      // Gerçek bir uygulamada, bu kısımda bir AI modeli çağrılacaktır
      const demoImages = [
        "https://images.unsplash.com/photo-1604654894610-df63bc536371",
        "https://images.unsplash.com/photo-1610992008581-6428a02de39b",
        "https://images.unsplash.com/photo-1519014816548-bf5fe059798b"
      ];
      
      // Demo için rasgele bir "işlenmiş" görüntü seçiyoruz
      setResultImage(demoImages[Math.floor(Math.random() * demoImages.length)]);
      setIsProcessing(false);
      
      toast({
        title: "İşlem Tamamlandı!",
        description: "Sanal tırnak uygulaması hazır. Bu bir demo görüntüdür, gerçek bir AI entegrasyonunda kendi elinize uygulanacaktır.",
      });
    }, 2000);
  };
  
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, {text: message, isUser: true}]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      let response = "Tırnak bakımı hakkında daha fazla bilgi almak ister misiniz?";
      
      if (message.toLowerCase().includes("french") || message.toLowerCase().includes("fransız")) {
        response = "Fransız manikürü klasik ve her zaman moda olan bir seçenektir. İnce beyaz uçlar zarif bir görünüm sağlar.";
      } else if (message.toLowerCase().includes("ombre")) {
        response = "Ombre tırnaklar, bir renkten diğerine yumuşak bir geçiş sağlayan modern bir stildir. Özel günler için harika bir seçim!";
      } else if (message.toLowerCase().includes("geometri") || message.toLowerCase().includes("çizgi")) {
        response = "Geometrik desenler cesur ve modern bir görünüm ister. İnce fırça veya tırnak bantları kullanarak kolayca uygulanabilir.";
      } else if (message.toLowerCase().includes("fiyat") || message.toLowerCase().includes("ücret")) {
        response = "Fiyatlar seçtiğiniz tırnak stiline ve salona göre değişiklik gösterir. Fransız manikür genellikle 150-200₺ arasındadır.";
      } else if (message.toLowerCase().includes("süre") || message.toLowerCase().includes("ne kadar sürer")) {
        response = "Tırnak uygulaması genellikle 30-60 dakika arasında sürer. Karmaşık desenler için bu süre 90 dakikaya kadar uzayabilir.";
      }
      
      setChatMessages(prev => [...prev, {text: response, isUser: false}]);
    }, 1000);
    
    // Focus input after sending
    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold font-playfair mb-4">Sanal Tırnak Danışmanı</h1>
        
        <Tabs defaultValue="camera" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">Kamera ile Dene</TabsTrigger>
            <TabsTrigger value="styles">Tırnak Stilleri</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {!userImage ? (
                <div className="h-80 flex flex-col items-center justify-center gap-4 p-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-center">Ellerinizin fotoğrafını yükleyin veya çekin</p>
                  
                  <div className="flex gap-3 mt-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Fotoğraf Yükle
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                    
                    <Button onClick={handleCaptureImage}>
                      <Camera className="h-4 w-4 mr-2" />
                      Fotoğraf Çek
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={resultImage || userImage}
                    alt="Kullanıcı fotoğrafı"
                    className="w-full h-80 object-cover"
                  />
                  
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Tırnak stili uygulanıyor...</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button variant="secondary" size="icon" onClick={resetImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {resultImage && (
                    <div className="absolute bottom-2 right-2">
                      <Button size="sm" onClick={() => setShowChat(true)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Stilist ile Konuş
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {userImage && !resultImage && (
                <div className="p-4">
                  <h3 className="font-medium mb-3">Bir tırnak stili seçin</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {NAIL_STYLES.slice(0, 6).map((style, index) => (
                      <div
                        key={style.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          selectedStyle === index ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setSelectedStyle(index)}
                      >
                        <img
                          src={style.imageUrl}
                          alt={style.name}
                          className="w-full h-20 object-cover"
                        />
                        {selectedStyle === index && (
                          <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" onClick={processImage} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      "Stili Uygula"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="styles" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {NAIL_STYLES.map((style) => (
                <div
                  key={style.id}
                  className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900">{style.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{style.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Chat with stylist */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
            <div className="bg-white rounded-t-xl w-full max-w-md max-h-[70vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium">Tırnak Sanatı Danışmanı</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.isUser
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Stiliste bir soru sorun..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    ref={chatInputRef}
                  />
                  <Button variant="secondary" onClick={sendMessage}>
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor" className="h-5 w-5 rotate-90">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}