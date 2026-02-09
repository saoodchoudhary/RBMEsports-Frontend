// components/ui/Select.js
"use client";

export default function Select({
  label,
  options,
  error,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={`
          input
          ${error ? "border-red-500" : ""}
          ${className}
        `}
        {...props}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}