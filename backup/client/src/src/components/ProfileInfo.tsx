import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileSchema = z.object({
  fullName: z.string().min(2, "İsim en az 2 karakter olmalıdır").optional(),
  email: z.string().email("Geçerli bir email adresi girin").optional(),
  phoneNumber: z.string().min(10, "Geçerli bir telefon numarası girin").optional(),
  location: z.string().min(2, "Konum bilgisi en az 2 karakter olmalıdır").optional(),
});

interface User {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  location: string | null;
}

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileInfoProps {
  user: User | undefined;
  isLoading: boolean;
  onUpdate: (data: ProfileFormData) => void;
  isPending: boolean;
}

export default function ProfileInfo({ user, isLoading, onUpdate, isPending }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    onUpdate(data);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="w-1/2 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profil Bilgileri</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Düzenle
          </Button>
        )}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İsim Soyisim</FormLabel>
                  <FormControl>
                    <Input placeholder="İsim Soyisim" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konum</FormLabel>
                  <FormControl>
                    <Input placeholder="Konum" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                type="button"
              >
                İptal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">İsim Soyisim</p>
            <p>{user?.fullName || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefon</p>
            <p>{user?.phoneNumber || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Konum</p>
            <p>{user?.location || "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
}