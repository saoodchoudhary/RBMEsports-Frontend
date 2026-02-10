import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy | RBM ESports",
  description: "Privacy Policy for rbmesports.co (RBM ESports)."
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="This Privacy Policy explains what data we collect, why we collect it, and how we protect it on rbmesports.co."
      lastUpdated="2026-02-10"
    >
      <h2>1. Overview</h2>
      <p>
        RBM ESports (rbmesports.co) is a <strong>skill-based esports tournament platform</strong> for BGMI.
        We do <strong>not</strong> provide gambling, betting, lottery, or chance-based games.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li><strong>Account info:</strong> name, email, encrypted/hashed password (if applicable), profile image (optional).</li>
        <li><strong>Gaming profile:</strong> BGMI ID, in-game name (IGN).</li>
        <li><strong>Contact info:</strong> phone number (if provided) for verification/support/withdrawals.</li>
        <li><strong>Payments & wallet:</strong> payment reference IDs, order IDs, status, and wallet ledger history.</li>
        <li><strong>Technical/log info:</strong> IP address, device/browser details, timestamps for security and troubleshooting.</li>
      </ul>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To create/manage your account and tournament participation.</li>
        <li>To verify payments and maintain wallet transactions.</li>
        <li>To prevent fraud, abuse, and enforce fair play rules.</li>
        <li>To respond to support requests.</li>
      </ul>

      <h2>4. Email & phone usage</h2>
      <ul>
        <li><strong>Email:</strong> login, tournament confirmations, support communication.</li>
        <li><strong>Phone:</strong> verification/support and withdrawal processing communication (if required).</li>
      </ul>

      <h2>5. Payment information handling (Razorpay)</h2>
      <p>
        Payments are processed by Razorpay. We do <strong>not store</strong> your card/UPI PIN or sensitive payment credentials.
        Razorpay securely handles payment details. We may store limited payment references
        (e.g., Razorpay payment ID/order ID/status) for reconciliation and support.
      </p>

      <h2>6. Cookies / session storage</h2>
      <p>
        We may use cookies/local storage for authentication sessions and to improve user experience.
        We may also use basic analytics to improve performance.
      </p>

      <h2>7. Data security</h2>
      <ul>
        <li>Passwords are stored securely (hashed/encrypted; never stored in plain text).</li>
        <li>Access to admin functions is restricted.</li>
        <li>We follow reasonable security practices to protect data.</li>
      </ul>

      <h2>8. Data sharing</h2>
      <p>
        We do not sell personal data. Data may be shared with service providers like payment gateways only to provide services,
        or when required by law.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have questions, contact us:
        <br />
        <strong>Email:</strong> rbmesports04@gmail.com
      </p>
    </LegalPage>
  );
}