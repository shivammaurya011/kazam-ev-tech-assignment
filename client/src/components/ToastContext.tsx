import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-4 py-3 rounded-md shadow-md flex items-center gap-2 ${
                type === "success" ? "bg-green-500 text-white" :
                type === "error" ? "bg-red-500 text-white" :
                "bg-blue-500 text-white"
              }`}
            >
              <span>{message}</span>
              <button onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== id))}>
                <AiOutlineClose className="text-lg" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
