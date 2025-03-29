# Local Olarak Nasıl Çalıştırılır?

Bu uygulamayı yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

## 1) Replit'ten Erişim (Basit Yöntem)

En kolay yolu, uygulamayı Replit üzerinde çalıştırmak ve aşağıdaki URL'ler üzerinden erişmektir:

```
https://cc585201-25b3-46d4-ae88-91fabbe0d50a-00-2img5bddmditq.spock.replit.dev/?_t=1743232244404
```

## 2) LocalTunnel ile Erişim (Replit üzerinden)

Localtunnel, uygulamanızı geçici bir URL üzerinden internet üzerinden erişilebilir yapar.

1. Terminalde localtunnel scripti çalıştırın:
   ```
   node localtunnel-baslat.js
   ```
   
   Veya bash script ile çalıştırın:
   ```
   ./tunnel-calistir.sh
   ```

2. Çıktıda verilen URL'yi herhangi bir cihazdan açın:
   ```
   https://rotten-tables-drum.loca.lt
   ```
   
   Bu URL her çalıştırmada değişecektir. Loglarda gösterilen güncel URL'yi kullanın.

## 3) Yerel Bilgisayara Kurulum (Gelişmiş)

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+

### Adımlar

1. Tüm proje dosyalarını bilgisayarınıza indirin:
   - Replit'in sağ üst köşesindeki `⋮` menüsünden "Download as zip" seçeneğini kullanabilirsiniz

2. İndirilen ZIP dosyasını açın ve bir dizine çıkarın

3. Komut satırında (Terminal/CMD) proje dizinine gidin:
   ```
   cd /indirdiğiniz/dizin/yolu
   ```

4. Gerekli bağımlılıkları yükleyin:
   ```
   npm install
   ```

5. `.env` dosyası oluşturun:
   ```
   DATABASE_URL=postgresql://kullanici:parola@localhost:5432/nailartmatch
   PORT=5000
   GOOGLE_MAPS_API_KEY=sizin_api_keyiniz
   OPENAI_API_KEY=sizin_api_keyiniz
   CLOUDINARY_CLOUD_NAME=sizin_cloud_name
   CLOUDINARY_API_KEY=sizin_api_key
   CLOUDINARY_API_SECRET=sizin_api_secret
   ```

6. Veritabanı oluşturun ve şemayı uygulayın:
   ```
   npx drizzle-kit push:pg
   ```

7. Uygulamayı çalıştırın:
   ```
   npm run dev
   ```

8. Tarayıcınızda şu adrese gidin:
   ```
   http://localhost:5000
   ```

## 4) Yaygın Sorunlar ve Çözümleri

### Port 5000 kullanımda hatası
macOS Monterey ve sonrasında, AirPlay servisi port 5000'i kullanabilir. `.env` dosyasında PORT değerini 3000 gibi farklı bir değere değiştirin.

### Veritabanı bağlantı hatası
PostgreSQL servisinin çalıştığından ve doğru bağlantı bilgilerini kullandığınızdan emin olun.

### CORS hataları
Yerel geliştirme ortamında CORS hataları alırsanız, server/index.ts dosyasında CORS ayarlarını güncelleyin:

```typescript
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
```

### LocalTunnel Kullanım İpuçları

- URL değişebilir, bu nedenle loglara dikkat edin
- Sabit bir subdomain kullanmak için: `lt --port 5000 --subdomain sizinseciminiz`
- Tunnel'ı durdurmak için: Ctrl+C