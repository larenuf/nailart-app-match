import qrcode from 'qrcode-terminal';

// Doğrudan URL'yi belirleme
const url = 'https://cc585201-25b3-46d4-ae88-91fabbe0d50a-00-2img5bddmditq.spock.replit.dev/?_t=' + Date.now();

// Önbelleklemeyi engellemek için zaman damgalı URL versiyonu
const cacheBusterUrl = `${url}&cache_buster=${Date.now()}`;

console.log(`\nÖnbellek Korumalı Uygulama URL'i: ${url}\n`);
console.log(`Alternatif URL: ${cacheBusterUrl}\n`);
console.log('Aşağıdaki QR kodu telefonunuzla tarayın:\n');

// URL için QR kod oluşturma
qrcode.generate(cacheBusterUrl, { small: true });

console.log('\nBu URL\'ler önbellek sorunlarını çözmek için zaman damgası içeriyor.');
console.log('Uygulamaya göz atarken sorun yaşarsanız, bu URL\'lerden birini kullanın.');