// Basitleştirilmiş dashboard - minimum import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Salon Yönetim Paneli</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Salon bilgilerinizi, çalışanlarınızı ve hizmetlerinizi yönetin
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bakış</CardTitle>
            <CardDescription>Günlük istatistikler</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bugün 0 randevu var</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Salon Bilgileri</CardTitle>
            <CardDescription>Temel bilgiler</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Salon adı: NAM Nail Studio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Artistler</CardTitle>
            <CardDescription>Artist yönetimi</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Toplam 5 artist</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hizmetler</CardTitle>
            <CardDescription>Hizmet yönetimi</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Toplam 12 hizmet</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <Button asChild>
          <Link href="/admin/create-salon">Yeni Salon Oluştur</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
}