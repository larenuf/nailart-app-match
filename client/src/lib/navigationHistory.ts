// Gezinme geçmişini tutan basit bir servis
class NavigationHistory {
  private history: string[] = ['/'];
  private currentIndex = 0;

  constructor() {
    // Başlangıçta mevcut URL'yi ekle
    const currentPath = window.location.pathname;
    if (currentPath !== '/') {
      this.history = ['/', currentPath];
      this.currentIndex = 1;
    }
  }

  // Yeni bir sayfa ziyaret edildiğinde çağrılır
  push(path: string): void {
    // Zaten mevcut yoldaysak ekleme
    if (this.getCurrentPath() === path) {
      return;
    }

    // Eğer geri gidip sonra yeni bir sayfaya gittiyse, 
    // araya giren geçmişi sil
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push(path);
    this.currentIndex = this.history.length - 1;
  }

  // Önceki sayfaya git
  back(): string {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.getCurrentPath();
  }

  // Sonraki sayfaya git (eğer geri gittikten sonra ileri gitmek istenirse)
  forward(): string {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
    }
    return this.getCurrentPath();
  }

  // Mevcut yol
  getCurrentPath(): string {
    return this.history[this.currentIndex];
  }

  // Geri gidilebilir mi?
  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  // İleri gidilebilir mi?
  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  // Hata ayıklama için geçmiş görüntüleme
  getHistory(): string[] {
    return [...this.history];
  }
}

// Singleton örneği oluştur ve dışa aktar
export const navigationHistory = new NavigationHistory();