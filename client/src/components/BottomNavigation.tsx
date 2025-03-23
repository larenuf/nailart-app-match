import { useLocation, Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg px-2 py-2 border-t border-gray-200 dark:border-gray-700 z-10 transition-colors duration-200">
      <div className="flex justify-between max-w-md mx-auto">
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/">
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1 block">Ana Sayfa</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/search' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/search">
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1 block">Keşfet</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location.startsWith('/booking') ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/bookings">
            <i className="far fa-calendar-check text-lg"></i>
            <span className="text-xs mt-1 block">Randevular</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/wallet' ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/wallet">
            <i className="fas fa-wallet text-lg"></i>
            <span className="text-xs mt-1 block">Cüzdan</span>
          </Link>
        </div>
        <div className={`flex flex-col items-center px-3 py-1 ${location === '/profile' || location.startsWith('/admin') ? 'text-[#D6C3E5] dark:text-[#D3B5E8]' : 'text-gray-500 dark:text-gray-400'}`}>
          <Link href="/profile">
            <i className="far fa-user text-lg"></i>
            <span className="text-xs mt-1 block">Profil</span>
          </Link>
        </div>
      </div>
      
      {/* Yönetim Paneli Kısayolu */}
      <div className="max-w-md mx-auto mt-1 text-center">
        <Link href="/admin">
          <span className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#D6C3E5] dark:hover:text-[#D3B5E8]">
            Yönetim Paneli
          </span>
        </Link>
      </div>
    </div>
  );
}
