/**
 * Local Tunnel Hızlı Başlatma
 * Bu script, localtunnel kullanarak uygulamanızı Internet üzerinden erişilebilir yapar.
 */

import localtunnel from 'localtunnel';
const port = 5000; // Uygulama portunu buradan değiştirebilirsiniz

console.log(`\n🚀 LocalTunnel başlatılıyor (Port: ${port})...`);
console.log('Bu işlem bir kaç saniye sürebilir...\n');

(async () => {
  try {
    const tunnel = await localtunnel({ port });

    console.log('\n✅ BAŞARILI! Uygulamanız artık aşağıdaki adresten erişilebilir:');
    console.log('==========================================');
    console.log(`🔗 ${tunnel.url}`);
    console.log('==========================================');
    console.log('\nBu URL\'yi herhangi bir cihazdan açabilirsiniz.');
    console.log('Telefonunuzdan, tabletinizden veya başka bir bilgisayardan test edebilirsiniz.');
    console.log('\n🔄 Bağlantı aktif, sunucu çalışıyor...');
    console.log('Durdurmak için Ctrl+C tuşlarına basın.\n');

    tunnel.on('close', () => {
      console.log('LocalTunnel bağlantısı kapatıldı.');
    });

    // URL değişirse yeni URL'yi göster
    tunnel.on('url', (url) => {
      console.log(`\n⚠️ URL değişti. Yeni URL: ${url}`);
    });

    // Hata olursa göster
    tunnel.on('error', (err) => {
      console.error('LocalTunnel hatası:', err);
    });
  } catch (error) {
    console.error('Bağlantı hatası:', error.message);
    console.log('\nÖneriler:');
    console.log('1. Uygulamanızın çalıştığından emin olun (npm run dev)');
    console.log('2. Belirtilen port numarasının doğru olduğunu kontrol edin');
    console.log('3. Internet bağlantınızı kontrol edin');
  }
})();