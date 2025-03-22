import { useLocation, Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-2 py-2 border-t border-gray-200 z-10">
      <div className="flex justify-between max-w-md mx-auto">
        <Link href="/">
          <a className={`flex flex-col items-center px-3 py-1 ${location === '/' ? 'text-[#D6C3E5]' : 'text-gray-500'}`}>
            <i className="fas fa-home text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center px-3 py-1 ${location === '/search' ? 'text-[#D6C3E5]' : 'text-gray-500'}`}>
            <i className="fas fa-search text-lg"></i>
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/bookings">
          <a className={`flex flex-col items-center px-3 py-1 ${location === '/bookings' ? 'text-[#D6C3E5]' : 'text-gray-500'}`}>
            <i className="far fa-calendar-check text-lg"></i>
            <span className="text-xs mt-1">Bookings</span>
          </a>
        </Link>
        <Link href="/wallet">
          <a className={`flex flex-col items-center px-3 py-1 ${location === '/wallet' ? 'text-[#D6C3E5]' : 'text-gray-500'}`}>
            <i className="fas fa-wallet text-lg"></i>
            <span className="text-xs mt-1">Wallet</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center px-3 py-1 ${location === '/profile' ? 'text-[#D6C3E5]' : 'text-gray-500'}`}>
            <i className="far fa-user text-lg"></i>
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
