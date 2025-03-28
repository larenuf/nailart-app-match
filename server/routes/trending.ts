import { Router } from 'express';
import { storage } from '../storage';
import { uploadImage } from '../utils/cloudinary';

const router = Router();

// Get all trending designs
router.get('/trending-designs', async (req, res) => {
  try {
    const designs = [
      {
        id: 1,
        title: "Fransız Manikürü",
        titleEn: "French Manicure",
        titleAr: "مانيكير فرنسي",
        likes: 243,
        color: "#ffdedc",
        imageUrl: "https://i.hizliresim.com/avlzagp.png"
      },
      {
        id: 2,
        title: "Jel Tasarım",
        titleEn: "Gel Design",
        titleAr: "تصميم جل",
        likes: 187,
        color: "#d9e9ff"
      },
      {
        id: 3,
        title: "Minimalist Çizgiler",
        titleEn: "Minimalist Lines",
        titleAr: "خطوط بسيطة",
        likes: 312,
        color: "#f5f5f5"
      },
      {
        id: 4,
        title: "Glitter Parlaklık",
        titleEn: "Glitter Shine",
        titleAr: "بريق لامع",
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