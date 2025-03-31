import { db } from "./db";
import { 
  categories, 
  stories, 
  salons, 
  artists, 
  services, 
  portfolioItems,
  availableTimeSlots,
  users
} from "@shared/schema";
import { hashPassword } from "./auth";
import { sql } from "drizzle-orm";

export async function initializeData() {
  try {
    // Verilerin zaten mevcut olup olmadığını kontrol et
    const categoryCount = await db.select({ count: sql`count(*)` }).from(categories);
    const storyCount = await db.select({ count: sql`count(*)` }).from(stories);
    
    if (categoryCount[0].count > 0 || storyCount[0].count > 0) {
      console.log("Örnek veriler zaten yüklenmiş, atlanıyor...");
      return;
    }
    
    console.log("Örnek verileri yükleme başlatılıyor...");
    
    // Kategorileri ekle
    const categoriesData = [
      {
        name: "AI Tırnak Önizleme",
        iconName: "image-plus",
        backgroundColor: "#D8BFD8" // Mor tonunda
      },
      {
        name: "Manikür",
        iconName: "hand-sparkles",
        backgroundColor: "#FFD1DC"
      },
      {
        name: "Pedikür",
        iconName: "shoe-prints",
        backgroundColor: "#ADD8E6"
      },
      {
        name: "Jel Tırnak",
        iconName: "magic",
        backgroundColor: "#98FB98"
      },
      {
        name: "Protez Tırnak",
        iconName: "gem",
        backgroundColor: "#FFA07A"
      },
      {
        name: "Nail Art",
        iconName: "paint-brush",
        backgroundColor: "#FFDAB9"
      },
      {
        name: "Kalıcı Oje",
        iconName: "fire",
        backgroundColor: "#E6E6FA"
      },
      {
        name: "French Manikür",
        iconName: "moon",
        backgroundColor: "#F0F8FF"
      },
      {
        name: "Özel Tasarım",
        iconName: "star",
        backgroundColor: "#FFF0F5"
      }
    ];
    
    await db.insert(categories).values(categoriesData);
    console.log("Kategoriler başarıyla eklendi");
    
    // Hikayeleri ekle
    const storiesData = [
      {
        title: "Bugüne Özel",
        imageUrl: "https://i.imgur.com/lDRLXVu.jpg",
        highlighted: true
      },
      {
        title: "En Yeni Trendler",
        imageUrl: "https://i.imgur.com/fX0JMHs.jpg",
        highlighted: false
      },
      {
        title: "Yaz Modası",
        imageUrl: "https://i.imgur.com/QdVQoYL.jpg",
        highlighted: false
      },
      {
        title: "Gelin Tırnakları",
        imageUrl: "https://i.imgur.com/PGQrKuM.jpg",
        highlighted: false,
        videoUrl: "https://vod-progressive.akamaized.net/exp=1716361412~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3099%2F30%2F766183933%2F3654857593.mp4~hmac=cfa4e1d6fc5518fd19787cbcc3a55bd39e67d77c72a7465994f39ef2f1c96b7e/vimeo-prod-skyfire-std-us/01/3099/30/766183933/3654857593.mp4"
      },
      {
        title: "Yeni Renkler",
        imageUrl: "https://i.imgur.com/YJ4N0Ck.jpg",
        highlighted: false
      }
    ];
    
    await db.insert(stories).values(storiesData);
    console.log("Hikayeler başarıyla eklendi");
    
    // Örnek salonlar ekle
    const salonsData = [
      {
        name: "NAM Nail Studio",
        address: "Bağdat Cad. No:112, Kadıköy, İstanbul",
        latitude: 40.977779,
        longitude: 29.076033,
        phoneNumber: "+90 212 555 1234",
        rating: 4.8,
        reviewCount: 142,
        openTime: "09:00",
        closeTime: "19:00",
        imageUrl: "https://i.imgur.com/lDRLXVu.jpg",
        discount: "%15 İndirim",
        distance: 1.2,
        isPremium: true,
        featuredPosition: 1,
        city: "İstanbul"
      },
      {
        name: "LuxNails Beauty",
        address: "Abdi İpekçi Cad. No:23, Nişantaşı, İstanbul",
        latitude: 41.051281,
        longitude: 28.991543,
        phoneNumber: "+90 212 555 5678",
        rating: 4.6,
        reviewCount: 98,
        openTime: "10:00",
        closeTime: "20:00",
        imageUrl: "https://i.imgur.com/fX0JMHs.jpg",
        discount: "İkinci işlem %50",
        distance: 2.5,
        isPremium: true,
        featuredPosition: 2,
        city: "İstanbul"
      },
      {
        name: "Parlak Tırnaklar",
        address: "Tunalı Hilmi Cad. No:42, Çankaya, Ankara",
        latitude: 39.908066,
        longitude: 32.863018,
        phoneNumber: "+90 312 555 9876",
        rating: 4.3,
        reviewCount: 67,
        openTime: "09:00",
        closeTime: "18:00",
        imageUrl: "https://i.imgur.com/QdVQoYL.jpg",
        discount: "",
        distance: 3.7,
        isPremium: false,
        featuredPosition: null,
        city: "Ankara"
      },
      {
        name: "Elite Nail Bar",
        address: "Kordon Boyu No:123, Alsancak, İzmir",
        latitude: 38.442241,
        longitude: 27.142283,
        phoneNumber: "+90 232 555 3456",
        rating: 4.9,
        reviewCount: 203,
        openTime: "10:00",
        closeTime: "21:00",
        imageUrl: "https://i.imgur.com/PGQrKuM.jpg",
        discount: "Yeni müşteriye özel %20",
        distance: 1.8,
        isPremium: true,
        featuredPosition: 3,
        city: "İzmir"
      },
      {
        name: "Peri Tırnakları",
        address: "İzmir Cad. No:45, Konak, İzmir",
        latitude: 38.423908,
        longitude: 27.134661,
        phoneNumber: "+90 232 555 7890",
        rating: 4.5,
        reviewCount: 112,
        openTime: "09:30",
        closeTime: "19:30",
        imageUrl: "https://i.imgur.com/YJ4N0Ck.jpg",
        discount: "",
        distance: 4.2,
        isPremium: false,
        featuredPosition: null,
        city: "İzmir"
      }
    ];
    
    await db.insert(salons).values(salonsData);
    console.log("Salonlar başarıyla eklendi");
    
    // Örnek sanatçılar ekle
    const artistsData = [
      {
        salonId: 1,
        name: "Ayşe Demir",
        specialty: "Nail Art Uzmanı",
        experience: "8 Yıl",
        rating: 4.9,
        reviewCount: 87,
        imageUrl: "https://i.imgur.com/xd80aCx.jpg"
      },
      {
        salonId: 1,
        name: "Mehmet Yılmaz",
        specialty: "Protez Tırnak Uzmanı",
        experience: "5 Yıl",
        rating: 4.7,
        reviewCount: 55,
        imageUrl: "https://i.imgur.com/8IwMSNl.jpg"
      },
      {
        salonId: 2,
        name: "Zeynep Kaya",
        specialty: "Nail Art & Kalıcı Oje",
        experience: "10 Yıl",
        rating: 4.8,
        reviewCount: 92,
        imageUrl: "https://i.imgur.com/j8gJmP9.jpg"
      },
      {
        salonId: 3,
        name: "Deniz Şahin",
        specialty: "Jel Tırnak Uzmanı",
        experience: "4 Yıl",
        rating: 4.5,
        reviewCount: 48,
        imageUrl: "https://i.imgur.com/pscYMFE.jpg"
      },
      {
        salonId: 4,
        name: "Selin Öztürk",
        specialty: "Nail Art & Pedikür",
        experience: "7 Yıl",
        rating: 4.9,
        reviewCount: 103,
        imageUrl: "https://i.imgur.com/JA08S9n.jpg"
      }
    ];
    
    await db.insert(artists).values(artistsData);
    console.log("Sanatçılar başarıyla eklendi");
    
    // Örnek hizmetler ekle
    const servicesData = [
      {
        artistId: 1,
        name: "Klasik Manikür",
        price: 200,
        durationMinutes: 40,
        description: "Tırnak şekillendirme, törpüleme, et yeme ve cilalama işlemleri"
      },
      {
        artistId: 1,
        name: "Kalıcı Oje",
        price: 350,
        durationMinutes: 60,
        description: "UV lamba ile kurutulan, 2-3 hafta kalıcı oje uygulaması"
      },
      {
        artistId: 1,
        name: "Özel Tasarım Nail Art",
        price: 500,
        durationMinutes: 90,
        description: "Kişiye özel, taşlı veya desenli tırnak sanatı uygulaması"
      },
      {
        artistId: 2,
        name: "Protez Tırnak (Jel)",
        price: 650,
        durationMinutes: 120,
        description: "Jel ile protez tırnak uygulaması ve şekillendirme"
      },
      {
        artistId: 2,
        name: "Protez Tırnak Bakımı",
        price: 300,
        durationMinutes: 60,
        description: "Mevcut protez tırnakların bakımı ve yenilenmesi"
      },
      {
        artistId: 3,
        name: "French Manikür",
        price: 280,
        durationMinutes: 50,
        description: "Klasik beyaz uçlu fransız tırnak uygulaması"
      },
      {
        artistId: 3,
        name: "Renkli French Dizayn",
        price: 320,
        durationMinutes: 60,
        description: "Renkli uçlarla modern fransız tırnak tasarımı"
      },
      {
        artistId: 4,
        name: "Jel Tırnak Kaplama",
        price: 400,
        durationMinutes: 70,
        description: "Doğal tırnakların jel ile kaplanması ve güçlendirilmesi"
      },
      {
        artistId: 5,
        name: "Lüks Pedikür",
        price: 380,
        durationMinutes: 75,
        description: "Ayak banyosu, peeling, masaj ve oje uygulaması"
      },
      {
        artistId: 5,
        name: "İpek Kirpik Uygulaması",
        price: 450,
        durationMinutes: 90,
        description: "Tek tek ipek kirpik uygulaması"
      }
    ];
    
    await db.insert(services).values(servicesData);
    console.log("Hizmetler başarıyla eklendi");
    
    // Örnek portfolyo öğeleri ekle
    const portfolioData = [
      {
        artistId: 1,
        imageUrl: "https://i.imgur.com/qJ9oZ7Q.jpg"
      },
      {
        artistId: 1,
        imageUrl: "https://i.imgur.com/fHAQbpy.jpg"
      },
      {
        artistId: 1,
        imageUrl: "https://i.imgur.com/IA8EiBD.jpg"
      },
      {
        artistId: 2,
        imageUrl: "https://i.imgur.com/uNBMvjA.jpg"
      },
      {
        artistId: 2,
        imageUrl: "https://i.imgur.com/CiVnUGn.jpg"
      },
      {
        artistId: 3,
        imageUrl: "https://i.imgur.com/FRGm2gD.jpg"
      },
      {
        artistId: 3,
        imageUrl: "https://i.imgur.com/IKhOVeh.jpg"
      },
      {
        artistId: 4,
        imageUrl: "https://i.imgur.com/yDfEVOl.jpg"
      },
      {
        artistId: 5,
        imageUrl: "https://i.imgur.com/GyXmjD7.jpg"
      },
      {
        artistId: 5,
        imageUrl: "https://i.imgur.com/j3AfqTZ.jpg"
      }
    ];
    
    await db.insert(portfolioItems).values(portfolioData);
    console.log("Portfolyo öğeleri başarıyla eklendi");
    
    // Mevcut ve gelecek bir hafta için zaman dilimleri ekle
    const today = new Date();
    
    for (let artistId = 1; artistId <= 5; artistId++) {
      for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        
        const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
        
        for (const startTime of timeSlots) {
          // Rastgele bazı slotları booked olarak işaretle
          const isBooked = Math.random() > 0.7;
          
          await db.insert(availableTimeSlots).values({
            artistId,
            date,
            startTime,
            isBooked
          });
        }
      }
    }
    console.log("Zaman dilimleri başarıyla eklendi");
    
    // Örnek kullanıcılar ekle
    const hashedPassword = await hashPassword("password123");
    
    const usersData = [
      {
        username: "user",
        password: hashedPassword,
        email: "user@example.com",
        fullName: "Normal Kullanıcı",
        phoneNumber: "+905551234567",
        location: "İstanbul",
        role: "user",
        lastLogin: new Date()
      },
      {
        username: "salon_owner",
        password: hashedPassword,
        email: "owner@example.com",
        fullName: "Salon Sahibi",
        phoneNumber: "+905559876543",
        location: "İstanbul",
        role: "salon_owner",
        salonId: 1,
        lastLogin: new Date()
      },
      {
        username: "admin",
        password: hashedPassword,
        email: "admin@example.com",
        fullName: "Admin Kullanıcı",
        phoneNumber: "+905553456789",
        location: "İstanbul",
        role: "admin",
        lastLogin: new Date()
      }
    ];
    
    await db.insert(users).values(usersData);
    console.log("Kullanıcılar başarıyla eklendi");
    
    console.log("Örnek veriler başarıyla yüklendi!");
  } catch (error) {
    console.error("Örnek veri yükleme hatası:", error);
  }
}