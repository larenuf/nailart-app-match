import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Clock, 
  MoreVertical, 
  CheckCircle,
  XCircle,
  Plus,
  User
} from "lucide-react";
import { format, addDays, startOfDay, addHours, isWithinInterval } from "date-fns";
import { tr } from "date-fns/locale";

type AppointmentManagementProps = {
  salonId: number;
};

// Randevu durumları için renk sınıfları
const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  confirmed: "bg-green-100 text-green-800 hover:bg-green-200",
  completed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function AppointmentManagement({ salonId }: AppointmentManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddTimeSlotDialogOpen, setIsAddTimeSlotDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isTimeSlotsVisible, setIsTimeSlotsVisible] = useState(true);
  const [newSlotTime, setNewSlotTime] = useState("09:00");
  const [newSlotArtistId, setNewSlotArtistId] = useState<string>(""); 

  // Salon artistlerini getir
  const { data: artists } = useQuery({
    queryKey: ["/api/artists", salonId],
    queryFn: async () => {
      if (!salonId) return [];
      const response = await fetch(`/api/artists?salonId=${salonId}`);
      if (!response.ok) throw new Error("Artistler yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId
  });

  // Randevuları getir
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings", salonId, selectedDate, selectedStatus, selectedArtist],
    queryFn: async () => {
      if (!salonId || !selectedDate) return [];
      
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      let url = `/api/bookings?salonId=${salonId}&date=${formattedDate}`;
      
      if (selectedStatus !== "all") {
        url += `&status=${selectedStatus}`;
      }
      
      if (selectedArtist !== "all") {
        url += `&artistId=${selectedArtist}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Randevular yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId && !!selectedDate
  });

  // Müsait zaman dilimlerini getir
  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery({
    queryKey: ["/api/time-slots", salonId, selectedDate, selectedArtist],
    queryFn: async () => {
      if (!salonId || !selectedDate) return [];
      
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      let url = `/api/time-slots?salonId=${salonId}&date=${formattedDate}`;
      
      if (selectedArtist !== "all") {
        url += `&artistId=${selectedArtist}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Müsait zaman dilimleri yüklenirken bir hata oluştu");
      return response.json();
    },
    enabled: !!salonId && !!selectedDate && isTimeSlotsVisible
  });

  // Randevu durumunu güncelleme mutasyonu
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await apiRequest("PATCH", `/api/bookings/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Başarılı!",
        description: "Randevu durumu güncellendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Randevu durumu güncellenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Yeni zaman dilimi ekleme mutasyonu
  const addTimeSlotMutation = useMutation({
    mutationFn: async ({ artistId, date, startTime }: { artistId: number, date: Date, startTime: string }) => {
      const response = await apiRequest("POST", "/api/time-slots", { 
        artistId, 
        date: format(date, "yyyy-MM-dd"), 
        startTime 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots"] });
      setIsAddTimeSlotDialogOpen(false);
      toast({
        title: "Başarılı!",
        description: "Yeni müsait zaman dilimi eklendi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Zaman dilimi eklenirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Zaman dilimi silme mutasyonu
  const deleteTimeSlotMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/time-slots/${id}`);
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots"] });
      toast({
        title: "Başarılı!",
        description: "Zaman dilimi silindi.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: `Zaman dilimi silinirken bir hata oluştu: ${error.message}`,
      });
    },
  });

  // Randevu iptal etme işlemi
  const handleCancelBooking = () => {
    if (selectedAppointment) {
      updateBookingStatusMutation.mutate({ 
        id: selectedAppointment.id, 
        status: "cancelled" 
      });
      setIsCancelDialogOpen(false);
    }
  };

  // Randevu durumunu güncelleme işlemi
  const handleStatusChange = (id: number, status: string) => {
    updateBookingStatusMutation.mutate({ id, status });
  };

  // Yeni zaman dilimi ekleme işlemi
  const handleAddTimeSlot = () => {
    if (!selectedDate || !newSlotArtistId) return;

    addTimeSlotMutation.mutate({
      artistId: parseInt(newSlotArtistId),
      date: selectedDate,
      startTime: newSlotTime
    });
  };

  // Randevu detaylarını gösterme
  const handleShowDetails = (booking: any) => {
    setSelectedAppointment(booking);
    setIsDetailsDialogOpen(true);
  };

  // Randevu iptal modalını açma
  const handleOpenCancelDialog = (booking: any) => {
    setSelectedAppointment(booking);
    setIsCancelDialogOpen(true);
  };

  // Sanatçı ismini getir
  const getArtistName = (artistId: number) => {
    if (!artists) return "Bilinmeyen Artist";
    const artist = artists.find((a: any) => a.id === artistId);
    return artist ? artist.name : "Bilinmeyen Artist";
  };

  // Hizmet adını getir
  const getServiceName = (booking: any) => {
    return booking.serviceName || "Bilinmeyen Hizmet";
  };

  // Durum adını formatla
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Beklemede",
      confirmed: "Onaylandı",
      completed: "Tamamlandı",
      cancelled: "İptal Edildi"
    };
    return statusMap[status] || status;
  };

  // Zaman dilimi kartları
  const renderTimeSlots = () => {
    if (timeSlotsLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!timeSlots || timeSlots.length === 0) {
      return (
        <div className="text-center py-6">
          <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Seçili gün ve artist için müsait zaman dilimi bulunamadı.</p>
          <Button 
            onClick={() => setIsAddTimeSlotDialogOpen(true)} 
            className="mt-3"
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Zaman Dilimi Ekle
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        {timeSlots.map((slot: any) => (
          <div 
            key={slot.id}
            className={`p-2 border rounded-md flex flex-col items-center ${
              slot.isBooked ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-center mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{slot.startTime}</span>
            </div>
            <div className="text-xs text-gray-500">
              {getArtistName(slot.artistId)}
            </div>
            {!slot.isBooked && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1 h-6 text-red-500 hover:text-red-700 p-0"
                onClick={() => deleteTimeSlotMutation.mutate(slot.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={() => setIsAddTimeSlotDialogOpen(true)}
          variant="outline"
          className="flex items-center justify-center h-full min-h-[60px] border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ekle
        </Button>
      </div>
    );
  };

  // Randevu kartları
  const renderBookings = () => {
    if (bookingsLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!bookings || bookings.length === 0) {
      return (
        <div className="text-center py-6">
          <CalendarDays className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Seçili gün ve filtreler için randevu bulunamadı.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 mt-4">
        {bookings.map((booking: any) => (
          <div 
            key={booking.id}
            className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{booking.userName || "İsimsiz Müşteri"}</h3>
                <div className="text-sm text-gray-500">
                  {getServiceName(booking)} - {getArtistName(booking.artistId)}
                </div>
                <div className="text-sm flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                  {booking.startTime} ({booking.durationMinutes || 30} dk)
                </div>
              </div>
              <div className="flex items-center">
                <Badge className={statusColors[booking.status]}>
                  {formatStatus(booking.status)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShowDetails(booking)}>
                      Detayları Göster
                    </DropdownMenuItem>
                    {booking.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Onayla
                      </DropdownMenuItem>
                    )}
                    {booking.status === "confirmed" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "completed")}>
                        <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                        Tamamlandı Olarak İşaretle
                      </DropdownMenuItem>
                    )}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <DropdownMenuItem 
                        onClick={() => handleOpenCancelDialog(booking)}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        İptal Et
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Randevu Yönetimi</CardTitle>
          <CardDescription>
            Salon randevularını görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-sm font-medium mb-2">Takvim</h3>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  locale={tr}
                  disabled={{ before: startOfDay(new Date()) }}
                />
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Durum Filtresi</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tüm durumlar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Durumlar</SelectItem>
                      <SelectItem value="pending">Beklemede</SelectItem>
                      <SelectItem value="confirmed">Onaylandı</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="cancelled">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Artist Filtresi</label>
                  <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tüm artistler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Artistler</SelectItem>
                      {artists && artists.map((artist: any) => (
                        <SelectItem key={artist.id} value={artist.id.toString()}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <Tabs defaultValue="bookings">
                <TabsList className="mb-4">
                  <TabsTrigger value="bookings" onClick={() => setIsTimeSlotsVisible(false)}>
                    Randevular
                  </TabsTrigger>
                  <TabsTrigger value="timeSlots" onClick={() => setIsTimeSlotsVisible(true)}>
                    Müsait Zaman Dilimleri
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="bookings">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: tr })} Randevuları
                      </h3>
                      <Badge variant="outline">
                        {bookings ? bookings.length : 0} Randevu
                      </Badge>
                    </div>
                    {renderBookings()}
                  </div>
                </TabsContent>
                <TabsContent value="timeSlots">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: tr })} Müsait Saatler
                      </h3>
                      <Badge variant="outline">
                        {timeSlots ? timeSlots.filter((s: any) => !s.isBooked).length : 0} Müsait
                      </Badge>
                    </div>
                    {renderTimeSlots()}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Randevu Detay Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Randevu Detayları</DialogTitle>
            <DialogDescription>
              Randevu bilgilerini görüntüleyin
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Müşteri</h4>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <p>{selectedAppointment.userName || "İsimsiz Müşteri"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Durum</h4>
                  <Badge className={statusColors[selectedAppointment.status]}>
                    {formatStatus(selectedAppointment.status)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Hizmet</h4>
                  <p>{getServiceName(selectedAppointment)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Artist</h4>
                  <p>{getArtistName(selectedAppointment.artistId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tarih</h4>
                  <p>{format(new Date(selectedAppointment.date), "d MMMM yyyy", { locale: tr })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Saat</h4>
                  <p>{selectedAppointment.startTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Süre</h4>
                  <p>{selectedAppointment.durationMinutes || 30} dakika</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fiyat</h4>
                  <p>{selectedAppointment.price || "Belirtilmemiş"} ₺</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Notlar</h4>
                <p className="border rounded-md p-2 text-sm">
                  {selectedAppointment.notes || "Not eklenmemiş"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</h4>
                <p className="text-sm">{format(new Date(selectedAppointment.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Kapat
            </Button>
            {selectedAppointment && (selectedAppointment.status === "pending" || selectedAppointment.status === "confirmed") && (
              <div className="space-x-2">
                {selectedAppointment.status === "pending" && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "confirmed");
                      setIsDetailsDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Onayla
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    setIsCancelDialogOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  İptal Et
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* İptal Onay Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Randevu İptali</AlertDialogTitle>
            <AlertDialogDescription>
              Bu randevuyu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              İptal Et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Yeni Zaman Dilimi Ekleme Dialog */}
      <Dialog open={isAddTimeSlotDialogOpen} onOpenChange={setIsAddTimeSlotDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Müsait Zaman Dilimi</DialogTitle>
            <DialogDescription>
              Seçili gün için yeni bir müsait zaman dilimi ekleyin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist</label>
              <Select value={newSlotArtistId} onValueChange={setNewSlotArtistId}>
                <SelectTrigger>
                  <SelectValue placeholder="Artist seçin" />
                </SelectTrigger>
                <SelectContent>
                  {artists && artists.map((artist: any) => (
                    <SelectItem key={artist.id} value={artist.id.toString()}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Saat</label>
              <div className="grid grid-cols-4 gap-2">
                {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`p-2 border rounded-md text-sm ${
                      newSlotTime === time ? 'bg-primary text-white' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setNewSlotTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Seçilen tarih: {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: tr })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTimeSlotDialogOpen(false)}>
              İptal
            </Button>
            <Button 
              disabled={!newSlotArtistId} 
              onClick={handleAddTimeSlot}
            >
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}