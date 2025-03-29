import { Link } from "wouter";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";

export default function NailProductsSection() {
  const { t, locale } = useI18n();
  
  return (
    <div className="px-4 py-4">
      {/* Tırnak Ürünleri Satış Alanı */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium tracking-tight text-gray-700 dark:text-gray-300 flex items-center">
            <ShoppingCart size={14} className="text-purple-500 mr-1"/>
            {locale === 'tr' ? 'Tırnak Ürünleri' : locale === 'en' ? 'Nail Products' : 'منتجات الأظافر'}
          </h2>
          <Link href="/shop" className="text-xs font-medium text-primary dark:text-pink-400 flex items-center cursor-pointer">
            {locale === 'tr' ? 'Mağazaya Git' : locale === 'en' ? 'Go to Shop' : 'الذهاب إلى المتجر'} <ArrowRight size={10} className="ml-0.5"/>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Tırnak Bakım Ürünleri */}
          <Link href="/product-category/nail-care" className="cursor-pointer group">
              <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-200 opacity-90">
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
                      <span className="text-3xl">💅</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-2.5 text-white">
                  <h3 className="text-sm font-bold">💅 {locale === 'tr' ? 'Tırnak Bakım Ürün' : locale === 'en' ? 'Nail Care Product' : 'منتج العناية بالأظافر'}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs mr-2 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {locale === 'tr' ? 'Özel Fiyatlar' : locale === 'en' ? 'Special Prices' : 'أسعار خاصة'}
                    </span>
                    <span className="text-xs bg-primary/80 px-2 py-0.5 rounded-full">
                      {locale === 'tr' ? '%15 İndirim' : locale === 'en' ? '15% Discount' : 'خصم ١٥٪'}
                    </span>
                  </div>
                </div>
              </div>
          </Link>
          
          {/* Nail Art Kitleri */}
          <Link href="/product-category/nail-art-kits" className="cursor-pointer group">
              <div className="relative overflow-hidden rounded-lg aspect-[1/1] shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-200 opacity-90">
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-2.5 text-white">
                  <h3 className="text-sm font-bold">✨ {locale === 'tr' ? 'Nail Art Kitleri' : locale === 'en' ? 'Nail Art Kits' : 'مجموعات فن الأظافر'}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs mr-2 bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {locale === 'tr' ? 'Yeni Ürünler' : locale === 'en' ? 'New Products' : 'منتجات جديدة'}
                    </span>
                    <span className="text-xs bg-primary/80 px-2 py-0.5 rounded-full">
                      {locale === 'tr' ? '%20 İndirim' : locale === 'en' ? '20% Discount' : 'خصم ٢٠٪'}
                    </span>
                  </div>
                </div>
              </div>
          </Link>
        </div>
      </div>
    </div>
  );
}