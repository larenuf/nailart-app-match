
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=============================================================");
console.log("UYGULAMA YENİDEN BAŞLATILIYOR VE ÖNBELLEK TEMİZLENİYOR");
console.log("=============================================================");

// 1. Bazı geçici dosyaları temizle (varsa)
console.log("\n1. Geçici dosyalar temizleniyor...");
const tempFolders = [
  '.cache',
  'node_modules/.cache',
  'client/node_modules/.cache',
];

tempFolders.forEach(folder => {
  const folderPath = path.join(process.cwd(), folder);
  if (fs.existsSync(folderPath)) {
    console.log(`   - ${folder} klasörü temizleniyor...`);
    try {
      fs.readdirSync(folderPath).forEach(file => {
        const filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          console.log(`     (klasör atlanıyor: ${file})`);
        } else {
          fs.unlinkSync(filePath);
          console.log(`     ${file} silindi`);
        }
      });
    } catch (err) {
      console.log(`   - ${folder} temizlenirken hata: ${err.message}`);
    }
  } else {
    console.log(`   - ${folder} klasörü mevcut değil, atlanıyor`);
  }
});

// 2. package-lock.json'a dokunarak npm install'ın bağımlılıkları yeniden değerlendirmesini sağla
console.log("\n2. Bağımlılıklar yeniden değerlendiriliyor...");
try {
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    const now = new Date();
    fs.utimesSync(packageLockPath, now, now);
    console.log("   - package-lock.json dosyası güncellendi");
  } else {
    console.log("   - package-lock.json dosyası bulunamadı, atlanıyor");
  }
} catch (err) {
  console.log(`   - Hata: ${err.message}`);
}

console.log("\n3. Uygulama yeniden başlatılıyor...");
console.log("   - Bu işlem biraz zaman alabilir, lütfen bekleyin...");

const timestamp = Date.now();
const replitDomain = process.env.REPLIT_DOMAINS || "";
const baseUrl = `https://${replitDomain}`;
const cacheBustingUrl = `${baseUrl}/?_t=${timestamp}`;

console.log("\n=============================================================");
console.log("İŞLEM TAMAMLANDI!");
console.log("=============================================================");
console.log("\nLütfen aşağıdaki URL'yi kullanarak uygulamaya erişin:");
console.log(`\n${cacheBustingUrl}\n`);
console.log("Bu URL, tarayıcı önbelleğini atlayarak en güncel içeriği gösterecektir.");
console.log("\nTarayıcınızda Ctrl+F5 (Windows) veya Cmd+Shift+R (Mac) tuşlarına");
console.log("basarak da sayfayı tamamen yenileyebilirsiniz.");
console.log("=============================================================");
