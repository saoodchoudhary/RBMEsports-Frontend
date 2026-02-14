"use client";

import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="card p-6 border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">Payments</h1>
        <p className="mt-2 text-sm text-slate-600">
          This page has been disabled. Payments are now handled inside the tournament join flow (manual UPI popup).
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => router.push("/tournaments")}>
            Go to Tournaments
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}