import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  Check, 
  MapPin, 
  Car, 
  BellRing,
  Edit3,
  XCircle,
  Sparkles
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { addDays, format, isPast, isToday, isWeekend, setHours, setMinutes, isBefore, isSameDay } from 'date-fns';
import { tr, enUS, arSA } from 'date-fns/locale';
import { useI18n } from '@/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useToast } from '@/hooks/use-toast';

// Randevu tipi tanımı
interface Appointment {
  id: number;
  date: Date;
  serviceName: string;
  artistName: string;
  salonName: string;
  status: 'confirmed' | 'pending' | 'canceled';
  duration: number; // dakika cinsinden süre
  price: number;
  address?: string;
  distance?: string;
  estimatedTravelTime?: number; // dakika
  notes?: string;
}

// Akıllı saat dilimi öneri algoritması
function suggestTimeSlots(
  date: Date, 
  userPreferences: { 
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening',
    previousAppointments?: Date[] 
  },
  trafficInfo: { 
    peakHours: { start: number, end: number }[] 
  },
  availableSlots: { start: Date, end: Date }[]
): { time: Date, score: number, reason: string }[] {
  
  const slots: { time: Date, score: number, reason: string }[] = [];
  
  // Mevcut saat dilimlerini değerlendir
  availableSlots.forEach(slot => {
    const time = slot.start;
    let score = 50; // Başlangıç skoru
    let reasons: string[] = [];
    
    const hour = time.getHours();
    
    // Geçmiş tercihlere göre değerlendirme
    if (userPreferences.previousAppointments?.some(prevDate => {
      const prevHour = prevDate.getHours();
      return Math.abs(prevHour - hour) <= 1; // 1 saat içinde aynı saat dilimi
    })) {
      score += 20;
      reasons.push("Daha önce tercih ettiğiniz bir saat");
    }
    
    // Tercih edilen saat dilimine göre değerlendirme
    if (
      (userPreferences.preferredTimeOfDay === 'morning' && hour >= 8 && hour <= 11) ||
      (userPreferences.preferredTimeOfDay === 'afternoon' && hour >= 12 && hour <= 16) ||
      (userPreferences.preferredTimeOfDay === 'evening' && hour >= 17 && hour <= 20)
    ) {
      score += 15;
      reasons.push("Tercih ettiğiniz zaman diliminde");
    }
    
    // Trafik yoğunluğuna göre değerlendirme
    const isInPeakHour = trafficInfo.peakHours.some(
      peak => hour >= peak.start && hour <= peak.end
    );
    
    if (isInPeakHour) {
      score -= 15;
      reasons.push("Trafik yoğun olabilir");
    } else {
      score += 10;
      reasons.push("Trafik az olabilir");
    }
    
    // Öğle yemeği veya akşam yemeği saatlerine göre değerlendirme
    if ((hour >= 12 && hour <= 13) || (hour >= 19 && hour <= 20)) {
      score -= 5;
      reasons.push("Yemek saati olabilir");
    }
    
    // En önemli sebebi döndür
    const topReason = reasons.reduce((prev, curr) => {
      const prevIndex = reasons.indexOf(prev);
      const currIndex = reasons.indexOf(curr);
      return Math.abs(score - 50 - (prevIndex > 1 ? 15 : prevIndex > 0 ? 10 : 0)) > 
             Math.abs(score - 50 - (currIndex > 1 ? 15 : currIndex > 0 ? 10 : 0)) ? prev : curr;
    }, reasons[0] || "Uygun bir zaman");
    
    slots.push({ time, score, reason: topReason });
  });
  
  // Skorlara göre sırala
  return slots.sort((a, b) => b.score - a.score);
}

