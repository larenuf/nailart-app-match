/**
 * Yerel Geliştirme Kurulum Rehberi
 * 
 * Bu script, projeyi yerel ortamınızda çalıştırmak için rehberlik sağlar.
 */

console.log(`
=============================================================
NAIL ART MATCH UYGULAMASI - YEREL KURULUM REHBERI
=============================================================

Aşağıdaki adımları takip ederek uygulamayı kendi bilgisayarınızda çalıştırabilirsiniz:

1) Adım: Projeyi yerel bilgisayarınıza indirin
   git clone https://github.com/KULLANICI_ADI/nail-art-match.git
   veya Replit'ten tüm proje dosyalarını zip olarak indirin

2) Adım: Gerekli bağımlılıkları yükleyin
   npm install

3) Adım: Çevresel değişkenleri ayarlayın
   .env dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:
   
   DATABASE_URL=postgresql://kullanici:parola@localhost:5432/nailartmatch
   PORT=5000
   GOOGLE_MAPS_API_KEY=sizin_api_keyiniz
   OPENAI_API_KEY=sizin_api_keyiniz
   CLOUDINARY_CLOUD_NAME=sizin_cloud_name
   CLOUDINARY_API_KEY=sizin_api_key
   CLOUDINARY_API_SECRET=sizin_api_secret

4) Adım: Veritabanını hazırlayın
   npm run db:push

5) Adım: Uygulamayı başlatın
   npm run dev

Uygulama şu adreste çalışacaktır: http://localhost:5000

NOT: Eğer yukarıdaki adımları takip ederken sorun yaşarsanız, 
bu dosyayı çalıştırın ve daha detaylı bilgi alın:

node yerel-kurulum.js --detailed

=============================================================
`);

// Eğer --detailed parametresi varsa daha fazla bilgi göster
if (process.argv.includes('--detailed')) {
  console.log(`
DETAYLI KURULUM BİLGİLERİ
=============================================================

1. Node.js Kurulumu:
   - En az Node.js 18+ sürümü gereklidir
   - https://nodejs.org adresinden indirebilirsiniz

2. PostgreSQL Kurulumu:
   - PostgreSQL 14+ sürümü önerilir
   - Yerel kurulum: https://www.postgresql.org/download/
   - Alternatif: Docker ile kurulum:
     docker run --name nailartmatch-postgres -e POSTGRES_PASSWORD=parola -e POSTGRES_USER=kullanici -e POSTGRES_DB=nailartmatch -p 5432:5432 -d postgres:14

3. Cloudinary Kurulumu:
   - https://cloudinary.com adresinden ücretsiz hesap açın
   - Dashboard'dan API bilgilerinizi alın

4. Google Maps API Kurulumu:
   - https://console.cloud.google.com adresinden bir proje oluşturun
   - Maps JavaScript API ve Geocoding API'yi etkinleştirin
   - API anahtarı oluşturun

5. OpenAI API Kurulumu:
   - https://platform.openai.com adresinden bir hesap açın
   - API anahtarı oluşturun

6. Veritabanı Şeması Hakkında:
   - Şema dosyaları shared/schema.ts içinde bulunur
   - Drizzle ORM kullanılır
   - Şema değişikliklerinde npm run db:push komutunu çalıştırın

7. Uygulama Mimarisi:
   - Frontend: React + TypeScript + Tailwind CSS
   - Backend: Express.js
   - Veritabanı: PostgreSQL + Drizzle ORM
   - API: RESTful API
   - Auth: Express-session + Passport.js

8. Yaygın Sorunlar ve Çözümleri:
   - Port 5000 kullanımda: .env dosyasında PORT değerini değiştirin
   - Veritabanı bağlantı hatası: PostgreSQL servisinin çalıştığından emin olun
   - Cloudinary hatası: API bilgilerini kontrol edin
   - Google Maps API hatası: API anahtarının doğruluğunu ve kısıtlamalarını kontrol edin

9. Kodlama Standartları:
   - ESLint + Prettier yapılandırması mevcuttur
   - npm run lint komutuyla kod kalitesini kontrol edebilirsiniz
   - Commit öncesi npm run format komutunu çalıştırın

10. Deployment Önerileri:
    - Vercel: Frontend için ideal
    - Railway: Backend ve veritabanı için uygun
    - Heroku: Tam stack deployment için

=============================================================
`);
}

console.log(`
Ayrıca, uygulamayı yerel olarak geliştirmek yerine Replit üzerinde geliştirmeye 
devam edip, aşağıdaki URL üzerinden erişebilirsiniz:

https://cc585201-25b3-46d4-ae88-91fabbe0d50a-00-2img5bddmditq.spock.replit.dev/?_t=${Date.now()}

Bu yaklaşım, kurulum zorluklarından kaçınmanızı sağlar ve 
herhangi bir tarayıcıdan projeye erişebilirsiniz.
=============================================================
`);