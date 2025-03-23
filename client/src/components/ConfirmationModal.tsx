import { useAppContext } from "@/context/AppContext";

export default function ConfirmationModal() {
  const { bookingDetails, showConfirmation, setShowConfirmation, resetSelection } = useAppContext();

  if (!showConfirmation || !bookingDetails) return null;

  const handleAddToCalendar = () => {
    // This would integrate with the device's calendar in a real app
    // For now, we'll just close the modal
    console.log('Adding to calendar...');
    setShowConfirmation(false);
    resetSelection();
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetSelection();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-5/6 max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#D6C3E5]/20 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-2xl text-[#D6C3E5]"></i>
          </div>
        </div>

        <h3 className="text-center font-bold text-lg mb-2">Rezervasyon Onaylandı!</h3>
        <p className="text-center text-gray-600 mb-4">
          Randevunuz başarıyla oluşturuldu
        </p>

        <div className="bg-[#F5F1EB] bg-opacity-30 p-3 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-600">Tarih:</p>
            <p className="text-sm font-medium">{bookingDetails.date}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-600">Saat:</p>
            <p className="text-sm font-medium">{bookingDetails.time}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-600">Hizmet:</p>
            <p className="text-sm font-medium">{bookingDetails.service.name}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Sanatçı:</p>
            <p className="text-sm font-medium">{bookingDetails.artist.name}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            className="flex-1 bg-white border border-[#D6C3E5] text-[#D6C3E5] py-2 rounded-lg"
            onClick={handleAddToCalendar}
          >
            Takvime Ekle
          </button>
          <button
            className="flex-1 bg-[#D6C3E5] text-white py-2 rounded-lg"
            onClick={handleCloseConfirmation}
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
