import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import TopNavigation from "@/components/TopNavigation";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileInfo from "@/components/ProfileInfo";
import BookingHistory from "@/components/BookingHistory";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID for now
  const userId = 1;

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    enabled: false, // Disable until we have proper auth
  });

  // Update user profile
  const updateUserMutation = useMutation({
    mutationFn: async (userData: {
      fullName: string;
      email: string;
      phoneNumber: string;
      location: string;
    }) => {
      return apiRequest("PATCH", `/api/users/${userId}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Profil Güncellendi",
        description: "Profiliniz başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Profiliniz güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  // Mock user data for development purposes
  const mockUser = {
    id: 1,
    username: "user123",
    email: "user@example.com",
    fullName: "Ahmet Yılmaz",
    phoneNumber: "+90 555 123 4567",
    location: "İstanbul, Türkiye"
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative pb-16">
      <TopNavigation />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold font-playfair mb-6">Hesabım</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`pb-2 px-4 mr-4 font-medium ${
              activeTab === 'profile'
                ? 'text-[#D6C3E5] border-b-2 border-[#D6C3E5]'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'bookings'
                ? 'text-[#D6C3E5] border-b-2 border-[#D6C3E5]'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            Rezervasyonlar
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <ProfileInfo
            user={mockUser}
            isLoading={isLoading}
            onUpdate={updateUserMutation.mutate}
            isPending={updateUserMutation.isPending}
          />
        ) : (
          <BookingHistory userId={userId} />
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
}