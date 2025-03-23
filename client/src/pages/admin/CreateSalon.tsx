// Basitleştirilmiş CreateSalon bileşeni
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CreateSalon() {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Salon Oluştur</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Yeni bir salon eklemek için aşağıdaki formu doldurun
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Salon Bilgileri</CardTitle>
          <CardDescription>
            Müşterilerin göreceği temel salon bilgilerini girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-4">Geçici Test İçeriği</h3>
            <p className="mb-4">
              Bu sayfa yalnızca yönlendirme testleri için basitleştirilmiştir.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/">Ana Sayfaya Dön</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">Yönetim Paneline Dön</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}