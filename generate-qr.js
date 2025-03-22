import qrcode from 'qrcode-terminal';
import { execSync } from 'child_process';

// Replit'in gerçek URL'sini almak için komut çalıştırma
let url;
try {
  // Replit metadatasından URL'yi alma girişimi
  const result = execSync('curl -s $REPLIT_DB_URL/urls/public').toString().trim();
  if (result && result.startsWith('http')) {
    url = result;
  } else {
    // Fallback: Replit değişkenlerinden URL oluşturma
    url = process.env.REPL_SLUG && process.env.REPL_OWNER
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : 'https://replit.com/@larenuf/workspace';
  }
} catch (error) {
  // Hata durumunda standart URL'ye dönüş
  url = 'https://replit.com/@larenuf/workspace';
}

console.log(`\nUygulama URL'i: ${url}\n`);
console.log('Aşağıdaki QR kodu telefonunuzla tarayın:\n');

// URL için QR kod oluşturma
qrcode.generate(url, { small: true });