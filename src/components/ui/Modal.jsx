// components/ui/Modal.js
"use client";

import { FiX } from "react-icons/fi";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Container - ABSOLUTELY CENTERED */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className={`${sizeClasses[size]} w-full animate-scaleIn`}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    aria-label="Close modal"
                  >
                    <FiX className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Create portal to render at document body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}