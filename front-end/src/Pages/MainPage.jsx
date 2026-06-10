import { useLoaderData } from "react-router-dom";
import Hero from "@/components/Main/common/Hero";
import ServiceSection from "@/components/Main/common/hair-styling/ServiceSection";
import Shop from "@/components/Main/common/Shop";
import Footer from "@/components/Main/common/Footer";

export default function MainPage() {
  const { heroSlides, services, hairProducts, skinProducts } = useLoaderData();

  return (
    <div>
      <Hero slides={heroSlides} />
      <ServiceSection sevices={services} />
      <Shop hairProducts={hairProducts} skinProducts={skinProducts} />
      <Footer />
    </div>
  );
}