// Sürükle-bırak için randevu öğesi
const AppointmentItem = ({ 
  appointment, 
  onEditClick,
  onReschedule
}: { 
  appointment: Appointment, 
  onEditClick: (id: number) => void,
  onReschedule: (id: number, newDate: Date) => void
}) => {
  const { t, locale, formatPrice } = useI18n();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'appointment',
    item: { id: appointment.id, currentDate: appointment.date },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  // Farklı dillere göre tarih formatları
  const dateLocales = {
    tr: tr,
    en: enUS,
    ar: arSA
  };
  
  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-3 mb-2 rounded-lg border ${
        appointment.status === 'confirmed' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : appointment.status === 'pending'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      } cursor-move relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{appointment.serviceName}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">{appointment.salonName}</p>
        </div>
        <Badge variant={
          appointment.status === 'confirmed' ? 'default' : 
          appointment.status === 'pending' ? 'outline' : 'destructive'
        }>
          {appointment.status === 'confirmed' 
            ? (locale === 'tr' ? 'Onaylandı' : locale === 'en' ? 'Confirmed' : 'مؤكد')
            : appointment.status === 'pending'
            ? (locale === 'tr' ? 'Bekliyor' : locale === 'en' ? 'Pending' : 'قيد الانتظار')
            : (locale === 'tr' ? 'İptal Edildi' : locale === 'en' ? 'Canceled' : 'ملغي')
          }
        </Badge>
      </div>
      
      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <CalendarIcon size={14} className="mr-1" />
        <span>
          {format(appointment.date, locale === 'tr' ? 'd MMMM, EEEE' : locale === 'en' ? 'EEEE, MMMM d' : 'EEEE, d MMMM', { 
            locale: dateLocales[locale] 
          })}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
        <Clock size={14} className="mr-1" />
        <span>
          {format(appointment.date, locale === 'tr' ? 'HH:mm' : locale === 'en' ? 'h:mm a' : 'h:mm a')} • 
          {appointment.duration} {locale === 'tr' ? 'dk' : locale === 'en' ? 'min' : 'دقيقة'}
        </span>
      </div>
      
      {appointment.address && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <MapPin size={14} className="mr-1" />
          <span>{appointment.address}</span>
          {appointment.distance && (
            <span className="ml-1 text-gray-600 dark:text-gray-300">{appointment.distance}</span>
          )}
        </div>
      )}
      
      {appointment.estimatedTravelTime && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Car size={14} className="mr-1" />
          <span>
            {locale === 'tr' ? 'Tahmini Seyahat: ' : locale === 'en' ? 'Est. Travel: ' : 'وقت السفر التقديري: '}
            {appointment.estimatedTravelTime} 
            {locale === 'tr' ? ' dk' : locale === 'en' ? ' min' : ' دقيقة'}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm font-medium text-primary">
          {formatPrice(appointment.price)}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onEditClick(appointment.id)}
        >
          <Edit3 size={14} />
          <span className="sr-only">
            {locale === 'tr' ? 'Düzenle' : locale === 'en' ? 'Edit' : 'تعديل'}
          </span>
        </Button>
      </div>
      
      <div className="pt-1 text-xs font-medium">
        {locale === 'tr' 
          ? 'Taşımak için sürükleyin veya başka bir tarihe bırakın' 
          : locale === 'en' 
          ? 'Drag to move or drop on another date' 
          : 'اسحب للنقل أو أفلت على تاريخ آخر'}
      </div>
    </motion.div>
  );
};

