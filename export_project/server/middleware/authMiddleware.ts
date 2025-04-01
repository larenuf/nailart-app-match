import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';

// İstek yapan kullanıcının oturum açmış olmasını kontrol eden middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next(new ApiError(401, 'Bu işlemi yapmak için giriş yapmalısınız'));
  }
  next();
}

// Admin yetkisi kontrol eden middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next(new ApiError(401, 'Bu işlemi yapmak için giriş yapmalısınız'));
  }
  
  // Kullanıcı rolünü kontrol et (user nesnesinde role alanı olduğunu varsayıyoruz)
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Bu işlemi yapmak için yetkiniz yok'));
  }
  
  next();
}

// CSRF koruması için middleware (örnek)
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Burada gerçek bir CSRF token doğrulaması yapılmalıdır
  // Şu an için basit bir Origin kontrolü yapıyoruz
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  if (req.method !== 'GET' && (!origin || !referer)) {
    return next(new ApiError(403, 'CSRF koruması: Geçersiz istek kaynağı'));
  }
  
  next();
}