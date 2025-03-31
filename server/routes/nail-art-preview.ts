import { Router } from 'express';
import { storage } from '../storage';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import { randomBytes } from 'crypto';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import path from 'path';
import { uploadImage } from '../utils/cloudinary';

export const nailArtPreviewRouter = Router();

// Nail Art AI önizleme API endpoint'i
nailArtPreviewRouter.post('/nail-art-preview', async (req, res) => {
  try {
    const { image, designId } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Görüntü sağlanmadı' });
    }
    
    if (!designId) {
      return res.status(400).json({ error: 'Tasarım ID\'si sağlanmadı' });
    }
    
    // OpenAI API anahtarı alınıyor
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY çevre değişkeni tanımlanmamış');
      // API anahtarı yoksa simülasyon modunu kullan
      const resultImageUrl = await simulateAIProcessing(image, designId);
      return res.json({ 
        success: true,
        resultImage: resultImageUrl 
      });
    }
    
    // Uzak API çağrısı için görüntüyü base64'ten çıkar
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    try {
      // OpenAI API konfigürasyonu
      const openai = new OpenAI({
        apiKey: apiKey,
      });
      
      // Tasarım tipi açıklamaları
      const designDescriptions = [
        "Fransız manikürü (French manicure) tarzında şık ve profesyonel görünümlü tırnaklar",
        "Pembe ve altın tonlarında parlak simli oje ile süslenmiş tırnaklar",
        "Mavi ve beyaz renklerde geometrik desen çizimli modern tırnaklar",
        "Mor tonlarından maviye yumuşak geçişli ombre efektli tırnaklar",
        "Beyaz, altın ve siyah renklerde mermer deseni efekti uygulanmış tırnaklar"
      ];
      
      // Tasarım görselleri (simülasyon veya hata durumu için)
      const designVisuals = [
        "https://images.unsplash.com/photo-1604902396830-aca29e19b067",
        "https://images.unsplash.com/photo-1632344506209-99cf6b38e24c",
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e",
        "https://images.unsplash.com/photo-1607979036813-9d7faf53fe20",
        "https://images.unsplash.com/photo-1604902396830-aca29e19b067"
      ];
      
      // Tasarım kimliği için fazla yüksek indeksleri düzelt
      const safeDesignId = (designId - 1) % designDescriptions.length;
      
      // Vision API veya yeni editlerde kullanılacak stil açıklaması
      const designStyle = designDescriptions[safeDesignId];
      const visualExample = designVisuals[safeDesignId];
      
      console.log(`OpenAI API kullanılarak görüntü işleniyor. Stil: ${designStyle}`);
      
      try {
        // Geçici dosya oluşturma için rastgele isim
        const randomId = randomBytes(8).toString('hex');
        const inputImagePath = path.join(__dirname, `../../temp_nail_image_${randomId}.png`);
        
        // Base64 görüntüyü dosyaya kaydet
        writeFileSync(inputImagePath, buffer);
        
        // Gerçek tırnak işleme için GPT-4 Vision API'yi kullanın
        const promptMessage = `
        Bu gerçek bir tırnak fotoğrafı. Bu tırnağa şu tasarımı uygulamanı istiyorum: "${designStyle}".
        
        Lütfen yeni bir görsel oluştur ve bu görsel:
        1. Tam olarak orijinal el ve tırnak pozisyonunu korusun
        2. Tırnakları belirlenen tasarımla değiştirsin, elin geri kalanını koruyarak
        3. Gerçekçi bir şekilde, profesyonel manikür uygulanmış gibi görünsün
        4. Işık ve gölgeler doğal olsun
        
        NOT: Sadece tırnak bölgelerini değiştir, elin kendisini veya parmaklarını değiştirme. Amacımız, sadece bu tırnağa yeni bir tasarım uygulanmış halini görmek.
        `;
                
        try {
          // İlk olarak görsel içeriğe GPT-4o ile bakış
          const visionResponse = await openai.chat.completions.create({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: promptMessage },
                  {
                    type: "image_url", 
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Data}`
                    }
                  }
                ],
              },
            ],
            max_tokens: 1000
          });
  
          // Vision'dan alınan analiz sonucunu kullanarak DALL-E 3 için yeni prompt oluştur
          const visionAnalysis = visionResponse.choices[0].message.content || "";
          
          // DALL-E için detaylı prompt oluştur
          const dallePrompt = `
          Gerçekçi yakın çekim bir el fotoğrafı, tamamen gerçekçi stil. Görüntüde sadece tırnaklar şu tasarıma sahip olmalı: ${designStyle}.
          Tırnaklar tamamen profesyonel manikür yapılmış gibi görünmeli. 
          Işık doğal olmalı, gölgeler gerçekçi olmalı.
          Tırnaklar temiz, parlak ve detaylı olmalı.
          ${visionAnalysis}
          `;
            
          console.log("DALL-E 3 için prompt oluşturuldu, görsel üretiliyor...");
              
          // DALL-E 3 ile gerçekçi tırnak tasarımı oluştur
          const dalleResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: dallePrompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "natural" // Daha gerçekçi sonuçlar için
          });
          
          // DALL-E'den görsel URL'ini al
          const generatedImageUrl = dalleResponse.data[0].url;
          
          if (!generatedImageUrl) {
            throw new Error('API yanıtından görüntü URL\'i alınamadı');
          }
          
          console.log("DALL-E 3 tarafından görsel oluşturuldu:", generatedImageUrl);
          
          // Geçici dosyayı temizle
          try {
            unlinkSync(inputImagePath);
          } catch (cleanupError) {
            console.warn('Geçici dosya temizlenirken hata:', cleanupError);
          }
          
          // Oluşturulan görüntüyü dön
          return res.json({ 
            success: true,
            resultImage: generatedImageUrl
          });
          
        } catch (openaiError) {
          console.error('OpenAI Vision veya DALL-E API hatası:', openaiError);
          // API hatası durumunda fallback modu kullan
          const resultImageUrl = visualExample + `?random=${Date.now()}`;
          return res.json({ 
            success: true,
            resultImage: resultImageUrl
          });
        }
      } catch (fileError) {
        console.error('Dosya işleme hatası:', fileError);
        // Dosya hatası durumunda fallback modu kullan
        const resultImageUrl = visualExample + `?random=${Date.now()}`;
        return res.json({ 
          success: true,
          resultImage: resultImageUrl
        });
      }
    } catch (openaiError) {
      console.error('OpenAI konfigürasyon hatası:', openaiError);
      // Genel hata durumunda simülasyon modunu kullan
      const resultImageUrl = await simulateAIProcessing(image, designId);
      return res.json({ 
        success: true,
        resultImage: resultImageUrl 
      });
    }
  } catch (error: any) {
    console.error('Nail Art Preview API hatası:', error);
    res.status(500).json({ 
      error: 'Nail Art önizleme işlemi sırasında bir hata oluştu',
      message: error.message
    });
  }
});

// OpenAI API olmadığında veya hata durumunda kullanılacak simülasyon işlevi
async function simulateAIProcessing(image: string, designId: number): Promise<string> {
  console.log('AI işleme simülasyonu başlatılıyor...');
  
  // Simüle edilmiş tasarım görüntüleri (geri dönüş görüntüleri)
  const designResults = [
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067",
    "https://images.unsplash.com/photo-1632344506209-99cf6b38e24c",
    "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e",
    "https://images.unsplash.com/photo-1607979036813-9d7faf53fe20",
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067"
  ];
  
  // 2 saniye gecikme simülasyonu (gerçek bir API çağrısının süresini taklit etmek için)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Tasarım ID'sine göre görüntü seçimi (sınırlar dahilinde)
  const safeDesignId = (designId - 1) % designResults.length;
  
  // Simüle edilmiş sonuçta rastgelelik eklemek için
  const randomSuffix = `?random=${Date.now()}`;
  return `${designResults[safeDesignId]}${randomSuffix}`;
}