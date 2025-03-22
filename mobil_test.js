// Mobil test için doğru URL'yi ve QR kodu almak için özel bir script
import qrcode from 'qrcode-terminal';

// Replit uygulamasının doğru dış URL'sini hesaplama
console.log(`\nWeb uygulaması şu anda port 5000'de çalışıyor`);
console.log(`Lokalde şu URL'den erişilebilir: http://localhost:5000`);

// Replit'in dışarıya açtığı URL'yi hesaplıyoruz
// .replit dosyasındaki externalPort konfigürasyonu 80 portu belirtmiştir
const replId = process.env.REPL_ID || '';
const replSlug = process.env.REPL_SLUG || 'workspace';
const replOwner = process.env.REPL_OWNER || 'larenuf';

// Mobil cihazla test etmek için kullanılabilecek URL'ler
console.log(`\nLütfen bu URL'lerden birini telefonunuzda deneyin:\n`);

const urls = [
  `https://${replSlug}.${replOwner}.repl.co`,
  `https://${replId}.id.repl.co`,
  `https://${replSlug}-${replOwner}.repl.co`,
];

// Tüm muhtemel URL'leri göster ve QR kodları oluştur
urls.forEach((url, index) => {
  console.log(`URL ${index + 1}: ${url}`);
  console.log('QR Kod:');
  qrcode.generate(url, { small: true });
  console.log('\n');
});