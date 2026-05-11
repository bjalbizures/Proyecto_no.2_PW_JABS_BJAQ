import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Cotizador from "./pages/Cotizador"
import Contacto from "./pages/Contacto";
import Faq from "./pages/Faq";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { APP_ROUTES } from "./constants/routes";

export default function App() {
  return (
   <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Home />} />
        <Route path={APP_ROUTES.COTIZADOR} element={<Cotizador />} />
        <Route path={APP_ROUTES.CONTACTO} element={<Contacto />} />
        <Route path={APP_ROUTES.FAQ} element={<Faq />} />
        <Route path={APP_ROUTES.ABOUT} element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
