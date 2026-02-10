import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = {
  title: "Login | RBM ESports",
  description: "Login to RBM ESports to join tournaments and manage your wallet."
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="card p-8 lg:p-10 border-2 border-slate-100">
            <div className="h-10 w-48 bg-slate-100 rounded mb-4 animate-pulse" />
            <div className="h-4 w-80 bg-slate-100 rounded mb-10 animate-pulse" />
            <div className="space-y-4">
              <div className="h-12 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}