"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => {
  return (
    <div
      className="fixed top-4 right-4 z-9999 space-y-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const colors = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    warning:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        min-w-[320px] max-w-md p-4 border rounded-lg shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${colors[toast.type]}
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="shrink-0">{icons[toast.type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>
    </div>
  );
};
