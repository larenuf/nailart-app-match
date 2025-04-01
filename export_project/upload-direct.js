// Bu script doğrudan Cloudinary API'sini kullanarak resim yükler
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function uploadToCloudinary() {
  try {
    // Resmi base64'e çevir
    const imageFile = 'attached_assets/image_1743120846125.png';
    const imageData = fs.readFileSync(imageFile);
    const base64Image = `data:image/png;base64,${imageData.toString('base64')}`;
    
    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'nail_designs',
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log('Yükleme başarılı:', result.secure_url);
  } catch (error) {
    console.error('Cloudinary yükleme hatası:', error);
  }
}

uploadToCloudinary();