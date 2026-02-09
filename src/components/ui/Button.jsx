// components/ui/Button.js
"use client";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "", 
  disabled = false,
  loading = false,
  ...props 
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg",
    outline: "btn-outline",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700"
  };

  return (
    <button
      className={`
        btn 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}