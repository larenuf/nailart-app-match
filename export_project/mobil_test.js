/**
 * Mobil Test URL'leri ve QR Kodları
 * 
 * Bu script, uygulamanızı mobil cihazlardan test etmek için
 * çeşitli URL'ler ve QR kodları oluşturur.
 */

import qrcodeTerminal from 'qrcode-terminal';
const qrcode = qrcodeTerminal;

// Tarayıcı önbelleğini atlamak için zaman damgası
const timestamp = Date.now();

// Temel Replit URL'si
const replitDomain = process.env.REPLIT_DOMAINS || "";
const baseUrl = `https://${replitDomain}`;

// Önbellek kırıcı URL
const cacheBustUrl = `${baseUrl}/?_t=${timestamp}`;

// LocalTunnel URL'leri (bu sabit URL'ler ve başlatmanız gerekir)
const localTunnelUrls = [
  "https://nailartapp-5939.loca.lt",
  "https://nailartmatch-5666.loca.lt"
];

console.log("\n=============================================================");
console.log("NAIL ART MATCH MOBİL TEST URL'LERİ");
console.log("=============================================================");

console.log("\nREPLIT URL'LERİ:");
console.log("-------------------------------------------------------------");
console.log(`1. ${baseUrl}`);
console.log(`2. ${cacheBustUrl} (önbellek kırıcı)`);

console.log("\nLOCALTUNNEL URL'LERİ:");
console.log("-------------------------------------------------------------");
localTunnelUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log("\n=============================================================");
console.log("MOBİL CİHAZLAR İÇİN QR KODLAR");
console.log("=============================================================");

console.log("\n📱 REPLIT URL İÇİN QR KOD:\n");
qrcode.generate(baseUrl, {small: true});

console.log("\n📱 ÖNBELLEK KIRICI REPLIT URL İÇİN QR KOD:\n");
qrcode.generate(cacheBustUrl, {small: true});

console.log("\n📱 LOCALTUNNEL URL İÇİN QR KOD:\n");
qrcode.generate(localTunnelUrls[0], {small: true});

console.log("\n=============================================================");
console.log("ÖNERİLER:");
console.log("=============================================================");
console.log("1. LocalTunnel URL'sini kullanırken hatırlatma sayfası görürseniz");
console.log("   doğrudan Replit URL'sini kullanın.");
console.log("2. Replit URL'leriyle içerik güncellenmiyorsa ?_t= parametreli URL'yi deneyin");
console.log("3. Telefonunuzla yukarıdaki QR kodlarını tarayıp doğrudan erişebilirsiniz");
console.log("=============================================================");