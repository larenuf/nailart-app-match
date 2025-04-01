/**
 * Doğru URL Oluşturucu
 * 
 * Bu script, uygulamanıza erişmek için kullanabileceğiniz tüm URL'leri gösterir.
 * Önbellek sorunlarını çözmek için zaman damgalı URL'ler de içerir.
 */

// Tarayıcı önbelleğini atlamak için zaman damgası
const timestamp = Date.now();

// Temel Replit URL'si
const replitDomain = process.env.REPLIT_DOMAINS || "";
const baseUrl = `https://${replitDomain}`;

// Önbellek kırıcı URL'ler
const cacheBustUrl = `${baseUrl}/?_t=${timestamp}`;
const cacheBustUrl2 = `${baseUrl}/?v=${timestamp}`;

console.log("=============================================================");
console.log("NAIL ART MATCH UYGULAMASINA ERİŞİM URL'LERİ");
console.log("=============================================================");

console.log("\nÖNBELLEK SORUNLARINI ÇÖZEN URL'LER (EN GÜNCEL İÇERİK İÇİN):");
console.log("-------------------------------------------------------------");
console.log(`1. ${cacheBustUrl}`);
console.log(`2. ${cacheBustUrl2}`);

console.log("\nSTANDART URL'LER:");
console.log("-------------------------------------------------------------");
console.log(`3. ${baseUrl}`);

console.log("\n=============================================================");
console.log("ÖNERİLER:");
console.log("=============================================================");
console.log("1. Önbellek sorunlarını çözmek için yukarıdaki 1. veya 2. URL'yi kullanın");
console.log("2. Tarayıcınızda Ctrl+F5 (Windows) veya Cmd+Shift+R (Mac) tuşlarıyla sayfayı yenileyin");
console.log("3. Tarayıcınızın önbelleğini ve çerezlerini temizleyin");
console.log("4. Gizli/Özel pencerede deneyin (Incognito/Private Window)");
console.log("5. Farklı bir tarayıcı deneyin (Chrome, Firefox, Edge, vb.)");
console.log("6. LocalTunnel ile erişin: 'node localtunnel-baslat.js'");
console.log("=============================================================");