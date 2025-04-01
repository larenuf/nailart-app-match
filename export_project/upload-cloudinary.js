// Bu dosya Cloudinary'ye resmi yüklemek için kullanılacak
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Resim dosyasının base64 kodunu alır
const imageFile = 'attached_assets/image_1743120846125.png';
const imageBuffer = fs.readFileSync(imageFile);
const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

// Cloudinary'ye resmi yükleyin
async function uploadToCloudinary() {
  try {
    const response = await fetch('http://localhost:5000/api/public-upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        folder: 'nail_designs'
      }),
    });

    const data = await response.json();
    console.log('Yükleme başarılı:', data.url);
    
    // Başarılı URL'yi HomeView.tsx dosyasına eklememiz gerekiyor
    console.log('Bu URL\'yi client/src/components/HomeView.tsx dosyasında kullanın');
  } catch (error) {
    console.error('Yükleme hatası:', error);
  }
}

uploadToCloudinary();