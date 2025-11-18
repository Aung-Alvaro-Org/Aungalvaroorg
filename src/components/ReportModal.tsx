import { useState } from "react";
import { X, Flag } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  confessionId: string;
}

export function ReportModal({ isOpen, onClose, confessionId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Spam or misleading",
    "Violence or dangerous content",
    "Sexually explicit content",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      toast.error("Please provide details");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Report submitted. Thank you for keeping our community safe.");
    setIsSubmitting(false);
    setSelectedReason("");
    setOtherReason("");
    onClose();
  };

  const handleClose = () => {
    setSelectedReason("");
    setOtherReason("");
    onClose();
  };

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
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-[#1a1a24] rounded-3xl border-2 border-gray-800 max-w-lg w-full shadow-2xl shadow-orange-500/10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Flag className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-white text-xl">Report Confession</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Help us understand what's wrong with this confession.
              </p>

              {/* Report Reasons */}
              <div className="space-y-2 mb-6">
                {reportReasons.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer active:scale-98 ${
                      selectedReason === reason
                        ? "bg-orange-500/10 border-orange-500/50"
                        : "bg-[#0f0f1a] border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-4 h-4 text-orange-500 border-gray-600 focus:ring-orange-500 focus:ring-offset-0 bg-transparent"
                    />
                    <span className="text-gray-300">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Other Reason Text Input */}
              {selectedReason === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Textarea
                    placeholder="Please provide details..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="bg-[#0f0f1a] border-gray-800 text-white placeholder:text-gray-500 resize-none min-h-[100px] rounded-xl focus:border-orange-500/50"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {otherReason.length}/500
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedReason}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
