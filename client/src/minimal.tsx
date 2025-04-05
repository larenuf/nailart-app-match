import React from "react";
import ReactDOM from "react-dom/client";

const MinimalApp: React.FC = () => {
  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      maxWidth: "800px", 
      margin: "0 auto", 
      padding: "2rem" 
    }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#e83e8c", marginBottom: "0.5rem" }}>Nail Art Match</h1>
        <p style={{ color: "#666" }}>Minimal Test Uygulaması</p>
      </header>
      
      <main>
        <div style={{ 
          background: "white", 
          borderRadius: "8px", 
          padding: "1.5rem", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "1.5rem"
        }}>
          <h2>Bu Sayfa Nedir?</h2>
          <p>
            Bu sayfa, Nail Art Match uygulamasının temel React bileşenlerinin çalışıp çalışmadığını 
            test etmek için oluşturulmuş minimal bir React uygulamasıdır.
          </p>
          <p>
            Bu sayfanın görüntülenmesi, React'in düzgün çalıştığını gösterir.
          </p>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "8px", 
          padding: "1.5rem", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "1.5rem"
        }}>
          <h2>Temel Bileşenler</h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3>Buton Bileşeni</h3>
            <button 
              onClick={() => alert("Buton tıklaması çalışıyor!")} 
              style={{
                background: "#e83e8c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
            >
              Beni Tıkla
            </button>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3>State Kullanımı</h3>
            <StateCounter />
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3>Effect Hook Örneği</h3>
            <TimeDisplay />
          </div>
        </div>
        
        <div style={{ 
          background: "white", 
          borderRadius: "8px", 
          padding: "1.5rem", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h2>Diagnostik Bilgiler</h2>
          <p><strong>React Versiyonu:</strong> {React.version}</p>
          <p><strong>Tarayıcı:</strong> {navigator.userAgent}</p>
          <p><strong>Yükleme Zamanı:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
      </main>
      
      <footer style={{ marginTop: "2rem", textAlign: "center", color: "#666" }}>
        <p>© 2023 Nail Art Match. Minimal Test Sayfası.</p>
      </footer>
    </div>
  );
};

// State kullanımı örneği
const StateCounter: React.FC = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>Sayaç: {count}</span>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          background: "#7b2cbf",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "0.3rem 0.8rem",
          cursor: "pointer"
        }}
      >
        Artır
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "0.3rem 0.8rem",
          cursor: "pointer"
        }}
      >
        Sıfırla
      </button>
    </div>
  );
};

// Effect hook örneği
const TimeDisplay: React.FC = () => {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div>
      <p>Güncel Saat: {time.toLocaleTimeString()}</p>
    </div>
  );
};

// Sayfayı render et
ReactDOM.createRoot(document.getElementById("minimal-root") as HTMLElement).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);

export default MinimalApp;