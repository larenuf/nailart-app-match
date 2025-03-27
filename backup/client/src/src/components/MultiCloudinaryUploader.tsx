import { useState, useCallback, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MultiCloudinaryUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  className?: string;
  folder?: string;
  maxFiles?: number;
  initialImages?: string[];
}

export default function MultiCloudinaryUploader({
  onUploadComplete,
  className = '',
  folder = 'nail_art_match',
  maxFiles = 5,
  initialImages = [],
}: MultiCloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);
  const { toast } = useToast();

  // Dosyayı Base64'e dönüştür
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Dosya yükleme işlemi
  const uploadToCloudinary = async (base64Images: string[]) => {
    try {
      setIsUploading(true);
      // Progress simülasyonu
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      const response = await apiRequest('POST', '/api/upload/multiple', {
        images: base64Images,
        folder,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      // Mevcut ve yeni resimleri birleştir
      const allUrls = [...previewUrls, ...data.urls];
      setPreviewUrls(allUrls);
      onUploadComplete(allUrls);
      
      toast({
        title: 'Yükleme başarılı',
        description: `${data.urls.length} görsel başarıyla yüklendi.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Yükleme başarısız',
        description: error.message || 'Görseller yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Dosyaları bıraktığında veya seçtiğinde
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        try {
          // Toplam dosya sayısını kontrol et
          if (previewUrls.length + acceptedFiles.length > maxFiles) {
            toast({
              variant: 'destructive',
              title: 'Çok fazla dosya',
              description: `En fazla ${maxFiles} dosya yükleyebilirsiniz.`,
            });
            return;
          }
          
          // Her bir dosya için boyut kontrolü (5MB'a kadar)
          const oversizedFiles = acceptedFiles.filter(file => file.size > 5 * 1024 * 1024);
          if (oversizedFiles.length > 0) {
            toast({
              variant: 'destructive',
              title: 'Dosyalar çok büyük',
              description: 'Her bir dosya en fazla 5MB boyutunda olabilir.',
            });
            return;
          }
          
          // Tüm dosyaları Base64'e çevir
          const base64Promises = acceptedFiles.map(convertToBase64);
          const base64Images = await Promise.all(base64Promises);
          
          // Cloudinary'ye yükle
          await uploadToCloudinary(base64Images);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Dosya işleme hatası',
            description: error.message || 'Dosyalar işlenirken bir hata oluştu.',
          });
        }
      }
    },
    [previewUrls, maxFiles, onUploadComplete, toast, folder]
  );

  // Dropzone ayarları
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: maxFiles - previewUrls.length,
    disabled: isUploading || previewUrls.length >= maxFiles,
  });

  // Bir görseli kaldır
  const handleRemoveImage = (index: number) => {
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
    onUploadComplete(newUrls);
  };

  // Tüm görselleri temizle
  const handleClearAll = () => {
    setPreviewUrls([]);
    onUploadComplete([]);
  };

  // Dropzone stilleri
  const style: CSSProperties = {
    borderColor: isDragActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
    backgroundColor: isDragActive
      ? 'hsl(var(--accent) / 0.7)'
      : 'hsl(var(--accent) / 0.2)',
    opacity: isUploading || previewUrls.length >= maxFiles ? 0.6 : 1,
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Yüklenen görseller */}
      {previewUrls.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Yüklenen Görseller ({previewUrls.length}/{maxFiles})</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAll}
              disabled={isUploading}
            >
              Tümünü Temizle
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group border rounded-md overflow-hidden">
                <img
                  src={url}
                  alt={`Görsel ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isUploading}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropzone alanı */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer relative min-h-[150px] flex flex-col items-center justify-center"
        style={style}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Yükleniyor... {uploadProgress}%</p>
            <div className="w-full max-w-xs bg-secondary mt-2 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : previewUrls.length >= maxFiles ? (
          <p className="text-muted-foreground">
            Maksimum dosya sayısına ulaştınız ({maxFiles})
          </p>
        ) : isDragActive ? (
          <div className="flex flex-col items-center">
            <UploadCloud className="h-8 w-8 text-primary mb-2" />
            <p>Dosyaları buraya bırakın...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-2">
              {previewUrls.length === 0
                ? "Görselleri sürükleyip bırakın veya"
                : `Daha fazla görsel ekleyin (${previewUrls.length}/${maxFiles})`}
            </p>
            <Button type="button" variant="outline" onClick={open} disabled={previewUrls.length >= maxFiles}>
              Dosya Seçin
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG veya WEBP, her biri en fazla 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}