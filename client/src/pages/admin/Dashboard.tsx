// Tamamen basitleştirilmiş dashboard - minimum import

export default function Dashboard() {
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Salon Yönetim Paneli</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Salon bilgilerinizi, çalışanlarınızı ve hizmetlerinizi yönetin
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Genel Bakış</h2>
          <p>Bugün 0 randevu var</p>
        </div>
        
        <div className="border p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Salon Bilgileri</h2>
          <p>Salon adı: NAM Nail Studio</p>
        </div>
        
        <div className="border p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Artistler</h2>
          <p>Toplam 5 artist</p>
        </div>
        
        <div className="border p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Hizmetler</h2>
          <p>Toplam 12 hizmet</p>
        </div>
      </div>
    </div>
  );
}