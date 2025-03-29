/**
 * LocalTunnel Özel Subdomain İle Başlatma
 */

const localtunnel = require('localtunnel');
const qrcode = require('qrcode-terminal');

const PORT = process.env.PORT || 5000;
const subdomain = `nailartmatch-${Math.floor(Math.random() * 10000)}`;

console.log(`\n🚀 LocalTunnel başlatılıyor (Port: ${PORT}, Subdomain: ${subdomain})...`);
console.log("Bu işlem bir kaç saniye sürebilir...");

(async () => {
  try {
    const tunnel = await localtunnel({ 
      port: PORT,
      subdomain: subdomain
    });
    
    console.log('\n✅ BAŞARILI! Uygulamanız artık aşağıdaki adresten erişilebilir:');
    console.log('==========================================');
    console.log(`🔗 ${tunnel.url}`);
    console.log('==========================================\n');
    
    console.log('Bu URL\'yi herhangi bir cihazdan açabilirsiniz.');
    console.log('Telefonunuzdan, tabletinizden veya başka bir bilgisayardan test edebilirsiniz.\n');
    
    // QR kod oluştur
    console.log('📱 TELEFON İÇİN QR KOD:');
    qrcode.generate(tunnel.url, {small: true});
    
    console.log('\n🔄 Bağlantı aktif, sunucu çalışıyor...');
    console.log('Durdurmak için Ctrl+C tuşlarına basın.\n');
    
    tunnel.on('close', () => {
      console.log('\n❌ Tunnel kapatıldı');
      process.exit(1);
    });
    
    tunnel.on('error', (err) => {
      console.error('\n⚠️ Tunnel hatası:', err);
    });
    
    // URL değişikliklerini dinle
    tunnel.on('url', (newUrl) => {
      console.log(`\n⚠️ URL değişti. Yeni URL: ${newUrl}`);
    });
    
  } catch (error) {
    console.error('\n❌ LocalTunnel başlatılırken hata oluştu:', error.message);
    process.exit(1);
  }
})();