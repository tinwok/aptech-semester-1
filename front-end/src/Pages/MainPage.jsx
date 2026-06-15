import { useLoaderData } from "react-router-dom";
import Hero from "@/Pages/Home/common/Hero";
import ServiceSection from "@/Pages/Home/common/hair-styling/ServiceSection";
import Shop from "@/Pages/Home/common/Shop";
import Footer from "@/Pages/Home/common/Footer";
export default function MainPage() {
  const { heroSlides, services, products } = useLoaderData();

  return (
    <div>
      <Hero slides={heroSlides} />
      <ServiceSection services={services} />
      <Shop products={products} />
      <Footer />
    </div>
  );
}
