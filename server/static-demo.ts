/**
 * Statik Demo Sayfası Oluşturucu
 * 
 * Bu script, Express sunucusu içinde basit bir statik demo sayfası oluşturur.
 */

export function createStaticDemoPage(): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nail Art Match - Demo</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    h1 {
      color: #e83e8c;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }
    
    .card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    
    .card-header {
      background-color: #f5f5f5;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .card-title {
      margin: 0;
      color: #7b2cbf;
      font-size: 1.25rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .button {
      display: inline-block;
      background-color: #e83e8c;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 0.35rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .button:hover {
      background-color: #d03077;
    }
    
    .button.secondary {
      background-color: #7b2cbf;
    }
    
    .button.secondary:hover {
      background-color: #6a24a5;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .animation-demo {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    
    .animation-box {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #e83e8c, #7b2cbf);
      border-radius: 10px;
    }
    
    .animation-bounce {
      animation: bounce 1s infinite alternate;
    }
    
    .animation-fade {
      animation: fade 2s infinite alternate;
    }
    
    .animation-rotate {
      animation: rotate 3s linear infinite;
    }
    
    .animation-pulse {
      animation: pulse 2s infinite;
    }
    
    .masonry-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 30px;
      grid-gap: 10px;
    }
    
    .masonry-item {
      background-color: #e83e8c;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    @keyframes bounce {
      0% { transform: translateY(0); }
      100% { transform: translateY(-30px); }
    }
    
    @keyframes fade {
      0% { opacity: 0.4; }
      100% { opacity: 1; }
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0% { transform: scale(0.8); }
      50% { transform: scale(1.1); }
      100% { transform: scale(0.8); }
    }
    
    .information {
      background-color: #f0f7ff;
      border: 1px solid #cce0ff;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    
    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
      
      .button-group {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Nail Art Match</h1>
      <div class="subtitle">
        UI Bileşenleri ve Animasyon Demo Sayfası
      </div>
    </header>
    
    <div class="information">
      <p>Bu sayfa, Nail Art Match uygulamasında kullanılan animasyon ve UI bileşenlerinin basit bir demo sayfasıdır.</p>
      <p>Sunucu tarafından doğrudan oluşturulur ve WebSocket bağlantısı gerektirmez.</p>
    </div>
    
    <div class="demo-grid">
      <!-- Fade Animation -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Fade Animasyonu</h3>
        </div>
        <div class="card-body">
          <div class="animation-demo">
            <div class="animation-box animation-fade"></div>
          </div>
        </div>
      </div>
      
      <!-- Bounce Animation -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Bounce Animasyonu</h3>
        </div>
        <div class="card-body">
          <div class="animation-demo">
            <div class="animation-box animation-bounce"></div>
          </div>
        </div>
      </div>
      
      <!-- Rotate Animation -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Rotate Animasyonu</h3>
        </div>
        <div class="card-body">
          <div class="animation-demo">
            <div class="animation-box animation-rotate"></div>
          </div>
        </div>
      </div>
      
      <!-- Pulse Animation -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Pulse Animasyonu</h3>
        </div>
        <div class="card-body">
          <div class="animation-demo">
            <div class="animation-box animation-pulse"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Masonry Grid</h3>
      </div>
      <div class="card-body">
        <div class="masonry-grid">
          <div class="masonry-item" style="grid-row-end: span 2;">1</div>
          <div class="masonry-item" style="grid-row-end: span 3;">2</div>
          <div class="masonry-item" style="grid-row-end: span 4;">3</div>
          <div class="masonry-item" style="grid-row-end: span 3;">4</div>
          <div class="masonry-item" style="grid-row-end: span 2;">5</div>
          <div class="masonry-item" style="grid-row-end: span 4;">6</div>
          <div class="masonry-item" style="grid-row-end: span 2;">7</div>
          <div class="masonry-item" style="grid-row-end: span 3;">8</div>
          <div class="masonry-item" style="grid-row-end: span 2;">9</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Diğer Statik Sayfalar</h3>
      </div>
      <div class="card-body">
        <div class="button-group">
          <a href="/test.html" class="button">Animasyon Test Sayfası</a>
          <a href="/component-test.html" class="button secondary">UI Bileşenleri Test Sayfası</a>
        </div>
      </div>
    </div>
    
    <footer>
      <p>&copy; 2023 Nail Art Match. Tüm hakları saklıdır.</p>
    </footer>
  </div>
</body>
</html>
  `;
}