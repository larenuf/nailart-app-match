/**
 * QR Kod Oluşturucu
 * 
 * Bu script, Replit URL'niz için QR kod oluşturur.
 * Mobil cihazlardan kolayca test edebilmek için kullanabilirsiniz.
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

console.log("\n=============================================================");
console.log("MOBIL TEST IÇIN QR KODLAR");
console.log("=============================================================");

console.log("\n📱 STANDART URL İÇİN QR KOD:\n");
qrcode.generate(baseUrl, {small: true});

console.log("\n📱 ÖNBELLEK KIRICI URL İÇİN QR KOD:\n");
qrcode.generate(cacheBustUrl, {small: true});

console.log("\n=============================================================");
console.log("KULLANIM:");
console.log("=============================================================");
console.log("1. Telefonunuzda bir QR kod okuyucu açın");
console.log("2. Yukarıdaki QR kodlardan birini tarayın");
console.log("3. Açılan URL'yi telefonunuzun tarayıcısında görüntüleyin");
console.log("\nSorun yaşarsanız önbellek kırıcı URL için olan QR kodu kullanın.");
console.log("=============================================================");