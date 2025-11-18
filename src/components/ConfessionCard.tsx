import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Flag } from "lucide-react";
import { Button } from "./ui/button";
import { Confession, toggleLike, getUserId, getTimeAgo } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { ConfessionModal } from "./ConfessionModal";
import { ShareDialog } from "./ShareDialog";
import { ReportModal } from "./ReportModal";

interface ConfessionCardProps {
  confession: Confession;
  onLikeUpdate?: (confessionId: string, newLikes: number) => void;
}

export function ConfessionCard({ confession, onLikeUpdate }: ConfessionCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(confession.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    setLiked(confession.likedBy?.includes(userId) || false);
    setLikeCount(confession.likes);
  }, [confession]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    
    try {
      const updatedConfession = await toggleLike(confession.id);
      setLikeCount(updatedConfession.likes);
      
      if (onLikeUpdate) {
        onLikeUpdate(confession.id, updatedConfession.likes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked(!newLiked);
      setLikeCount(likeCount);
      toast.error("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReportOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const shouldTruncate = confession.content.length > 150;

  return (
    <>
      <div 
        className="group bg-[#1a1a24] rounded-2xl border-2 border-gray-800/50 hover:border-blue-500/40 transition-all duration-300 p-5 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer flex flex-col h-[280px]"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 text-sm">Anonymous</p>
            <p className="text-xs text-gray-600">{getTimeAgo(confession.timestamp)}</p>
          </div>
        </div>

        {/* Content - Fixed height with overflow */}
        <div className="flex-1 mb-3 overflow-hidden">
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-5">
            {truncateText(confession.content)}
          </p>
        </div>

        {shouldTruncate && (
          <button 
            className="text-blue-400 hover:text-blue-300 text-xs mb-2 transition-colors text-left active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            Read more
          </button>
        )}

        {/* Actions - Fixed at bottom */}
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-gray-800/50 mt-auto">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleLike}
            disabled={isLiking}
            className={`gap-2 rounded-full transition-all h-11 px-4 active:scale-95 ${
              liked 
                ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" 
                : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="gap-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all h-11 px-4 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{confession.comments}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleShare}
            className="gap-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all h-11 px-4 active:scale-95"
          >
            <Share2 className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleReport}
            className="gap-2 text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition-all h-11 px-4 ml-auto active:scale-95"
          >
            <Flag className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ConfessionModal
        confession={confession}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLikeUpdate={onLikeUpdate}
        liked={liked}
        likeCount={likeCount}
      />

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        confessionId={confession.id}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        confessionId={confession.id}
      />
    </>
  );
}