/**
 * Önbellek Sorunlarını Çözen URL Oluşturucu
 * 
 * Bu script, tarayıcı önbelleğini atlamak için zaman damgalı URL'ler oluşturur.
 * Replit önbellek sorunlarını aşmak için kullanabilirsiniz.
 */

// Zamana bağlı rastgele bir değer (önbellek kırıcı)
const timestamp = Date.now();
const randomString = Math.random().toString(36).substring(2, 10);

// Temel Replit URL'si
const replitDomain = process.env.REPLIT_DOMAINS || "";
const baseUrl = `https://${replitDomain}`;

// Önbellek kırıcı parametrelerle URL'ler oluştur
const cacheBustingUrls = [
  `${baseUrl}/?_t=${timestamp}`,
  `${baseUrl}/?cache_buster=${timestamp}`,
  `${baseUrl}/?_=${randomString}`,
  `${baseUrl}/?v=${timestamp}&r=${randomString}`,
  `${baseUrl}/?clear_cache=true&t=${timestamp}`,
];

console.log("=============================================================");
console.log("ÖNBELLEK SORUNLARINI ÇÖZEN URL'LER");
console.log("=============================================================");
console.log("\nAşağıdaki URL'lerden birini tarayıcınızda açın:");
console.log("Bu URL'ler tarayıcı önbelleğini atlar ve en güncel içeriği gösterir.\n");

cacheBustingUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log("\n=============================================================");
console.log("UYGULAMA SEÇENEKLERİ:");
console.log("=============================================================");
console.log("1. Tarayıcınızda Ctrl+F5 (Windows) veya Cmd+Shift+R (Mac) tuşlarıyla sayfayı yenileyin");
console.log("2. Tarayıcınızın önbelleğini ve çerezlerini temizleyin");
console.log("3. Gizli/Özel pencerede deneyin (Incognito/Private Window)");
console.log("4. Farklı bir tarayıcı deneyin (Chrome, Firefox, Edge, vb.)");
console.log("5. Mobile cihazdan deneyin (önbellek sorunları genellikle masaüstü tarayıcılarda olur)");
console.log("=============================================================");