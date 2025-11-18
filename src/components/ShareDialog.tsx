import { useState } from "react";
import { X, Link, Check, MessageSquare, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  confessionId: string;
}

export function ShareDialog({ isOpen, onClose, confessionId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}#confession-${confessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };

  const shareOptions = [
    { icon: MessageSquare, label: "Messages", color: "text-green-400" },
    { icon: Instagram, label: "Instagram", color: "text-pink-400" },
    { icon: Twitter, label: "Twitter", color: "text-blue-400" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-[#1a1a24] rounded-3xl border-2 border-gray-800 max-w-md w-full shadow-2xl shadow-blue-500/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-white text-xl mb-6 text-center">Share Confession</h3>

              {/* Copy Link Button */}
              <Button
                onClick={handleCopyLink}
                className={`w-full h-14 rounded-2xl mb-6 transition-all active:scale-98 ${
                  copied
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a24] text-gray-500">or share via</span>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.label}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#0f0f1a] hover:bg-[#252530] border border-gray-800 hover:border-gray-700 transition-all active:scale-95"
                  >
                    <div className={`${option.color}`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-gray-400">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
