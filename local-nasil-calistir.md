# Local Olarak Nasıl Çalıştırılır?

Bu uygulamayı yerel bilgisayarınızda veya harici cihazlardan çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

## 1) Önbellek Sorunları İçin Güncel URL

En güncel değişiklikleri görmek için, tarayıcı önbelleğini atlayan URL'ler kullanmalısınız:

```
https://cc585201-25b3-46d4-ae88-91fabbe0d50a-00-2img5bddmditq.spock.replit.dev/?_t=1743234073886
```

Veya zaman damgasını manuel olarak güncelleyerek kendi önbellek kırıcı URL'nizi oluşturabilirsiniz:

```
https://cc585201-25b3-46d4-ae88-91fabbe0d50a-00-2img5bddmditq.spock.replit.dev/?_t=ZAMANDAMGASI
```

Burada `ZAMANDAMGASI` yerine şu anki zamanı temsil eden bir sayı koyun (örneğin: 1743234073886).

## 2) LocalTunnel ile Erişim (Replit üzerinden)

Localtunnel, uygulamanızı geçici bir URL üzerinden internet üzerinden erişilebilir yapar.

1. Terminalde localtunnel scripti çalıştırın:
   ```
   node localtunnel-baslat.js
   ```
   
   Veya bash script ile özel subdomain kullanarak çalıştırın:
   ```
   ./tunnel-calistir.sh
   ```

2. Çıktıda verilen URL'yi herhangi bir cihazdan açın:
   ```
   https://nailartapp-5939.loca.lt
   ```
   
   Bu URL her çalıştırmada değişecektir. Loglarda gösterilen güncel URL'yi kullanın.

3. Not: LocalTunnel bazen bir hatırlatma sayfası gösterebilir. Bu durumda doğrudan Replit URL'lerini kullanın.

## 3) QR Kodlar ile Mobil Test

Mobil cihazlardan test etmek için QR kodlar oluşturabilirsiniz:

```
node generate-qr.js
```

veya daha fazla seçenek için:

```
node mobil_test.js
```

Bu komutlar size telefonunuzla tarayabileceğiniz QR kodlar gösterecektir.

## 4) Yerel Bilgisayara Kurulum (Gelişmiş)

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

## 5) Yaygın Sorunlar ve Çözümleri

### Replit Webview'de değişiklikler gözükmüyor
- Replit'in webview'i bazen önbelleğe alınmış içeriği gösterebilir.
- Doğrudan tarayıcınızda URL'yi açın ve Ctrl+F5 ile yenileyin.
- ?_t= parametreli URL'leri kullanın.

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

### LocalTunnel Hatırlatma Sayfası
- LocalTunnel'da hatırlatma sayfası görürseniz, ModHeader gibi bir tarayıcı eklentisi kullanarak "bypass-tunnel-reminder" başlığı ekleyebilirsiniz.
- Veya doğrudan Replit URL'lerini kullanabilirsiniz.