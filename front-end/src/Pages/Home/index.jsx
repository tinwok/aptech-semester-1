import { useLoaderData } from "react-router-dom";
import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import Shop from "./Shop";

export default function HomePage() {
  const { heroSlides, services, products } = useLoaderData();
  return (
    <div>
      <Hero slides={heroSlides} />
      <ServicesSection services={services} />
      <Shop products={products} />
    </div>
  );
}
