// Replit'in gerçek URL'sini almak için özel bir script
import qrcode from 'qrcode-terminal';

// Replit ID'sini kullanarak dış URL oluşturma (bu muhtemelen çalışacaktır)
// Replit Domain bilgisini doğrudan kullanma
const replitDomain = process.env.REPLIT_DOMAINS || "";
const replId = process.env.REPL_ID || "";

// Alternatif URL'ler oluşturalım
const urls = [];

if (replitDomain) {
  // Eğer REPLIT_DOMAINS çevresel değişkeni mevcutsa kullan
  const domainUrl = `https://${replitDomain}`;
  urls.push(domainUrl);
}

// Replit ID tabanlı URL
if (replId) {
  const idUrl = `https://${replId}.id.repl.co`;
  urls.push(idUrl);
}

// Standart Replit URL formatı
const replSlug = process.env.REPL_SLUG || 'workspace';
const replOwner = process.env.REPL_OWNER || 'larenuf';
const standardUrl = `https://${replSlug}.${replOwner}.repl.co`;
urls.push(standardUrl);

// Bir başka format
const dashUrl = `https://${replSlug}-${replOwner}.repl.co`;
urls.push(dashUrl);

console.log("\nREPLIT_DOMAINS:", replitDomain);
console.log("REPL_ID:", replId);
console.log("PORT:", process.env.PORT || 5000);

console.log("\nLütfen aşağıdaki URL'lerden birini telefonunuzda deneyin:");
console.log("-----------------------------------------------------------\n");

// Her URL için QR kod oluştur
urls.forEach((url, index) => {
  console.log(`${index + 1}. URL: ${url}`);
  console.log("QR Kod:");
  qrcode.generate(url, { small: true });
  console.log("\n");
});