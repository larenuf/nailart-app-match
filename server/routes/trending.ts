import { Router } from 'express';
import { storage } from '../storage';

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
        imageUrl: "/images/french-manicure.png"
      },
      {
        id: 2,
        title: "Jel Tasarım",
        titleEn: "Gel Design",
        titleAr: "تصميم جل",
        likes: 187,
        color: "#d9e9ff",
        imageUrl: "/images/gel-design.png"
      },
      {
        id: 3,
        title: "Minimalist Çizgiler",
        titleEn: "Minimalist Lines",
        titleAr: "خطوط بسيطة",
        likes: 312,
        color: "#f5f5f5",
        imageUrl: "/images/minimalist-lines.png"
      },
      {
        id: 4,
        title: "Glitter Parlaklık",
        titleEn: "Glitter Shine",
        titleAr: "بريق لامع",
        likes: 276,
        color: "#fbe3f3",
        imageUrl: "/images/glitter-shine.png"
      }
    ];
    
    res.json(designs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;