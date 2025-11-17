import { useState, useEffect } from "react";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Confession, toggleLike, getUserId, getTimeAgo } from "../lib/api";
import { toast } from "sonner@2.0.3";

interface ConfessionCardProps {
  confession: Confession;
  onLikeUpdate?: (confessionId: string, newLikes: number) => void;
}

export function ConfessionCard({ confession, onLikeUpdate }: ConfessionCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(confession.likes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // Check if current user has liked this confession
    const userId = getUserId();
    setLiked(confession.likedBy?.includes(userId) || false);
    setLikeCount(confession.likes);
  }, [confession]);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
    // Optimistic update
    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newLikeCount);
    
    try {
      const updatedConfession = await toggleLike(confession.id);
      setLikeCount(updatedConfession.likes);
      
      // Notify parent component
      if (onLikeUpdate) {
        onLikeUpdate(confession.id, updatedConfession.likes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikeCount(likeCount);
      toast.error("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="group bg-[#1a1a24] rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all duration-300 p-6 hover:shadow-lg hover:shadow-blue-500/5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🎭</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm">Anonymous</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTimeAgo(confession.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
        {confession.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`gap-2 rounded-full transition-all ${
            liked 
              ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" 
              : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm">{likeCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{confession.comments}</span>
        </Button>
      </div>
    </div>
  );
}
