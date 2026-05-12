import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <p className="ui-eyebrow">Panel interno</p>
          <h1>Dashboard administrativo</h1>
          <p>{user?.fullName}, aqui conectaremos metricas, usuarios y envios.</p>
        </div>
      </section>
    </main>
  );
}
