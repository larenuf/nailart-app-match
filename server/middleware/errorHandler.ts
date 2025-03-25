import { Request, Response, NextFunction } from 'express';

// API hatalarını işlemek için özel hata sınıfı
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Hata yakalama middleware'i
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Hata oluştu:', err);
  
  // API hatalarını işle
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  
  // Validasyon hatalarını işle (Zod veya başka kütüphaneler için)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validasyon hatası',
      errors: err,
    });
  }
  
  // Diğer tüm hatalar için
  return res.status(500).json({
    status: 'error',
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

// API isteklerini Zod şemalarıyla doğrulamak için yardımcı fonksiyon
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// 404 hatası için middleware
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: 'error',
    message: `${req.method} ${req.originalUrl} bulunamadı`
  });
}