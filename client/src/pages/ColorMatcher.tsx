import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import { Camera, Upload, RefreshCw, CircleDashed, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Sample color palette data
const COLOR_PALETTES = [
  {
    id: 1,
    name: "Yaz Tonları",
    colors: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"],
    matchPercentage: 95,
  },
  {
    id: 2,
    name: "Doğal Nötr",
    colors: ["#F1E0D6", "#D7C0AE", "#967E76", "#574240", "#3F2E29"],
    matchPercentage: 88,
  },
  {
    id: 3,
    name: "Modern Pastel",
    colors: ["#CBE4DE", "#A2CDCD", "#7DA2A6", "#607375", "#34494A"],
    matchPercentage: 82,
  },
  {
    id: 4,
    name: "Sonbahar Seçkisi",
    colors: ["#FFCB91", "#EF9273", "#EF7B6A", "#DE6B58", "#C45B51"],
    matchPercentage: 75,
  },
  {
    id: 5,
    name: "Klasik Kırmızılar",
    colors: ["#D10000", "#A60000", "#790000", "#610000", "#400000"],
    matchPercentage: 70,
  },
];

export default function ColorMatcher() {
  const { toast } = useToast();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<typeof COLOR_PALETTES | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [selectedOutfitArea, setSelectedOutfitArea] = useState<{x: number, y: number} | null>(null);
  const [skinToneHue, setSkinToneHue] = useState<number[]>([50]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        resetAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCaptureImage = () => {
    // In a real app, this would access the device camera
    // For this mockup, we'll use a sample image
    setUserImage("https://images.unsplash.com/photo-1593592023995-a8f5747a0640");
    resetAnalysis();
    toast({
      description: "Fotoğraf başarıyla çekildi.",
    });
  };
  
  const resetAnalysis = () => {
    setMatchResults(null);
    setDominantColors([]);
    setSelectedOutfitArea(null);
    setSelectedColor(null);
    setSkinToneHue([50]);
  };
  
  const resetImage = () => {
    setUserImage(null);
    resetAnalysis();
  };
  
  const analyzeImage = () => {
    if (!userImage) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir fotoğraf yükleyin veya çekin.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedOutfitArea) {
      toast({
        title: "Seçim Yapın",
        description: "Lütfen önce fotoğraf üzerinde bir bölge seçin.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI color analysis
    setTimeout(() => {
      // In a real app, this would perform image analysis and color detection
      // For this mockup, we'll use predefined results
      
      // Generate 5 random colors for demonstration
      const extractedColors = [
        "#" + Math.floor(Math.random()*16777215).toString(16),
        "#" + Math.floor(Math.random()*16777215).toString(16),
        "#" + Math.floor(Math.random()*16777215).toString(16),
        "#" + Math.floor(Math.random()*16777215).toString(16),
        "#" + Math.floor(Math.random()*16777215).toString(16),
      ];
      
      setDominantColors(extractedColors);
      setMatchResults(COLOR_PALETTES);
      setIsAnalyzing(false);
      
      toast({
        title: "Analiz Tamamlandı",
        description: "En uyumlu tırnak renkleri belirlendi.",
      });
    }, 2000);
  };
  
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSelectedOutfitArea({ x, y });
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    toast({
      description: "Renk seçildi! Artık bu renkteki tırnak sanatçılarını arayabilirsiniz.",
    });
  };
  
  const findNailArtists = () => {
    if (!selectedColor) {
      toast({
        description: "Lütfen önce bir renk seçin.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would navigate to search results
    window.location.href = "/search";
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold font-playfair mb-2">AI ile Renk Eşleştirme</h1>
        <p className="text-gray-600 text-sm mb-4">
          Kıyafetinizin fotoğrafını yükleyin, yapay zeka en uyumlu tırnak renklerini önerecek.
        </p>
        
        <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
          {!userImage ? (
            <div className="h-80 flex flex-col items-center justify-center gap-4 p-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-gray-500 text-center">Kıyafetinizin fotoğrafını yükleyin veya çekin</p>
              
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
                ref={imageRef}
                src={userImage}
                alt="Kullanıcı kıyafeti"
                className="w-full h-80 object-cover cursor-crosshair"
                onClick={handleImageClick}
              />
              
              {selectedOutfitArea && (
                <div 
                  className="absolute w-8 h-8 rounded-full border-2 border-primary transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${selectedOutfitArea.x}%`,
                    top: `${selectedOutfitArea.y}%`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-primary bg-opacity-30"></div>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Renkler analiz ediliyor...</p>
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="secondary" size="icon" onClick={resetImage}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {userImage && !isAnalyzing && !matchResults && (
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                Kıyafetinizin üzerinde analiz etmek istediğiniz bir noktaya tıklayın, sonra 
                "Renk Analizi Yap" butonuna basın.
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Ten Tonu Ayarı</label>
                  <span className="text-xs text-gray-500">
                    {skinToneHue[0] < 30 ? "Koyu" : skinToneHue[0] < 60 ? "Orta" : "Açık"}
                  </span>
                </div>
                <Slider
                  value={skinToneHue}
                  onValueChange={setSkinToneHue}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Koyu</span>
                  <span>Açık</span>
                </div>
              </div>
              
              <Button className="w-full" onClick={analyzeImage} disabled={!selectedOutfitArea}>
                {!selectedOutfitArea ? "Önce bir bölge seçin" : "Renk Analizi Yap"}
              </Button>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        {matchResults && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-2">Tespit Edilen Renkler</h2>
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2">
                  {dominantColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full shadow-sm cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    >
                      {selectedColor === color && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={resetAnalysis}>
                  Sıfırla
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Önerilen Renk Paletleri</h2>
              <div className="space-y-3">
                {matchResults.map((palette) => (
                  <div key={palette.id} className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{palette.name}</h3>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 w-16 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${palette.matchPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{palette.matchPercentage}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-md shadow-sm cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelect(color)}
                        >
                          {selectedColor === color && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white drop-shadow" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedColor && (
              <Button className="w-full mt-4" onClick={findNailArtists}>
                Bu Renkte Uzman Ara
              </Button>
            )}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}