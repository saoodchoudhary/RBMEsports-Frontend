// components/ui/ToastProvider.js
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "@/store/uiSlice";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
  FiX
} from "react-icons/fi";

export default function ToastProvider() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return;
    
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const toastConfig = {
    success: {
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: <FiCheckCircle className="w-5 h-5" />,
      textColor: "text-white"
    },
    error: {
      bgColor: "bg-gradient-to-r from-red-500 to-rose-600",
      icon: <FiXCircle className="w-5 h-5" />,
      textColor: "text-white"
    },
    warning: {
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      icon: <FiAlertCircle className="w-5 h-5" />,
      textColor: "text-white"
    },
    info: {
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      icon: <FiInfo className="w-5 h-5" />,
      textColor: "text-white"
    },
    default: {
      bgColor: "bg-gradient-to-r from-slate-700 to-slate-800",
      icon: null,
      textColor: "text-white"
    }
  };

  const config = toastConfig[toast.type] || toastConfig.default;

  return (
    <div className="fixed z-[9999] top-4 right-4 left-4 md:left-auto md:max-w-md">
      <div className={`rounded-xl shadow-2xl ${config.bgColor} text-white overflow-hidden animate-slideIn`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {config.icon && (
              <div className="flex-shrink-0 mt-0.5">
                {config.icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="font-bold text-sm mb-1">{toast.title}</div>
              )}
              {toast.message && (
                <div className="text-sm opacity-90">{toast.message}</div>
              )}
            </div>
            
            <button
              onClick={() => dispatch(clearToast())}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        {toast.duration && (
          <div className="h-1 bg-white/20 overflow-hidden">
            <div 
              className="h-full bg-white/50 animate-progress"
              style={{ 
                animationDuration: `${toast.duration}ms`,
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}