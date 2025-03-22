import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface User {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  location: string | null;
}

// Form validation schema
const profileSchema = z.object({
  fullName: z.string().min(3, "İsim en az 3 karakter olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  phoneNumber: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
  location: z.string().min(3, "Konum bilgisi en az 3 karakter olmalıdır."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileInfoProps {
  user: User | undefined;
  isLoading: boolean;
  onUpdate: (data: ProfileFormData) => void;
  isPending: boolean;
}

export default function ProfileInfo({ user, isLoading, onUpdate, isPending }: ProfileInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
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
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            İsim Soyisim
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6C3E5] focus:border-[#D6C3E5]"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6C3E5] focus:border-[#D6C3E5]"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            id="phoneNumber"
            type="tel"
            {...register("phoneNumber")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6C3E5] focus:border-[#D6C3E5]"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Konum
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#D6C3E5] focus:border-[#D6C3E5]"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-[#D6C3E5] text-white rounded-md shadow-sm hover:bg-[#D6C3E5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6C3E5] disabled:opacity-50"
        >
          {isPending ? "Güncelleniyor..." : "Profili Güncelle"}
        </button>
      </form>
    </div>
  );
}