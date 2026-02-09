// components/ui/Badge.js
"use client";

export default function Badge({ 
  children, 
  variant = "primary",
  className = "" 
}) {
  const variantClasses = {
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    secondary: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800"
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}