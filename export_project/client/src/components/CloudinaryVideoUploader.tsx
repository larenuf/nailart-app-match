import { useState, useCallback, CSSProperties } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface CloudinaryVideoUploaderProps {
  onUploadComplete: (url: string) => void;
  className?: string;
  folder?: string;
  maxSizeMB?: number;
}

export default function CloudinaryVideoUploader({
  onUploadComplete,
  className = '',
  folder = 'nail_art_match_videos',
  maxSizeMB = 50, // Varsayılan olarak 50MB
}: CloudinaryVideoUploaderProps) {
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
  const uploadToCloudinary = async (base64: string, fileType: string) => {
    try {
      setIsUploading(true);
      
      // Gerçek yükleme ilerlemesini simüle etmek için
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.floor(Math.random() * 10) + 2; // 2-11 arası rastgele artış
          const newProgress = Math.min(prev + increment, 90);
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 500);

      const response = await apiRequest('POST', '/api/upload/video', {
        video: base64,
        folder,
        resourceType: 'video'
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      onUploadComplete(data.url);
      
      toast({
        title: 'Video yüklendi',
        description: 'Video başarıyla yüklendi.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Yükleme başarısız',
        description: error.message || 'Video yüklenirken bir hata oluştu.',
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Dosyayı bıraktığında veya seçtiğinde
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        try {
          const file = acceptedFiles[0]; // Tek dosya
          
          // Boyut kontrolü
          if (file.size > maxSizeMB * 1024 * 1024) {
            toast({
              variant: 'destructive',
              title: 'Dosya çok büyük',
              description: `En fazla ${maxSizeMB}MB boyutunda video yükleyebilirsiniz.`,
            });
            return;
          }
          
          // Desteklenen video tipleri kontrolü
          if (!file.type.startsWith('video/')) {
            toast({
              variant: 'destructive',
              title: 'Desteklenmeyen dosya tipi',
              description: 'Lütfen MP4, WebM veya MOV formatında bir video yükleyin.',
            });
            return;
          }
          
          // Yükleme için hazırla
          setPreviewUrl(URL.createObjectURL(file));
          
          // Base64'e dönüştür ve yükle
          const base64 = await convertToBase64(file);
          await uploadToCloudinary(base64, file.type);
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Dosya işleme hatası',
            description: error.message || 'Dosya işlenirken bir hata oluştu.',
          });
        }
      }
    },
    [onUploadComplete, toast, folder, maxSizeMB]
  );

  // Dropzone ayarları
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
    },
    maxFiles: 1,
    noClick: !!previewUrl,
  });

  // Önizlemeyi temizle ve yeni dosya yüklemeye hazırlan
  const handleClearPreview = () => {
    if (previewUrl && !isUploading) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
          <div className="flex flex-col items-center w-full max-w-xs">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p>Video yükleniyor... {uploadProgress}%</p>
            <Progress value={uploadProgress} className="w-full h-2 mt-2" />
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full">
            <video
              src={previewUrl}
              controls
              className="max-h-[200px] mx-auto"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearPreview();
              }}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center">
            <Video className="h-10 w-10 text-primary mb-2" />
            <p>Videoyu buraya bırakın...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Video className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-2">
              Bir video sürükleyip bırakın veya
            </p>
            <Button type="button" variant="outline" onClick={open}>
              Video Seçin
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              MP4, WebM veya MOV, en fazla {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}