import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeSections from "@/components/HomeSections";
import HomeFooter from "@/components/HomeFooter";

export default function Home() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <HomeSections />
      <HomeFooter />
    </div>
  );
}
