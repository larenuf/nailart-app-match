import { useAppContext } from "@/context/AppContext";

export default function TopNavigation() {
  const { userLocation } = useAppContext();

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold font-playfair text-dark-text">NAM</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm">
          <i className="fas fa-map-marker-alt text-[#F9E0E7] mr-1"></i>
          <span>{userLocation}</span>
        </div>
        <div className="relative">
          <i className="fas fa-bell text-[#333333]"></i>
          <span className="absolute -top-1 -right-1 bg-[#F9E0E7] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>
      </div>
    </div>
  );
}
