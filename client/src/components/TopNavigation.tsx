import { useAppContext } from "@/context/AppContext";

export default function TopNavigation() {
  const { userLocation } = useAppContext();

  return (
    <div className="px-4 py-4 bg-[#FAFAFA]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#FF5864]">NailMatch</h1>
        <div className="flex space-x-3">
          <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-[#333333]">
            <i className="fas fa-search"></i>
          </button>
          <div className="relative w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
            <i className="fas fa-bell text-[#333333]"></i>
            <span className="absolute -top-1 -right-1 bg-[#FF5864] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-sm mt-3 bg-white p-2.5 rounded-lg shadow-sm">
        <i className="fas fa-map-marker-alt text-[#FF5864] mr-2"></i>
        <span className="font-medium">{userLocation}</span>
        <i className="fas fa-chevron-down text-xs ml-1 text-gray-400"></i>
      </div>
    </div>
  );
}
