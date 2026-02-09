// components/ui/Tabs.js
"use client";

export default function Tabs({ tabs, active, onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200
              ${isActive 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
                : "text-slate-600 hover:text-blue-500 hover:bg-slate-50"
              }
              rounded-t-lg
            `}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}