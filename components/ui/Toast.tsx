"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, message.duration || 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const iconSrc = {
    success: "/success.png",
    error: "/error.png",
    warning: "/warning.png",
    info: "/info.png",
  } as const;

  const colors = {
    success: "border-green-500 bg-green-500/10",
    error: "border-red-500 bg-red-500/10",
    warning: "border-yellow-500 bg-yellow-500/10",
    info: "border-blue-500 bg-blue-500/10",
  };

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border ${colors[message.type]} backdrop-blur-sm animate-slide-in-right`}
    >
      <Image
        src={iconSrc[message.type]}
        alt={message.type}
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-heading">{message.title}</h4>
        {message.description && (
          <p className="text-sm text-body mt-1">{message.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onClose(message.id)}
        className="text-body hover:text-heading transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastMessage>) => {
      setToasts((prev) => [...prev, event.detail]);
    };

    window.addEventListener(
      "showToast" as keyof WindowEventMap,
      handleToast as EventListener
    );
    return () =>
      window.removeEventListener(
        "showToast" as keyof WindowEventMap,
        handleToast as EventListener
      );
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-32 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

// Helper function to show toast
export function showToast(message: Omit<ToastMessage, "id">) {
  const event = new CustomEvent("showToast", {
    detail: {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
    },
  });
  window.dispatchEvent(event);
}
