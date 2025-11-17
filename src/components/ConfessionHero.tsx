import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { submitConfession } from "../lib/api";

interface ConfessionHeroProps {
  onConfessionSubmitted?: () => void;
}

export function ConfessionHero({ onConfessionSubmitted }: ConfessionHeroProps) {
  const [confession, setConfession] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confession.trim()) {
      toast.error("Please write something before submitting");
      return;
    }

    if (confession.length > 1000) {
      toast.error("Confession is too long (max 1000 characters)");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitConfession(confession);
      toast.success("Confession submitted anonymously!");
      setConfession("");
      setIsFocused(false);
      
      // Notify parent to refresh confessions
      if (onConfessionSubmitted) {
        onConfessionSubmitted();
      }
      
      // Scroll to confessions section after a brief delay
      setTimeout(() => {
        const confessionsSection = document.getElementById("confessions");
        if (confessionsSection) {
          confessionsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (error) {
      console.error("Error submitting confession:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit confession. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="relative max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">100% Anonymous</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Bath Confessions
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Share your thoughts anonymously with the University of Bath community
          </p>
        </div>

        {/* Main confession input - inspired by ngl.link */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            className={`relative bg-[#1a1a24] rounded-3xl border-2 transition-all duration-300 ${
              isFocused 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <Textarea
              placeholder="what's on your mind?"
              value={confession}
              onChange={(e) => setConfession(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="min-h-[180px] bg-transparent border-0 text-white placeholder:text-gray-500 resize-none text-lg px-6 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={1000}
              disabled={isSubmitting}
            />
            
            <div className="px-6 pb-6 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {confession.length}/1000
              </span>
              
              <Button
                type="submit"
                disabled={isSubmitting || !confession.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 h-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Anonymously
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your identity is completely protected</span>
          </div>
        </form>
      </div>
    </section>
  );
}
