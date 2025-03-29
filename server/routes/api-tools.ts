import { Router } from 'express';
import { uploadImage } from '../utils/cloudinary';

const router = Router();

// URL'den resmi Cloudinary'ye yükleme
router.post('/external-image', async (req, res, next) => {
  try {
    const { imageUrl, folder } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Görsel URL\'i gereklidir' });
    }
    
    // Cloudinary'ye yükle
    const cloudinaryUrl = await uploadImage(imageUrl, folder || 'external_images');
    
    res.json({ url: cloudinaryUrl });
  } catch (error) {
    next(error);
  }
});

export default router;