import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "About Us | RBM ESports",
  description: "About RBM ESports (rbmesports.co)."
};

export default function AboutPage() {
  return (
    <LegalPage
      title="About RBM ESports"
      subtitle="RBM ESports is a skill-based BGMI tournament platform built for competitive players."
      lastUpdated="2026-02-10"
    >
      <h2>Who we are</h2>
      <p>
        RBM ESports (rbmesports.co) is a competitive esports platform where players participate in BGMI tournaments.
        Our focus is on fair play, verified results, and a secure payment/wallet system.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Host and manage skill-based BGMI tournaments</li>
        <li>Verify results and publish winners</li>
        <li>Provide wallet-based prize crediting and withdrawal requests</li>
      </ul>

      <h2>No gambling / no betting</h2>
      <p>
        RBM ESports is strictly a <strong>skill-based esports tournament</strong> platform.
        We do not provide betting or gambling services.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Email:</strong> rbmesports04@gmail.com
      </p>
    </LegalPage>
  );
}