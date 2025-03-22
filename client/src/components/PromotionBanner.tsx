export default function PromotionBanner() {
  return (
    <div className="px-4 py-2">
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1595218031530-abb1e3e5b049?w=800&h=200&fit=crop&crop=focalpoint&auto=format"
          alt="Special promotion"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#D6C3E5]/70 to-transparent flex flex-col justify-center pl-6">
          <h3 className="text-white text-lg font-bold font-playfair">Summer Specials</h3>
          <p className="text-white text-sm">30% off all nail art services</p>
          <button className="bg-white text-[#D6C3E5] text-xs font-bold px-4 py-1 rounded-full mt-2 w-28 hover:bg-[#F5F1EB] transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
