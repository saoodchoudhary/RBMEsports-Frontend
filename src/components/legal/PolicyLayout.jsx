export default function PolicyLayout({ title, subtitle, children, lastUpdated = "2026-02-10" }) {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
          <div className="mt-4 text-xs text-slate-500">
            Last updated: <span className="font-semibold">{lastUpdated}</span>
          </div>
        </header>

        <main className="card p-6 prose prose-slate max-w-none">
          {children}
        </main>

        <div className="text-xs text-slate-500">
          Note: This page is provided for transparency and Razorpay compliance. If you have questions, contact us.
        </div>
      </div>
    </div>
  );
}