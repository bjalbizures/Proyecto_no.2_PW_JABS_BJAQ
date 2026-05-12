export default function BenefitItem({ icon, title, description }) {
  return (
    <div className="benefit-item">
      <span className="benefit-icon">{icon}</span>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
