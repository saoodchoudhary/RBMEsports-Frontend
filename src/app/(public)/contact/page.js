import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Contact Us | RBM ESports",
  description: "Contact RBM ESports support (rbmesports.co)."
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact Us"
      subtitle="For support related to tournaments, payments, wallet, withdrawals or account access."
      lastUpdated="2026-02-10"
    >
      <h2>Support Email</h2>
      <p>
        <strong>Email:</strong> <a href="mailto:rbmesports04@gmail.com">rbmesports04@gmail.com</a>
      </p>

      <h2>Support Timing</h2>
      <p>
        <strong>Timing:</strong> 10:00 AM – 7:00 PM (IST), Monday – Saturday
      </p>

      <h2>Location</h2>
      <p>
        <strong>Country:</strong> India
      </p>

      <h2>For faster help, include</h2>
      <ul>
        <li>Registered email</li>
        <li>Tournament name/date (if applicable)</li>
        <li>Razorpay Payment ID / Order ID (if payment issue)</li>
        <li>Wallet withdrawal request details (if applicable)</li>
      </ul>
    </LegalPage>
  );
}