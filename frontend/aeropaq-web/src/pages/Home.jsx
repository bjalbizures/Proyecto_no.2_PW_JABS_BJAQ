import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import CoverageSection from "../components/CoverageSection";
import ProcessSection from "../components/ProcessSection";
import "../styles/home.css";

export default function Home() {
  return (
    <main className="home">
      <Hero />

      <ServicesSection id="servicios" />

      <CoverageSection id="cobertura" reverse={true} />

      <ProcessSection id="como-funciona" />
    </main>
  );
}
