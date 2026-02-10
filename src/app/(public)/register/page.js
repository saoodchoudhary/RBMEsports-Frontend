import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata = {
  title: "Register | RBM ESports",
  description: "Create an account on RBM ESports to join BGMI tournaments."
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterClient />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="card p-8 border-2 border-slate-100">
          <div className="h-10 w-56 bg-slate-100 rounded mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-12 bg-slate-100 rounded mt-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}