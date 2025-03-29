#!/bin/bash

# Uygulamanın çalıştığı port
PORT=5000

# Renk tanımlamaları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}===== NAIL ART MATCH UYGULAMASI =====${NC}"
echo -e "${BLUE}========== LOCALTUNNEL BAŞLATICI ===========${NC}\n"

# NPX'in yüklü olup olmadığını kontrol etme
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Hata: npx bulunamadı.${NC}"
    echo -e "npm ve npx'in yüklü olduğundan emin olun."
    exit 1
fi

echo -e "${YELLOW}LocalTunnel başlatılıyor (Port: $PORT)...${NC}"
echo -e "Bu işlem bir kaç saniye sürebilir...\n"

# LocalTunnel'ı başlat
URL=$(npx localtunnel --port $PORT --print-url)

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ BAŞARILI! Uygulamanız artık aşağıdaki adresten erişilebilir:${NC}"
    echo -e "${GREEN}===========================================${NC}"
    echo -e "${GREEN}🔗 $URL${NC}"
    echo -e "${GREEN}===========================================${NC}"
    echo -e "\nBu URL'yi herhangi bir cihazdan açabilirsiniz."
    echo -e "Telefonunuzdan, tabletinizden veya başka bir bilgisayardan test edebilirsiniz."
    echo -e "\n${BLUE}🔄 Bağlantı aktif, sunucu çalışıyor...${NC}"
    echo -e "Durdurmak için Ctrl+C tuşlarına basın.\n"

    # Arka planda npx localtunnel komutunu çalıştır
    npx localtunnel --port $PORT > /dev/null
else
    echo -e "${RED}Bağlantı hatası oluştu.${NC}"
    echo -e "\n${YELLOW}Öneriler:${NC}"
    echo -e "1. Uygulamanızın çalıştığından emin olun (npm run dev)"
    echo -e "2. Belirtilen port numarasının doğru olduğunu kontrol edin"
    echo -e "3. Internet bağlantınızı kontrol edin"
    exit 1
fi