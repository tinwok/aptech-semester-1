import { useLoaderData } from "react-router-dom";
import Hero from "@/components/Main/common/Hero";

export default function MainPage() {
  const { heroSlides, services } = useLoaderData();

  return (
    <div>
      <Hero slides={heroSlides} />
      {/* HairStylingSection, Shop sẽ thêm sau */}
    </div>
  );
}
