import { useAuth } from "../hooks/useAuth";

export default function CustomerShipments() {
  const { user } = useAuth();

  return (
    <main className="auth-page">
      <section className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <p className="ui-eyebrow">Cliente</p>
          <h1>Mis envios</h1>
          <p>{user?.fullName}, aqui conectaremos el listado y creacion de tus envios.</p>
        </div>
      </section>
    </main>
  );
}
