import { useState, useEffect } from "react";
import { ConfessionCard } from "./ConfessionCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { TrendingUp, Clock, Heart, RefreshCw, AlertCircle } from "lucide-react";
import { Confession, getConfessions } from "../lib/api";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface ConfessionsSectionProps {
  refreshTrigger?: number;
}

export function ConfessionsSection({ refreshTrigger }: ConfessionsSectionProps) {
  const [activeTab, setActiveTab] = useState("trending");
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(20);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchConfessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getConfessions();
      setConfessions(data);
    } catch (err) {
      console.error("Error fetching confessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load confessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, [refreshTrigger]);

  const handleLikeUpdate = (confessionId: string, newLikes: number) => {
    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confessionId ? { ...c, likes: newLikes } : c
      )
    );
  };

  const getSortedConfessions = (sortType: string) => {
    const sorted = [...confessions];
    
    switch (sortType) {
      case "trending":
        return sorted.sort((a, b) => {
          const aScore = a.likes + (a.comments * 2);
          const bScore = b.likes + (b.comments * 2);
          return bScore - aScore;
        });
      case "recent":
        return sorted.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case "popular":
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  };

  const handleTabChange = (newTab: string) => {
    setIsAnimating(true);
    setActiveTab(newTab);
    setDisplayCount(20);
    setTimeout(() => setIsAnimating(false), 100);
  };

  const sortedConfessions = getSortedConfessions(activeTab);
  const displayedConfessions = sortedConfessions.slice(0, displayCount);
  const hasMore = displayCount < sortedConfessions.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="confessions" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-white mb-2 text-3xl">
              Community Confessions
            </h2>
            <p className="text-gray-500">
              Read what others are sharing anonymously
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1a1a24] rounded-2xl border border-gray-800 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-800/50">
                  <div className="h-12 bg-gray-700 rounded-full w-20"></div>
                  <div className="h-12 bg-gray-700 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="confessions" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-white mb-2 text-3xl">
              Community Confessions
            </h2>
            <p className="text-gray-500">
              Read what others are sharing anonymously
            </p>
          </div>

          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white mb-2">
              Failed to Load Confessions
            </h3>
            <p className="text-gray-500 mb-6">
              {error}
            </p>
            <Button
              onClick={fetchConfessions}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (confessions.length === 0) {
    return (
      <section id="confessions" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-white mb-2 text-3xl">
              Community Confessions
            </h2>
            <p className="text-gray-500">
              Read what others are sharing anonymously
            </p>
          </div>

          <div className="max-w-md mx-auto text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-white mb-2">
              No Confessions Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share something anonymously with the Bath community!
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Submit First Confession
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confessions" className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1 text-3xl">
              Community Confessions
            </h2>
            <p className="text-gray-500">
              Read what others are sharing anonymously
            </p>
          </div>
          <Button
            onClick={fetchConfessions}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-[#1a1a24] border border-gray-800 p-1 mb-8 h-auto">
            <TabsTrigger 
              value="trending" 
              className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-3 text-gray-400"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-3 text-gray-400"
            >
              <Clock className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-3 text-gray-400"
            >
              <Heart className="w-4 h-4" />
              Most Popular
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedConfessions.map((confession, index) => (
                  <motion.div
                    key={confession.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: isAnimating ? 0 : index * 0.05,
                    }}
                  >
                    <ConfessionCard 
                      confession={confession}
                      onLikeUpdate={handleLikeUpdate}
                    />
                  </motion.div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}
