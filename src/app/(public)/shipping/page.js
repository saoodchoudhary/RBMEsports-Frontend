import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Shipping & Delivery Policy | RBM ESports",
  description: "Shipping/Delivery policy for rbmesports.co (digital services only)."
};

export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping & Delivery Policy"
      subtitle="RBM ESports is a digital service platform. No physical goods are shipped."
      lastUpdated="2026-02-10"
    >
      <h2>No physical shipping</h2>
      <p>
        RBM ESports (rbmesports.co) provides digital services such as tournament registration, participation access,
        results publishing, and wallet features. <strong>No physical products</strong> are delivered or shipped.
      </p>

      <h2>Digital service delivery</h2>
      <ul>
        <li>After successful registration/payment verification, access/confirmation is shown on the website.</li>
        <li>Room details (if applicable) are provided as per tournament schedule.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        For delivery/access issues contact: <strong>rbmesports04@gmail.com</strong>
      </p>
    </LegalPage>
  );
}