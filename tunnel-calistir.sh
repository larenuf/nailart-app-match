#!/bin/bash

# LocalTunnel Çalıştırma Script'i
# Özel subdomain'li tunnel oluşturur

# Çalıştırma izni vermek için: chmod +x tunnel-calistir.sh
# Çalıştırmak için: ./tunnel-calistir.sh

echo "=================================================="
echo "LocalTunnel Başlatılıyor"
echo "=================================================="

# Rastgele bir subdomain oluştur
RANDOM_NUMBER=$RANDOM
SUBDOMAIN="nailartapp-${RANDOM_NUMBER}"

echo "Subdomain: ${SUBDOMAIN}"
echo "Port: 5000"
echo ""
echo "Başlatılıyor..."

# LocalTunnel'ı başlat
npx localtunnel --port 5000 --subdomain ${SUBDOMAIN}

# Eğer hata olursa
if [ $? -ne 0 ]; then
  echo "LocalTunnel başlatılırken hata oluştu!"
  echo "Lütfen 'node localtunnel-baslat.js' komutunu deneyin."
fi