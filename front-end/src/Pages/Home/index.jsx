import { useLoaderData } from "react-router-dom";
import Hero from "@/Pages/Home/common/Hero";

export default function HomePage() {
  const { heroSlide } = useLoaderData();

  return (
    <div>
      <Hero slides={heroSlide}></Hero>
    </div>
  );
}
