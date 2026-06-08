import { useLoaderData } from "react-router-dom";
import Hero from "@/components/Main/common/Hero";

function MainPage() {
  const { heroSlides } = useLoaderData();
  return (
    <div>
      <Hero slides={heroSlides} />
      {/* Anh thien quang het may component con vao main page */}
      {/* <Hero></Hero>
  <Services></Services>
  <Footer></Footer> */}
    </div>
  );
}

export default MainPage;
