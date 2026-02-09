// components/ui/Card.js
"use client";

export default function Card({ 
  children, 
  className = "", 
  hover = true,
  padding = true,
  ...props 
}) {
  return (
    <div
      className={`
        card 
        ${padding ? "p-6" : ""}
        ${hover ? "hover:shadow-lg hover:-translate-y-1" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}