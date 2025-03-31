import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { Loader2, Upload, Palette, Check } from "lucide-react";

// Varsayılan nail art tasarımları
const DEFAULT_DESIGNS = [
  { id: 1, name: "Klasik Fransız", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Geometrik", imageUrl: "https://images.unsplash.com/photo-1618166555611-7f11efc4a0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Çiçekli", imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Mermer Efekt", imageUrl: "https://images.unsplash.com/photo-1632344506497-b271079567a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Neon", imageUrl: "https://images.unsplash.com/photo-1610992364427-6b56e1cba8ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Minimal", imageUrl: "https://images.unsplash.com/photo-1607779097040-8c12013a7c15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
];

const NailArtPreview: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"upload" | "select" | "processing" | "result">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dosya yükleme işlemi
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya türü kontrolü
    if (!file.type.includes("image")) {
      toast({
        title: "Hata",
        description: "Lütfen bir resim dosyası yükleyin.",
        variant: "destructive",
      });
      return;
    }

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    // Dosyayı oku ve base64'e çevir
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        setStep("select");
      }
    };
    reader.readAsDataURL(file);
  };

  // Tasarım seçme işlemi
  const handleDesignSelect = (designId: number) => {
    setSelectedDesign(designId);
  };

  // AI işlemi başlat
  const startProcessing = async () => {
    if (!uploadedImage || !selectedDesign) {
      toast({
        title: "Hata",
        description: "Lütfen bir fotoğraf ve tasarım seçin.",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");
    setIsProcessing(true);

    try {
      // API isteği için simüle edilmiş gecikme
      // Gerçek uygulamada bu kısımda backend API'ye istek yapılacak
      setTimeout(() => {
        // Başarılı işleme sonrası
        // Gerçek API entegrasyonunda, API'den dönen görsel URL'i kullanılacak
        setResultImage(DEFAULT_DESIGNS[selectedDesign - 1].imageUrl);
        setIsProcessing(false);
        setStep("result");
      }, 3000);
    } catch (error) {
      console.error("İşleme hatası:", error);
      toast({
        title: "Hata",
        description: "Görsel işlenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      setIsProcessing(false);
      setStep("select");
    }
  };

  // Yeni deneme başlat
  const startOver = () => {
    setUploadedImage(null);
    setSelectedDesign(null);
    setResultImage(null);
    setStep("upload");
  };

  // Fotoğraf yükleme içeriği
  const renderUploadStep = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Tırnak Fotoğrafınızı Yükleyin</h2>
      <p className="text-gray-600 mb-6">AI teknolojimizle tırnaklarınızda farklı tasarımları görselleştirin.</p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 relative cursor-pointer hover:border-[#6A5ACD] transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-gray-500 font-medium">Tıklayın veya Sürükleyin</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG veya JPEG (max 5MB)</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">İpuçları:</h3>
        <ul className="text-sm text-gray-600 text-left space-y-2">
          <li>• İyi aydınlatılmış bir ortamda çekim yapın</li>
          <li>• Tırnaklarınız fotoğrafın merkezinde olsun</li>
          <li>• Mümkünse doğal ışık kullanın</li>
          <li>• Tek bir el veya tırnak yeterlidir</li>
        </ul>
      </div>
    </div>
  );

  // Tasarım seçme içeriği
  const renderSelectStep = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasarım Seçin</h2>
      
      {uploadedImage && (
        <div className="mb-4 rounded-lg overflow-hidden shadow-md">
          <img 
            src={uploadedImage} 
            alt="Yüklenen tırnak" 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      <h3 className="font-medium mb-2">Tırnağınıza uygulanacak tasarımı seçin:</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {DEFAULT_DESIGNS.map((design) => (
          <div 
            key={design.id} 
            className={`border rounded-lg p-1 cursor-pointer transition-all ${selectedDesign === design.id ? 'border-[#6A5ACD] ring-2 ring-[#6A5ACD]/20' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleDesignSelect(design.id)}
          >
            <img 
              src={design.imageUrl} 
              alt={design.name}
              className="w-full h-32 object-cover rounded"
            />
            <p className="text-center text-sm mt-1">{design.name}</p>
          </div>
        ))}
      </div>
      
      <div className="sticky bottom-0 bg-white pt-2 pb-2">
        <button
          className="w-full bg-[#6A5ACD] text-white py-3 rounded-lg font-medium hover:bg-[#6A5ACD]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={startProcessing}
          disabled={!selectedDesign}
        >
          <Palette className="h-4 w-4 mr-2" />
          Tasarımı Uygula
        </button>
      </div>
    </div>
  );

  // İşlem içeriği
  const renderProcessingStep = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#6A5ACD] mb-4" />
        <h2 className="text-xl font-bold mb-2">AI Tasarımınızı Oluşturuyor</h2>
        <p className="text-gray-600">Bu işlem yaklaşık 30 saniye sürebilir.</p>
      </div>
      
      <div className="mt-12 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">İşlem sırası:</h3>
        <ul className="text-sm text-left space-y-3">
          <li className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>Tırnak bölgelerini tespit ediliyor</span>
          </li>
          <li className="flex items-center">
            <div className="h-4 w-4 bg-[#6A5ACD] rounded-full animate-pulse mr-2"></div>
            <span>Seçtiğiniz tasarım uygulanıyor</span>
          </li>
          <li className="flex items-center text-gray-400">
            <div className="h-4 w-4 rounded-full border border-gray-300 mr-2"></div>
            <span>Görsel kalitesi optimize ediliyor</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // Sonuç içeriği
  const renderResultStep = () => (
    resultImage && (
      <div>
        <h2 className="text-xl font-bold mb-4">İşte Yeni Tırnak Tasarımınız!</h2>
        
        <div className="rounded-lg overflow-hidden shadow-lg mb-6">
          <img 
            src={resultImage} 
            alt="AI ile oluşturulan tırnak tasarımı" 
            className="w-full h-auto"
          />
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            className="w-full bg-[#6A5ACD] text-white py-3 rounded-lg font-medium hover:bg-[#6A5ACD]/90 transition-colors"
            onClick={() => {
              toast({
                title: "Bilgi",
                description: "Görsel indiriliyor...",
              });
            }}
          >
            Görüntüyü İndir
          </button>
          
          <button 
            className="w-full bg-white border border-[#6A5ACD] text-[#6A5ACD] py-3 rounded-lg font-medium hover:bg-[#6A5ACD]/5 transition-colors"
            onClick={() => setStep("select")}
          >
            Farklı Tasarım Dene
          </button>
          
          <button 
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={startOver}
          >
            Yeni Fotoğraf Yükle
          </button>
        </div>
        
        <div className="mt-6 bg-[#F9E0E7] p-4 rounded-lg">
          <h3 className="font-medium mb-2">Beğendiniz mi?</h3>
          <p className="text-sm">Bu tasarımı bir salonumuzda profesyonel olarak yaptırabilirsiniz. Size en yakın salonları görmek için aşağıdaki butona tıklayın.</p>
          <button 
            className="w-full bg-white text-[#6A5ACD] border border-[#6A5ACD] py-2 rounded-lg font-medium mt-3 hover:bg-[#6A5ACD]/5 transition-colors"
            onClick={() => window.location.href = "/salons"}
          >
            Bu Tasarımı Yaptırmak İstiyorum
          </button>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <TopNavigation title="AI Tırnak Tasarımı" showBackButton={true} />
      
      {/* İçerik Alanı - Fixed Header ve BottomNavigation arasında */}
      <div className="flex-1 overflow-auto">
        {/* Adım göstergesi kısmı - Sabit üst başlık olarak */}
        <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-gray-100">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${step === "upload" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "upload" ? "bg-[#6A5ACD] text-white" : "bg-gray-200"}`}>
                {step === "upload" ? "1" : <Check className="h-4 w-4" />}
              </div>
              <span className="text-xs">Fotoğraf</span>
            </div>
            <div className={`flex flex-col items-center ${step === "select" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "select" ? "bg-[#6A5ACD] text-white" : "bg-gray-200"}`}>
                {step === "select" ? "2" : step === "processing" || step === "result" ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-xs">Tasarım</span>
            </div>
            <div className={`flex flex-col items-center ${step === "result" ? "text-[#6A5ACD]" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === "result" ? "bg-[#6A5ACD] text-white" : "bg-gray-200"}`}>
                {step === "result" ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span className="text-xs">Sonuç</span>
            </div>
          </div>
        </div>

        {/* İçerik kısmı - Scrollable alan */}
        <div className="p-4 pb-20">
          {step === "upload" && renderUploadStep()}
          {step === "select" && renderSelectStep()}
          {step === "processing" && renderProcessingStep()}
          {step === "result" && renderResultStep()}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default NailArtPreview;