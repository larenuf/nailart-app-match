import { Router } from 'express';
import { storage } from '../storage';
import { uploadImage } from '../utils/cloudinary';

const router = Router();

// Get all trending designs
router.get('/trending-designs', async (req, res) => {
  try {
    // Bu bölüm tamamen değiştirildi - Fransız Manikürü yerine DENEME olarak değiştirildi
    const designs = [
      {
        id: 1,
        title: "DENEME",
        titleEn: "TEST",
        titleAr: "اختبار",
        likes: 243,
        color: "#ffdedc",
        imageUrl: "https://i.hizliresim.com/avlzagp.png"
      },
      {
        id: 2,
        title: "DENEME 2",
        titleEn: "TEST 2",
        titleAr: "2 اختبار",
        likes: 187,
        color: "#d9e9ff"
      },
      {
        id: 3,
        title: "DENEME 3",
        titleEn: "TEST 3",
        titleAr: "3 اختبار",
        likes: 312,
        color: "#f5f5f5"
      },
      {
        id: 4,
        title: "DENEME 4",
        titleEn: "TEST 4",
        titleAr: "4 اختبار",
        likes: 276,
        color: "#fbe3f3"
      }
    ];
    
    res.json(designs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a trending design image to Cloudinary
router.post('/trending-designs/upload-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    // Upload to Cloudinary
    const cloudinaryUrl = await uploadImage(imageUrl, 'nail_art_match/trending');
    
    res.json({ imageUrl: cloudinaryUrl });
  } catch (error: any) {
    console.error('Error uploading trending design image:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;