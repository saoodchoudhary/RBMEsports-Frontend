import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Refund & Cancellation Policy | RBM ESports",
  description: "Refund & Cancellation Policy for rbmesports.co."
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      subtitle="Refund rules for entry/service fees and tournament cancellations on rbmesports.co."
      lastUpdated="2026-02-10"
    >
      <h2>1. Platform type</h2>
      <p>
        RBM ESports provides <strong>skill-based BGMI tournaments</strong>. We do not provide gambling or betting.
        Entry/service fees (if any) are for organizing tournaments and providing digital services.
      </p>

      <h2>2. When refunds may be applicable</h2>
      <ul>
        <li><strong>Tournament cancelled by organizer:</strong> Full refund of entry fee may be issued.</li>
        <li><strong>Match cancelled due to operational/technical reasons:</strong> Refund may be issued based on verification.</li>
      </ul>

      <h2>3. When refunds are NOT applicable</h2>
      <ul>
        <li><strong>No-show / user cancellation:</strong> Generally non-refundable after registration confirmation.</li>
        <li><strong>Disqualification due to cheating/abuse/rule violation:</strong> No refund.</li>
      </ul>

      <h2>4. Refund timeline</h2>
      <p>
        If approved, refunds are usually processed within <strong>5–7 business days</strong>. Timeline depends on banks/payment method.
      </p>

      <h2>5. Contact for refunds</h2>
      <p>
        Email <strong>rbmesports04@gmail.com</strong> with your registered email and payment/order details.
      </p>

      <h2>6. Final decision</h2>
      <p>
        Refund decisions are made after verification of tournament/payment records. Organizer/admin decision is final.
      </p>
    </LegalPage>
  );
}