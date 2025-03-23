import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Edit, 
  MoreVertical, 
  Plus, 
  Search, 
  Star, 
  Store, 
  Trash2,
  MapPin,
  Calendar,
  Users,
  Info
} from "lucide-react";

// Salon için tip tanımı
interface Salon {
  id: number;
  name: string;
  address?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  city?: string;
  rating?: number;
  reviewCount?: number;
  status?: string;
  isActive?: boolean;
  isPremium?: boolean;
}

export default function SalonsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);

  // Fetch salons
  const { data: salons, isLoading } = useQuery<Salon[]>({
    queryKey: ["/api/salons"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/salons");
      return response.json();
    }
  });

  // Delete salon mutation
  const deleteSalonMutation = useMutation({
    mutationFn: async (salonId: number) => {
      await apiRequest("DELETE", `/api/admin/salons/${salonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/salons"] });
      toast({
        title: "Salon Silindi",
        description: "Salon başarıyla silindi."
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Salon silinirken bir hata oluştu: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Toggle salon active status mutation
  const toggleSalonStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/admin/salons/${id}/status`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/salons"] });
      toast({
        title: "Durum Güncellendi",
        description: "Salon durumu başarıyla güncellendi."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Hata",
        description: `Durum güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Filtered salons based on search query
  const filteredSalons = salons?.filter((salon) => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (salon.address && salon.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (salon.city && salon.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Delete salon handler
  const handleDeleteSalon = (salonId: number) => {
    setSelectedSalonId(salonId);
    setIsDeleteDialogOpen(true);
  };

  // Confirm deletion handler
  const confirmDeleteSalon = () => {
    if (selectedSalonId) {
      deleteSalonMutation.mutate(selectedSalonId);
    }
  };

  // Toggle salon active status handler
  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    toggleSalonStatusMutation.mutate({ id, isActive: !currentStatus });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Salonlar</CardTitle>
            <CardDescription>Sisteme kayıtlı tüm salonları yönetin</CardDescription>
          </div>
          <Link href="/admin/salons/create">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Salon
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Salon adı, adres veya şehir ara..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="py-10 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Salonlar yükleniyor...</p>
          </div>
        ) : filteredSalons?.length === 0 ? (
          <div className="py-8 text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-2 text-lg font-semibold">Salon Bulunamadı</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? "Arama kriterlerine uygun salon bulunamadı." : "Henüz salon eklenmemiş."}
            </p>
            {searchQuery && (
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Aramayı Temizle
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salon</TableHead>
                  <TableHead>Lokasyon</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalons?.map((salon) => (
                  <TableRow key={salon.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                          <Store className="h-4 w-4" />
                        </div>
                        <div>
                          {salon.name}
                          {salon.isPremium && (
                            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        <span className="text-sm">{salon.city || 'İstanbul'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                        <span>{salon.rating}</span>
                        <span className="text-muted-foreground ml-1">({salon.reviewCount || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={salon.status === "active" || salon.isActive}
                        onCheckedChange={() => handleToggleStatus(salon.id, salon.status === "active" || salon.isActive)}
                        disabled={toggleSalonStatusMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.location.href = `/admin/salons/${salon.id}`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.location.href = `/admin/salons/${salon.id}/artists`}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>Sanatçılar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.location.href = `/admin/salons/${salon.id}/appointments`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Randevular</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSalon(salon.id)}
                            className="text-red-600 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Sil</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Salonu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu salonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm salon verileri silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSalon}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteSalonMutation.isPending ? "Siliniyor..." : "Salonu Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}