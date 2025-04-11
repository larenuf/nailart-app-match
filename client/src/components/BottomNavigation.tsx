import { useLocation, Link } from "wouter";
import { useI18n } from "@/i18n";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t, locale } = useI18n();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg px-2 py-2 border-t border-gray-200 dark:border-gray-700 z-10 transition-colors duration-200">
      <div className="flex justify-between max-w-md mx-auto">
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1 block">{t('common.home')}</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/salons' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/salons">
            <i className="fas fa-store text-lg"></i>
            <span className="text-xs mt-1 block">{locale === 'en' ? 'Salons' : locale === 'ar' ? 'صالونات' : 'Salonlar'}</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location.startsWith('/booking') ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/bookings">
            <i className="far fa-calendar-check text-lg"></i>
            <span className="text-xs mt-1 block">{locale === 'en' ? 'Bookings' : locale === 'ar' ? 'الحجوزات' : 'Randevular'}</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/wallet' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/wallet">
            <i className="fas fa-wallet text-lg"></i>
            <span className="text-xs mt-1 block">{locale === 'en' ? 'Wallet' : locale === 'ar' ? 'المحفظة' : 'Cüzdan'}</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/profile' || location.startsWith('/admin') ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/profile">
            <i className="far fa-user text-lg"></i>
            <span className="text-xs mt-1 block">{t('common.profile')}</span>
          </Link>
        </div>
      </div>
      
      {/* Admin Panel Shortcut */}
      <div className="max-w-md mx-auto mt-1 text-center">
        <Link href="/admin">
          <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#D6C3E5] dark:hover:text-[#D3B5E8]">
            {locale === 'en' ? 'Admin Panel' : locale === 'ar' ? 'لوحة الإدارة' : 'Yönetim Paneli'}
          </span>
        </Link>
      </div>
    </div>
  );
}
