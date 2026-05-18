import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Cotizador from "./pages/Cotizador"
import Contacto from "./pages/Contacto";
import Faq from "./pages/Faq";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerShipments from "./pages/CustomerShipments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SentryLab from "./pages/SentryLab";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { APP_ROUTES } from "./constants/routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
   <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<Home />} />
          <Route path={APP_ROUTES.COTIZADOR} element={<Cotizador />} />
          <Route path={APP_ROUTES.CONTACTO} element={<Contacto />} />
          <Route path={APP_ROUTES.FAQ} element={<Faq />} />
          <Route path={APP_ROUTES.ABOUT} element={<About />} />
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.REGISTER} element={<Register />} />
          <Route path={APP_ROUTES.SENTRY_LAB} element={<SentryLab />} />
          <Route
            path={APP_ROUTES.CUSTOMER_SHIPMENTS}
            element={(
              <ProtectedRoute allowedRoles={["customer", "admin"]}>
                <CustomerShipments />
              </ProtectedRoute>
            )}
          />
          <Route
            path={APP_ROUTES.ADMIN_DASHBOARD}
            element={(
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
