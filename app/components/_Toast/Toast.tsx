"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect } from "react";

type ToastType = "success" | "error" | "warning" | "info";

type Props = {
    open: boolean;
    onClose: () => void;
    type?: ToastType;
    duration?: number;
    children: React.ReactNode;
};

const iconMap = {
    success: <CheckCircle className="text-green-500" size={22} />,
    error: <XCircle className="text-red-500" size={22} />,
    warning: <AlertTriangle className="text-yellow-500" size={22} />,
    info: <Info className="text-blue-500" size={22} />,
};

const borderMap = {
    success: "border-green-500/40",
    error: "border-red-500/40",
    warning: "border-yellow-500/40",
    info: "border-blue-500/40",
};

export default function Toast({
    open,
    onClose,
    type = "info",
    duration = 2500,
    children,
}: Props) {
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [open, duration, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -30, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -30, x: "-50%" }}
                    transition={{ duration: 0.25 }}
                    className={`fixed top-6 left-1/2 z-50 bg-white 
            shadow-2xl rounded-2xl px-6 py-4 
            border ${borderMap[type]}
            w-[90%] max-w-sm`}
                >
                    <div className="flex items-center gap-4">
                        <div className="shrink-0">{iconMap[type]}</div>
                        <div className="flex-1">{children}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
