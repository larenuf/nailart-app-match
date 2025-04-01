/**
 * Local Tunnel Bağlantısı
 * 
 * Bu script, yerel uygulamanızı internet üzerinden erişilebilir yapar.
 * localtunnel npm paketi kullanılarak çalışır.
 */

// Önce localtunnel paketini yüklememiz gerekiyor
console.log('localtunnel paketi yükleniyor...');
console.log('npm install localtunnel komutu çalıştırılıyor...\n');

const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Localtunnel'ı yükle
exec('npm install -g localtunnel', (error, stdout, stderr) => {
  if (error) {
    console.error(`Hata: ${error.message}`);
    console.log('\nÖNERİ: Aşağıdaki komutu manuel olarak çalıştırmayı deneyin:');
    console.log('npm install -g localtunnel');
    console.log('\nYükleme tamamlandıktan sonra şu komutu çalıştırın:');
    console.log('lt --port 5000');
    process.exit(1);
  }
  
  console.log('localtunnel başarıyla yüklendi!');
  console.log('Şimdi yerel uygulamanızı internet üzerinden erişilebilir hale getiriyoruz...\n');
  
  // Kullanıcıdan port numarasını al
  rl.question('Uygulamanız hangi portta çalışıyor? (varsayılan: 5000): ', (portAnswer) => {
    const port = portAnswer || 5000;
    
    // Kullanıcıdan subdomain iste (opsiyonel)
    rl.question('Özel bir subdomain ister misiniz? (opsiyonel, boş bırakabilirsiniz): ', (subdomainAnswer) => {
      const subdomainArg = subdomainAnswer ? `--subdomain ${subdomainAnswer}` : '';
      
      console.log(`\nLocal tunnel başlatılıyor, port: ${port}...`);
      console.log('Bu işlem internet bağlantınıza bağlı olarak biraz zaman alabilir...\n');
      
      // localtunnel'ı çalıştır
      const ltProcess = exec(`lt --port ${port} ${subdomainArg}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Hata: ${error.message}`);
          console.log('\nÖNERİ: Aşağıdaki komutu manuel olarak çalıştırmayı deneyin:');
          console.log(`lt --port ${port} ${subdomainArg}`);
          process.exit(1);
        }
      });
      
      ltProcess.stdout.on('data', (data) => {
        console.log(data);
        
        // URL'yi çıktıdan çıkar
        if (data.includes('your url is:')) {
          const url = data.split('your url is:')[1].trim();
          console.log('\n===========================================================');
          console.log(`✅ Uygulamanız şimdi şu adreste erişilebilir: ${url}`);
          console.log('===========================================================\n');
          console.log('Bu URL herhangi bir cihazdan erişilebilir, mobil test için idealdir.');
          console.log('URL geçicidir ve bu script kapatıldığında çalışmayı durdurur.');
          console.log('Durdurmak için Ctrl+C tuşlarına basın.');
          console.log('\n🔄 Bağlantı aktif, sunucu çalışıyor...');
        }
      });
      
      ltProcess.stderr.on('data', (data) => {
        console.error(`Hata: ${data}`);
      });
      
      // Kullanıcı Ctrl+C ile çıkış yapmak istediğinde
      process.on('SIGINT', () => {
        console.log('\nLocal tunnel kapatılıyor...');
        ltProcess.kill();
        rl.close();
        process.exit(0);
      });
    });
  });
});