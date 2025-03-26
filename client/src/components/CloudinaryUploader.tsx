import { useState, useCallback, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryUploaderProps {
  onUploadComplete: (url: string) => void;
  className?: string;
  folder?: string;
}

export default function CloudinaryUploader({
  onUploadComplete,
  className = '',
  folder = 'nail_art_match',
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  const uploadToCloudinary = async (base64: string) => {
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

      const response = await apiRequest('POST', '/api/upload/single', {
        image: base64,
        folder,
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setPreviewUrl(data.url);
      onUploadComplete(data.url);
      
      toast({
        title: 'Yükleme başarılı',
        description: 'Görsel başarıyla yüklendi.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Yükleme başarısız',
        description: error.message || 'Görsel yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Dosyayı bıraktığında veya seçtiğinde
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        try {
          const file = acceptedFiles[0]; // Tek dosya
          
          // Boyut kontrolü (5MB'a kadar)
          if (file.size > 5 * 1024 * 1024) {
            toast({
              variant: 'destructive',
              title: 'Dosya çok büyük',
              description: 'En fazla 5MB boyutunda dosya yükleyebilirsiniz.',
            });
            return;
          }
          
          const base64 = await convertToBase64(file);
          
          // Önizleme göster
          setPreviewUrl(base64);
          
          // Cloudinary'ye yükle
          await uploadToCloudinary(base64);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Dosya işleme hatası',
            description: error.message || 'Dosya işlenirken bir hata oluştu.',
          });
        }
      }
    },
    [onUploadComplete, toast, folder]
  );

  // Dropzone ayarları
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    noClick: !!previewUrl,
  });

  // Önizlemeyi temizle ve yeni dosya yüklemeye hazırlan
  const handleClearPreview = () => {
    setPreviewUrl(null);
  };

  // Dropzone stilleri
  const style: CSSProperties = {
    borderColor: isDragActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
    backgroundColor: isDragActive
      ? 'hsl(var(--accent) / 0.7)'
      : 'hsl(var(--accent) / 0.2)',
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer relative min-h-[200px] flex flex-col items-center justify-center"
        style={style}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p>Yükleniyor... {uploadProgress}%</p>
            <div className="w-full max-w-xs bg-secondary mt-2 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Önizleme"
              className="max-h-[200px] mx-auto object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearPreview();
              }}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center">
            <UploadCloud className="h-10 w-10 text-primary mb-2" />
            <p>Dosyayı buraya bırakın...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-2">
              Bir görsel sürükleyip bırakın veya
            </p>
            <Button type="button" variant="outline" onClick={open}>
              Dosya Seçin
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG veya WEBP, en fazla 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}