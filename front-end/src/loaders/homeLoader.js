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
    subtitle: "5 starts standard salon operation.",
    cta: "salon operation.",
  },
  {
    id: 4,
    image: "/images/hero/hairstyling.png",
    title: "Hair styling",
    subtitle: "Professional hair styling",
    cta: "Hair styling",
    cta_link: "/services/hair-styling",
  },
  {
    id: 5,
    image: "/images/hero/skin_care.png",
    title: "Skin care",
    subtitle: "Reborn and take care of skin face",
    cta: "Skin care services",
    cta_link: "/services/skin-care",
  },
  {
    id: 6,
    image: "/images/hero/beautry_treatements.png",
    title: "Beauty treatment",
    subtitle: "Make you to be beautiful",
    cta: "Beauty treatment services",
    cta_link: "/services/beauty-treatment",
  },
];

export async function homeLoader() {
  const services = await getAllServices();
  return {
    heroSlides: HERO_SLIDES,
    services: services.data,
  };
}
