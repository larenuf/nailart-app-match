import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Appwrite config - Bu değerler .env dosyasından alınacak
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id';
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'your-database-id';

// Koleksiyon ID'leri
export const SALONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SALONS_COLLECTION_ID || 'salons';
export const APPOINTMENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_APPOINTMENTS_COLLECTION_ID || 'appointments';
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';
export const FAVORITES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FAVORITES_COLLECTION_ID || 'favorites';
export const PROMOTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROMOTIONS_COLLECTION_ID || 'promotions';

// Appwrite client oluştur
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Appwrite servisleri
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Salon İşlemleri
export async function getSalons(queries: string[] = []) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error('Salonlar alınırken hata oluştu:', error);
    return [];
  }
}

export async function getFeaturedSalons() {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      [
        // Premium ve öne çıkan salonları getir
        'isPremium=true'
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Öne çıkan salonlar alınırken hata oluştu:', error);
    return [];
  }
}

export async function getSalon(salonId: string) {
  try {
    const response = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      salonId
    );
    return response;
  } catch (error) {
    console.error('Salon detayları alınırken hata oluştu:', error);
    throw error;
  }
}

export async function createSalon(salonData: any) {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      ID.unique(),
      salonData
    );
    return response;
  } catch (error) {
    console.error('Salon oluşturulurken hata oluştu:', error);
    throw error;
  }
}

export async function updateSalon(salonId: string, salonData: any) {
  try {
    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      salonId,
      salonData
    );
    return response;
  } catch (error) {
    console.error('Salon güncellenirken hata oluştu:', error);
    throw error;
  }
}

export async function deleteSalon(salonId: string) {
  try {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      SALONS_COLLECTION_ID,
      salonId
    );
    return { success: true };
  } catch (error) {
    console.error('Salon silinirken hata oluştu:', error);
    throw error;
  }
}

// Resim Yükleme İşlemleri
export async function uploadImage(file: File) {
  try {
    const response = await storage.createFile(
      'images', // storage bucket ID
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Resim yüklenirken hata oluştu:', error);
    throw error;
  }
}

export function getImageUrl(fileId: string) {
  try {
    return storage.getFilePreview('images', fileId);
  } catch (error) {
    console.error('Resim URL\'si alınırken hata oluştu:', error);
    throw error;
  }
}

// Randevu İşlemleri
export async function createAppointment(appointmentData: any) {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPOINTMENTS_COLLECTION_ID,
      ID.unique(),
      appointmentData
    );
    return response;
  } catch (error) {
    console.error('Randevu oluşturulurken hata oluştu:', error);
    throw error;
  }
}

export async function getUserAppointments(userId: string) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPOINTMENTS_COLLECTION_ID,
      [`userId=${userId}`]
    );
    return response.documents;
  } catch (error) {
    console.error('Kullanıcı randevuları alınırken hata oluştu:', error);
    return [];
  }
}

export async function getSalonAppointments(salonId: string) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPOINTMENTS_COLLECTION_ID,
      [`salonId=${salonId}`]
    );
    return response.documents;
  } catch (error) {
    console.error('Salon randevuları alınırken hata oluştu:', error);
    return [];
  }
}

// Promosyon İşlemleri
export async function createPromotion(promotionData: any) {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      PROMOTIONS_COLLECTION_ID,
      ID.unique(),
      promotionData
    );
    return response;
  } catch (error) {
    console.error('Promosyon oluşturulurken hata oluştu:', error);
    throw error;
  }
}

export async function getActivePromotions() {
  try {
    const now = new Date().toISOString();
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      PROMOTIONS_COLLECTION_ID,
      [
        `startDate<=${now}`,
        `endDate>=${now}`,
        'isActive=true'
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Aktif promosyonlar alınırken hata oluştu:', error);
    return [];
  }
}

// Favoriler İşlemleri
export async function addToFavorites(userId: string, salonId: string) {
  try {
    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        salonId,
        createdAt: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Favorilere eklenirken hata oluştu:', error);
    throw error;
  }
}

export async function removeFromFavorites(favoriteId: string) {
  try {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      favoriteId
    );
    return { success: true };
  } catch (error) {
    console.error('Favorilerden çıkarılırken hata oluştu:', error);
    throw error;
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [`userId=${userId}`]
    );
    return response.documents;
  } catch (error) {
    console.error('Kullanıcı favorileri alınırken hata oluştu:', error);
    return [];
  }
}

export async function getSalonLikesCount(salonId: string) {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [`salonId=${salonId}`]
    );
    return response.documents.length;
  } catch (error) {
    console.error('Salon beğeni sayısı alınırken hata oluştu:', error);
    return 0;
  }
}