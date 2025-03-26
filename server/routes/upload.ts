import { Router } from 'express';
import { uploadImage, uploadMultipleImages, uploadVideo, deleteVideo, deleteImage } from '../utils/cloudinary';
import { requireAuth } from '../middleware/authMiddleware';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

// Tekli dosya yükleme
router.post('/single', requireAuth, async (req, res, next) => {
  try {
    const { image, folder } = req.body;
    
    if (!image) {
      throw new ApiError(400, 'Yüklenecek görüntü sağlanmadı');
    }
    
    const imageUrl = await uploadImage(image, folder || 'nail_art_match');
    
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    next(error);
  }
});

// Çoklu dosya yükleme
router.post('/multiple', requireAuth, async (req, res, next) => {
  try {
    const { images, folder } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new ApiError(400, 'Yüklenecek görüntüler sağlanmadı veya geçersiz format');
    }
    
    const imageUrls = await uploadMultipleImages(images, folder || 'nail_art_match');
    
    res.status(200).json({ urls: imageUrls });
  } catch (error) {
    next(error);
  }
});

// Video yükleme
router.post('/video', requireAuth, async (req, res, next) => {
  try {
    const { video, folder } = req.body;
    
    if (!video) {
      throw new ApiError(400, 'Yüklenecek video sağlanmadı');
    }
    
    const videoUrl = await uploadVideo(video, folder || 'nail_art_match_videos');
    
    res.status(200).json({ url: videoUrl });
  } catch (error) {
    next(error);
  }
});

// Medya silme (görsel veya video)
router.delete('/delete', requireAuth, async (req, res, next) => {
  try {
    const { url, type = 'image' } = req.body;
    
    if (!url) {
      throw new ApiError(400, 'Silinecek medya URL\'i sağlanmadı');
    }
    
    const publicId = getPublicIdFromUrl(url);
    let success = false;
    
    if (type === 'video') {
      success = await deleteVideo(publicId);
    } else {
      success = await deleteImage(publicId);
    }
    
    if (success) {
      res.status(200).json({ message: 'Medya başarıyla silindi' });
    } else {
      throw new ApiError(500, 'Medya silinirken bir hata oluştu');
    }
  } catch (error) {
    next(error);
  }
});

export default router;