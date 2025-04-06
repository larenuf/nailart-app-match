import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

// WebSocket bağlantılarını devre dışı bırak
// Bu kod HMR WebSocket bağlantıları için alternatif yaklaşımı uygular
if (import.meta.hot) {
  // Açıkça accept etme - bu HMR'nin WebSocket kullanmasını azaltır
  // Decline yerine accept etmiyoruz
}

// Uygulama hazır olduğunda render et
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <App />
  );
} else {
  console.error("Root element bulunamadı!");
}
