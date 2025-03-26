import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '../middleware/errorHandler';

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Resmi Base64 olarak alıp Cloudinary'ye yükler
export async function uploadImage(
  file: string,
  folder: string = 'nail_art_match'
): Promise<string> {
  try {
    // Base64 veriyi kontrol et
    if (!file || !file.startsWith('data:image')) {
      throw new ApiError(400, 'Geçersiz resim formatı. Base64 formatında bir görüntü gerekli.');
    }

    // Cloudinary'ye yükle
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto' }, // Otomatik kalite optimizasyonu
        { fetch_format: 'auto' } // Tarayıcıya uygun format
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary görüntü yükleme hatası:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Görüntü yüklenirken bir hata oluştu');
  }
}

// Çoklu resim yükleme
export async function uploadMultipleImages(
  files: string[],
  folder: string = 'nail_art_match'
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Cloudinary çoklu görüntü yükleme hatası:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Görüntüler yüklenirken bir hata oluştu');
  }
}

// Görüntü silme (Cloudinary'den public_id ile)
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary görüntü silme hatası:', error);
    throw new ApiError(500, 'Görüntü silinirken bir hata oluştu');
  }
}

// URL'den public_id elde etme
export function getPublicIdFromUrl(url: string): string {
  try {
    // URL örnekleri:
    // https://res.cloudinary.com/cloud_name/image/upload/v1631234567/folder/file.jpg
    // https://res.cloudinary.com/cloud_name/image/upload/folder/file.jpg
    
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    
    // v1631234567 gibi sürüm bilgisini kontrol et
    const versionPattern = /^v\d+$/;
    const hasVersion = versionPattern.test(folderName);
    
    // Sürüm varsa, klasör adını bir önceki parçadan al
    let publicId;
    if (hasVersion) {
      publicId = `${urlParts[urlParts.length - 3]}/${fileName}`;
    } else {
      publicId = `${folderName}/${fileName}`;
    }
    
    // Uzantıyı kaldır (.jpg, .png, vb.)
    publicId = publicId.replace(/\.[^.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Cloudinary URL ayrıştırma hatası:', error);
    throw new ApiError(400, 'Geçersiz Cloudinary URL formatı');
  }
}