// Takvim hedefi bileşeni
const CalendarDropTarget = ({ 
  date, 
  onDrop,
  dayPickerLocale, 
  selectedDate,
  setSelectedDate,
  highlighted = false
}: { 
  date: Date, 
  onDrop: (appointmentId: number, newDate: Date) => void,
  dayPickerLocale: any,
  selectedDate: Date,
  setSelectedDate: (date: Date) => void,
  highlighted?: boolean
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'appointment',
    drop: (item: { id: number, currentDate: Date }) => {
      const newDate = new Date(date);
      // Saati ve dakikayı orijinal randevudan al
      newDate.setHours(item.currentDate.getHours());
      newDate.setMinutes(item.currentDate.getMinutes());
      onDrop(item.id, newDate);
      return { date: newDate };
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  return (
    <div 
      ref={drop} 
      className={`relative ${isOver ? 'bg-primary/10' : ''}`}
      style={{ height: '100%' }}
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        locale={dayPickerLocale}
        className={`${isOver ? 'opacity-50' : 'opacity-100'}`}
        modifiers={{
          highlighted: [date],
          disabled: [
            { before: new Date() }, // Bugünden önceki günleri devre dışı bırak
          ]
        }}
        modifiersStyles={{
          highlighted: {
            backgroundColor: highlighted ? 'var(--primary-50)' : 'transparent',
            color: highlighted ? 'var(--primary-900)' : 'inherit',
            fontWeight: highlighted ? 'bold' : 'normal'
          }
        }}
      />
      {isOver && (
        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-md pointer-events-none">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg">
            <Check className="text-primary h-6 w-6" />
          </div>
        </div>
      )}
    </div>
  );
};

// Bildirim hatırlatıcısı bileşeni
const SmartReminder = ({ 
  appointment, 
  trafficStatus,
  onAcknowledge
}: { 
  appointment: Appointment, 
  trafficStatus: 'light' | 'medium' | 'heavy',
  onAcknowledge: () => void
}) => {
  const { locale } = useI18n();
  
  // Trafik durumuna göre çıkış önerisi
  const extraTime = 
    trafficStatus === 'light' ? 15 :
    trafficStatus === 'medium' ? 25 : 40;
  
  const leaveEarlier = appointment.estimatedTravelTime 
    ? appointment.estimatedTravelTime + extraTime 
    : extraTime;
  
  // Farklı dillere göre mesajlar
  const messages = {
    title: {
      tr: 'Yaklaşan Randevu Hatırlatıcısı',
      en: 'Upcoming Appointment Reminder',
      ar: 'تذكير بالموعد القادم'
    },
    traffic: {
      light: {
        tr: 'Trafik durumu şu anda iyi görünüyor.',
        en: 'Traffic conditions are currently looking good.',
        ar: 'حالة المرور جيدة حاليًا.'
      },
      medium: {
        tr: 'Trafik durumu orta yoğunlukta.',
        en: 'Traffic is moderately congested.',
        ar: 'حركة المرور متوسطة الازدحام.'
      },
      heavy: {
        tr: 'Trafik durumu şu anda çok yoğun!',
        en: 'Traffic is very heavy right now!',
        ar: 'حركة المرور مزدحمة جدًا الآن!'
      }
    },
    leave: {
      tr: `${leaveEarlier} dakika önceden çıkmanızı öneririz.`,
      en: `We suggest leaving ${leaveEarlier} minutes earlier.`,
      ar: `نقترح المغادرة قبل ${leaveEarlier} دقيقة.`
    },
    acknowledge: {
      tr: 'Anladım',
      en: 'Got it',
      ar: 'فهمت'
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4"
    >
      <div className="flex items-start">
        <BellRing className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {messages.title[locale]}
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p className="font-medium">{appointment.serviceName} @ {appointment.salonName}</p>
            <p className="mt-1">
              {format(appointment.date, locale === 'tr' ? 'd MMMM, HH:mm' : locale === 'en' ? 'MMMM d, h:mm a' : 'd MMMM، h:mm a')}
            </p>
            <p className="mt-1">
              {messages.traffic[trafficStatus][locale]}
            </p>
            <p className="font-medium mt-1 text-yellow-800 dark:text-yellow-100">
              {messages.leave[locale]}
            </p>
          </div>
          <div className="mt-3">
            <Button 
              size="sm" 
              onClick={onAcknowledge}
            >
              {messages.acknowledge[locale]}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Ana Akıllı Rezervasyon sistemi bileşeni
export function SmartBookingSystem() {
  const { t, locale, formatPrice } = useI18n();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: addDays(setHours(setMinutes(new Date(), 30), 14), 1), // Yarın, 14:30
      serviceName: 'Manikür & Oje',
      artistName: 'Ayşe Yılmaz',
      salonName: 'Bella Nail Art',
      status: 'confirmed',
      duration: 60,
      price: 350,
      address: 'Bağdat Caddesi No:102, Kadıköy',
      distance: '3.2 km',
      estimatedTravelTime: 15
    },
    {
      id: 2,
      date: addDays(setHours(setMinutes(new Date(), 0), 11), 5), // 5 gün sonra, 11:00
      serviceName: 'Kalıcı Oje',
      artistName: 'Zeynep Kaya',
      salonName: 'Pink Nails Salon',
      status: 'pending',
      duration: 45,
      price: 250,
      address: 'Teşvikiye Cad. No:15, Nişantaşı',
      distance: '5.7 km',
      estimatedTravelTime: 25
    },
    {
      id: 3,
      date: addDays(setHours(setMinutes(new Date(), 0), 16), -2), // 2 gün önce, 16:00
      serviceName: 'Protez Tırnak',
      artistName: 'Melis Demir',
      salonName: 'Glamour Nails',
      status: 'confirmed',
      duration: 90,
      price: 550,
      address: 'Abdi İpekçi Cad. No:22, Nişantaşı',
      distance: '6.1 km',
      estimatedTravelTime: 30
    }
  ]);
  
  const [showReminder, setShowReminder] = useState(true);
  
  // Dile göre tarih yerelleştirmesi seç
  const dayPickerLocale = locale === 'tr' ? tr : locale === 'en' ? enUS : arSA;
  
  // Geçmiş, yaklaşan ve iptal edilen randevuları filtrele
  const pastAppointments = appointments.filter(
    app => isPast(app.date) && !isToday(app.date)
  );
  
  const upcomingAppointments = appointments.filter(
    app => (isToday(app.date) || !isPast(app.date)) && app.status !== 'canceled'
  );
  
  const canceledAppointments = appointments.filter(
    app => app.status === 'canceled'
  );
  
  // Randevu yeniden planlama işlevi
  const handleReschedule = (appointmentId: number, newDate: Date) => {
    // Mevcut saati ve dakikayı olduğu gibi koru
    setAppointments(prevAppointments => 
      prevAppointments.map(app => 
        app.id === appointmentId 
          ? { ...app, date: newDate, status: 'pending' }
          : app
      )
    );
    
    toast({
      title: locale === 'tr' 
        ? 'Randevu Yeniden Planlandı' 
        : locale === 'en' 
        ? 'Appointment Rescheduled' 
        : 'تمت إعادة جدولة الموعد',
      description: locale === 'tr'
        ? `Randevunuz ${format(newDate, 'd MMMM, EEEE', { locale: tr })} tarihine taşındı.`
        : locale === 'en'
        ? `Your appointment has been moved to ${format(newDate, 'EEEE, MMMM d', { locale: enUS })}.`
        : `تم نقل موعدك إلى ${format(newDate, 'EEEE, d MMMM', { locale: arSA })}.`,
      variant: 'default',
    });
  };
  
  // Randevu düzenleme işlevi - şimdilik toast mesajı göster
  const handleEditAppointment = (id: number) => {
    toast({
      title: locale === 'tr' 
        ? 'Düzenleme Modu' 
        : locale === 'en' 
        ? 'Edit Mode' 
        : 'وضع التحرير',
      description: locale === 'tr'
        ? 'Randevu düzenleme özelliği yakında eklenecek.'
        : locale === 'en'
        ? 'Appointment editing feature coming soon.'
        : 'ستتم إضافة ميزة تحرير الموعد قريبًا.',
      variant: 'default',
    });
  };
  
  // Akıllı zaman dilimi önerisi için veri hazırlığı
  const userPreferences = {
    preferredTimeOfDay: 'afternoon' as const,
    previousAppointments: appointments.map(app => app.date)
  };
  
  const trafficInfo = {
    peakHours: [
      { start: 7, end: 9 },   // Sabah yoğunluğu
      { start: 17, end: 19 }  // Akşam yoğunluğu
    ]
  };
  
  // Örnek kullanılabilir zaman dilimleri (normalde backendden gelir)
  const availableTimeSlots = [
    { start: setHours(setMinutes(addDays(new Date(), 2), 0), 10), end: setHours(setMinutes(addDays(new Date(), 2), 0), 11) },
    { start: setHours(setMinutes(addDays(new Date(), 2), 0), 11), end: setHours(setMinutes(addDays(new Date(), 2), 0), 12) },
    { start: setHours(setMinutes(addDays(new Date(), 2), 0), 14), end: setHours(setMinutes(addDays(new Date(), 2), 0), 15) },
    { start: setHours(setMinutes(addDays(new Date(), 2), 0), 16), end: setHours(setMinutes(addDays(new Date(), 2), 0), 17) },
    { start: setHours(setMinutes(addDays(new Date(), 2), 0), 18), end: setHours(setMinutes(addDays(new Date(), 2), 0), 19) },
    { start: setHours(setMinutes(addDays(new Date(), 3), 30), 9), end: setHours(setMinutes(addDays(new Date(), 3), 30), 10) },
    { start: setHours(setMinutes(addDays(new Date(), 3), 30), 13), end: setHours(setMinutes(addDays(new Date(), 3), 30), 14) },
    { start: setHours(setMinutes(addDays(new Date(), 3), 30), 15), end: setHours(setMinutes(addDays(new Date(), 3), 30), 16) },
    { start: setHours(setMinutes(addDays(new Date(), 3), 30), 17), end: setHours(setMinutes(addDays(new Date(), 3), 30), 18) }
  ];
  
  // Tarih için akıllı önerilen saat dilimleri
  const suggestedSlots = suggestTimeSlots(
    addDays(new Date(), 2),
    userPreferences,
    trafficInfo,
    availableTimeSlots.filter(slot => 
      isSameDay(slot.start, addDays(new Date(), 2))
    )
  );
  
  // En iyi 3 öneriyi göster
  const topSuggestions = suggestedSlots.slice(0, 3);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto max-w-4xl pb-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'tr' ? 'Randevularım' : locale === 'en' ? 'My Appointments' : 'مواعيدي'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'tr' 
              ? 'Randevularınızı görüntüleyin, yönetin veya yeniden planlayın.' 
              : locale === 'en' 
              ? 'View, manage or reschedule your appointments.' 
              : 'عرض مواعيدك أو إدارتها أو إعادة جدولتها.'}
          </p>
        </div>
        
        {/* Akıllı hatırlatıcı */}
        <AnimatePresence>
          {showReminder && upcomingAppointments.length > 0 && (
            <SmartReminder 
              appointment={upcomingAppointments[0]} 
              trafficStatus="medium"
              onAcknowledge={() => setShowReminder(false)}
            />
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'tr' ? 'Randevular' : locale === 'en' ? 'Appointments' : 'المواعيد'}
                </CardTitle>
                <CardDescription>
                  {locale === 'tr' 
                    ? 'Yeniden planlamak için randevuyu takvime sürükleyin.' 
                    : locale === 'en' 
                    ? 'Drag appointment to the calendar to reschedule.' 
                    : 'اسحب الموعد إلى التقويم لإعادة الجدولة.'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="upcoming" className="text-sm">
                      {locale === 'tr' ? 'Yaklaşan' : locale === 'en' ? 'Upcoming' : 'القادمة'}
                      {upcomingAppointments.length > 0 && (
                        <Badge variant="outline" className="ml-2">{upcomingAppointments.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="past" className="text-sm">
                      {locale === 'tr' ? 'Geçmiş' : locale === 'en' ? 'Past' : 'السابقة'}
                      {pastAppointments.length > 0 && (
                        <Badge variant="outline" className="ml-2">{pastAppointments.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="canceled" className="text-sm">
                      {locale === 'tr' ? 'İptal Edilen' : locale === 'en' ? 'Canceled' : 'الملغاة'}
                      {canceledAppointments.length > 0 && (
                        <Badge variant="outline" className="ml-2">{canceledAppointments.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {locale === 'tr' 
                            ? 'Yaklaşan randevunuz yok' 
                            : locale === 'en' 
                            ? 'No upcoming appointments' 
                            : 'لا توجد مواعيد قادمة'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {locale === 'tr' 
                            ? 'Yeni bir randevu almak için salon keşfetmeye başlayın.' 
                            : locale === 'en' 
                            ? 'Start exploring salons to book a new appointment.' 
                            : 'ابدأ باستكشاف الصالونات لحجز موعد جديد.'}
                        </p>
                        <div className="mt-6">
                          <AnimatedButton
                            animation="bounce"
                            className="mx-auto"
                          >
                            {locale === 'tr' 
                              ? 'Salonları Keşfet' 
                              : locale === 'en' 
                              ? 'Explore Salons' 
                              : 'استكشف الصالونات'}
                          </AnimatedButton>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {upcomingAppointments.map(appointment => (
                          <AppointmentItem 
                            key={appointment.id} 
                            appointment={appointment} 
                            onEditClick={handleEditAppointment}
                            onReschedule={handleReschedule}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="past">
                    {pastAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {locale === 'tr' 
                            ? 'Geçmiş randevunuz yok' 
                            : locale === 'en' 
                            ? 'No past appointments' 
                            : 'لا توجد مواعيد سابقة'}
                        </h3>
                      </div>
                    ) : (
                      <div>
                        {pastAppointments.map(appointment => (
                          <div 
                            key={appointment.id}
                            className="p-3 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-sm">{appointment.serviceName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.salonName}</p>
                              </div>
                              <Badge variant="outline">
                                {locale === 'tr' ? 'Tamamlandı' : locale === 'en' ? 'Completed' : 'مكتمل'}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <CalendarIcon size={14} className="mr-1" />
                              <span>
                                {format(appointment.date, locale === 'tr' ? 'd MMMM, EEEE' : locale === 'en' ? 'EEEE, MMMM d' : 'EEEE, d MMMM', { 
                                  locale: dayPickerLocale 
                                })}
                              </span>
                            </div>
                            
                            <div className="flex justify-end mt-2">
                              <Button variant="outline" size="sm">
                                {locale === 'tr' ? 'Yorum Yap' : locale === 'en' ? 'Leave Review' : 'اترك تقييمًا'}
                              </Button>
                              <Button variant="ghost" size="sm" className="ml-2">
                                {locale === 'tr' ? 'Tekrar Yap' : locale === 'en' ? 'Rebook' : 'إعادة الحجز'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="canceled">
                    {canceledAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <XCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {locale === 'tr' 
                            ? 'İptal edilen randevunuz yok' 
                            : locale === 'en' 
                            ? 'No canceled appointments' 
                            : 'لا توجد مواعيد ملغاة'}
                        </h3>
                      </div>
                    ) : (
                      <div>
                        {canceledAppointments.map(appointment => (
                          <div 
                            key={appointment.id}
                            className="p-3 mb-2 rounded-lg border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-sm">{appointment.serviceName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.salonName}</p>
                              </div>
                              <Badge variant="destructive">
                                {locale === 'tr' ? 'İptal Edildi' : locale === 'en' ? 'Canceled' : 'ملغي'}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <CalendarIcon size={14} className="mr-1" />
                              <span>
                                {format(appointment.date, locale === 'tr' ? 'd MMMM, EEEE' : locale === 'en' ? 'EEEE, MMMM d' : 'EEEE، d MMMM', { 
                                  locale: dayPickerLocale 
                                })}
                              </span>
                            </div>
                            
                            <div className="flex justify-end mt-2">
                              <Button variant="outline" size="sm">
                                {locale === 'tr' ? 'Tekrar Yap' : locale === 'en' ? 'Rebook' : 'إعادة الحجز'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Akıllı öneriler bölümü */}
            {topSuggestions.length > 0 && activeTab === 'upcoming' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                    {locale === 'tr' 
                      ? 'Akıllı Randevu Önerileri' 
                      : locale === 'en' 
                      ? 'Smart Appointment Suggestions' 
                      : 'اقتراحات مواعيد ذكية'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'tr' 
                      ? 'Programınıza göre özelleştirilmiş en uygun zaman dilimleri' 
                      : locale === 'en' 
                      ? 'Best time slots customized to your schedule' 
                      : 'أفضل الأوقات المخصصة لجدولك'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {topSuggestions.map((slot, index) => (
                      <Card key={index} className="border-2 hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">
                                {format(slot.time, locale === 'tr' ? 'EEEE' : locale === 'en' ? 'EEEE' : 'EEEE', { 
                                  locale: dayPickerLocale 
                                })}
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {format(slot.time, locale === 'tr' ? 'HH:mm' : locale === 'en' ? 'h:mm a' : 'h:mm a')}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                              {slot.score}% {locale === 'tr' ? 'Eşleşme' : locale === 'en' ? 'Match' : 'تطابق'}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              <span>{slot.reason}</span>
                            </div>
                          </div>
                          
                          <Button size="sm" className="mt-3 w-full">
                            {locale === 'tr' ? 'Seç' : locale === 'en' ? 'Select' : 'اختر'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          {locale === 'tr' 
                            ? 'Tüm Uygun Saatleri Gör' 
                            : locale === 'en' 
                            ? 'View All Available Times' 
                            : 'عرض جميع الأوقات المتاحة'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-2">
                          <h4 className="font-medium">
                            {locale === 'tr' 
                              ? 'Tüm Uygun Saatler' 
                              : locale === 'en' 
                              ? 'All Available Times' 
                              : 'جميع الأوقات المتاحة'}
                          </h4>
                          <div className="grid grid-cols-3 gap-1">
                            {suggestedSlots.map((slot, index) => (
                              <Button 
                                key={index} 
                                variant="outline" 
                                size="sm"
                                className={`text-xs justify-start ${slot.score > 70 ? 'border-green-500' : ''}`}
                              >
                                {format(slot.time, locale === 'tr' ? 'HH:mm' : locale === 'en' ? 'h:mm a' : 'h:mm a')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'tr' ? 'Takvim' : locale === 'en' ? 'Calendar' : 'التقويم'}
                </CardTitle>
                <CardDescription>
                  {locale === 'tr' 
                    ? 'Randevuları görüntüle veya tarih seç' 
                    : locale === 'en' 
                    ? 'View appointments or select date' 
                    : 'عرض المواعيد أو اختيار تاريخ'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarDropTarget 
                  date={date} 
                  onDrop={(appointmentId, newDate) => handleReschedule(appointmentId, newDate)}
                  dayPickerLocale={dayPickerLocale}
                  selectedDate={date}
                  setSelectedDate={setDate}
                  highlighted={upcomingAppointments.some(app => isSameDay(app.date, date))}
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="space-y-2 w-full">
                  {upcomingAppointments
                    .filter(app => isSameDay(app.date, date))
                    .map(appointment => (
                      <div 
                        key={appointment.id}
                        className="p-2 rounded-md bg-primary/10 text-xs flex justify-between w-full"
                      >
                        <span>{format(appointment.date, locale === 'tr' ? 'HH:mm' : locale === 'en' ? 'h:mm a' : 'h:mm a')}</span>
                        <span className="font-medium truncate max-w-[150px]">{appointment.serviceName}</span>
                      </div>
                    ))}
                    
                  {upcomingAppointments.filter(app => isSameDay(app.date, date)).length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {locale === 'tr' 
                        ? 'Bu tarihte randevu yok' 
                        : locale === 'en' 
                        ? 'No appointments on this date' 
                        : 'لا توجد مواعيد في هذا التاريخ'}
                    </p>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="mt-4">
                  {locale === 'tr' ? 'Yeni Randevu' : locale === 'en' ? 'New Appointment' : 'موعد جديد'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}