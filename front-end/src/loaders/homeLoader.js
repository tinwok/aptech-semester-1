import { getAllServices } from "@/services/api";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/hero/gioi_thieu.png",
    title: "Professional to each corner",
    subtitle: "Premium hairstyling services.",
    cta: "ABOUT US",
    cta_link: "/about-us",
  },
  {
    id: 2,
    image: "/images/hero/staffs.png",
    title: "Professional stylist with professional personal",
    subtitle: "Excellent trained staffs",
    cta: "Staff",
    cta_link: "/staff",
  },
  {
    id: 3,
    image: "/images/hero/khong_gian_thu_gian_dang_cap.png",
    title: "Premium relaxation space",
    subtitle: "5 stars standard salon operation.",
    cta: "Salon System",
    cta_link: "/salon",
  },
  {
    id: 4,
    image: "/images/hero/hairstyling.png",
    title: "Hair Styling",
    subtitle: "Professional hair styling",
    cta: "Hair Styling Services",
    cta_link: "/services/hair-styling",
  },
  {
    id: 5,
    image: "/images/hero/skin_care.png",
    title: "Skin Care",
    subtitle: "Reborn and take care of skin face",
    cta: "Skin Care Services",
    cta_link: "/services/skin-care",
  },
  {
    id: 6,
    image: "/images/hero/beautry_treatements.png",
    title: "Beauty Treatment",
    subtitle: "Make you to be beautiful",
    cta: "Beauty Treatment Services",
    cta_link: "/services/beauty-treatment",
  },
];

export async function homeLoader() {
  let services = [];

  try {
    const result = await getAllServices();
    console.log("✅ result:", result);
    console.log("✅ result.data:", result.data);
    services = result.data;
  } catch (error) {
    console.error("❌ API error:", error); // đổi warn → error để thấy rõ
  }

  console.log("📦 services trả về:", services);
  return { heroSlides: HERO_SLIDES, services };
}
