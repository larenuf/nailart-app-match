import qrcode from 'qrcode-terminal';

// Replit URL belirleme
const replSlug = process.env.REPL_SLUG || 'workspace';
const replOwner = process.env.REPL_OWNER || 'larenuf';
const url = `https://${replSlug}.${replOwner}.repl.co`;

console.log(`\nUygulama URL'i: ${url}\n`);
console.log('Aşağıdaki QR kodu telefonunuzla tarayın:\n');

// URL için QR kod oluşturma
qrcode.generate(url, { small: true });