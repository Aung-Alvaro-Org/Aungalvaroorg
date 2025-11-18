import { useState, useEffect } from "react";
import { X, Heart, MessageCircle, Share2, Flag, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Confession, Comment, toggleLike, getTimeAgo, getComments, submitComment } from "../lib/api";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { ShareDialog } from "./ShareDialog";
import { ReportModal } from "./ReportModal";

interface ConfessionModalProps {
  confession: Confession;
  isOpen: boolean;
  onClose: () => void;
  onLikeUpdate?: (confessionId: string, newLikes: number) => void;
  liked: boolean;
  likeCount: number;
}

export function ConfessionModal({
  confession,
  isOpen,
  onClose,
  onLikeUpdate,
  liked: initialLiked,
  likeCount: initialLikeCount,
}: ConfessionModalProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, confession.id]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const fetchedComments = await getComments(confession.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
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

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleReport = () => {
    setIsReportOpen(true);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      const newComment = await submitComment(confession.id, commentText);
      setComments([newComment, ...comments]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-[#1a1a24] rounded-3xl border-2 border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-blue-500/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-xl text-white">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white">Anonymous</p>
                      <p className="text-sm text-gray-500">{getTimeAgo(confession.timestamp)}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap mb-8">
                    {confession.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pb-6 border-b border-gray-800/50">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleLike}
                      disabled={isLiking}
                      className={`gap-2 rounded-full transition-all h-12 px-5 active:scale-95 ${
                        liked 
                          ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" 
                          : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                      <span>{likeCount}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all h-12 px-5 active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{comments.length}</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="lg"
                      onClick={handleShare}
                      className="gap-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-all h-12 px-5 active:scale-95"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="lg"
                      onClick={handleReport}
                      className="gap-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-full transition-all h-12 px-5 ml-auto active:scale-95"
                    >
                      <Flag className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6">
                    <h3 className="text-white mb-4">
                      Comments ({comments.length})
                    </h3>

                    {/* Comment Input */}
                    <form onSubmit={handleCommentSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white">A</span>
                        </div>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="bg-[#0f0f1a] border-gray-800 text-white placeholder:text-gray-500 resize-none min-h-[80px] rounded-xl focus:border-blue-500/50 transition-all"
                            maxLength={500}
                            disabled={isSubmittingComment}
                          />
                          <Button
                            type="submit"
                            disabled={!commentText.trim() || isSubmittingComment}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10 p-0 self-end disabled:opacity-50 transition-all active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </form>

                    {/* Comments List */}
                    {isLoadingComments ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading comments...
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to comment!
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence>
                          {comments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className="flex gap-3"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-white">A</span>
                              </div>
                              <div className="flex-1 bg-[#0f0f1a] rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm text-gray-300">Anonymous</span>
                                  <span className="text-xs text-gray-600">•</span>
                                  <span className="text-xs text-gray-600">{getTimeAgo(comment.timestamp)}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        confessionId={confession.id}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        confessionId={confession.id}
      />
    </>
  );
}
