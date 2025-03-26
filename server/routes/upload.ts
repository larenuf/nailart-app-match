import { Router } from 'express';
import { uploadImage, uploadMultipleImages } from '../utils/cloudinary';
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

export default router;