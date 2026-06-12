import { useLoaderData } from "react-router-dom";
import Hero from "./Hero";
import ServicesSection from "./ServicesSection";

export default function HomePage() {
  const { heroSlides, services } = useLoaderData();
  return (
    <div>
      <Hero slides={heroSlides} />
      <ServicesSection services={services} />
    </div>
  );
}
