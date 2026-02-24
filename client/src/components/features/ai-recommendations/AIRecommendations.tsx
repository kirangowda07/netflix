import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { RecommendationsService } from '../../services/recommendationsService';
import { AIRecommendation, Content } from '../../types';
import GlassCard from '../ui/GlassCard';

interface AIRecommendationsProps {
  userId: number;
  limit?: number;
  title?: string;
  showFeedback?: boolean;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  userId,
  limit = 10,
  title = "AI Recommended For You",
  showFeedback = true
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch recommendations on component mount
  useEffect(() => {
    fetchRecommendations();
  }, [userId, limit]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await RecommendationsService.getRecommendations(userId, 'collaborative');
      
      if (response.success && response.data) {
        setRecommendations(response.data.slice(0, limit));
      } else {
        setError(response.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (recommendationId: number, feedback: 'like' | 'dislike' | 'not_interested') => {
    try {
      await RecommendationsService.submitFeedback({
        recommendationId,
        feedback,
        userId
      });
      
      // Update local state to reflect feedback
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === recommendationId 
            ? { ...rec, hasFeedback: true, userFeedback: feedback }
            : rec
        )
      );
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const scrollLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex(prev => Math.min(recommendations.length - 1, prev + 1));
  };

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'collaborative': return 'bg-blue-600';
      case 'content_based': return 'bg-green-600';
      case 'trending': return 'bg-red-600';
      case 'similar': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case 'collaborative': return 'Based on similar users';
      case 'content_based': return 'Based on your watch history';
      case 'trending': return 'Trending now';
      case 'similar': return 'Similar to what you watched';
      default: return 'Recommended';
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-36 bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <GlassCard className="p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </GlassCard>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <GlassCard className="p-4 text-center">
          <p className="text-gray-400">No recommendations available yet. Watch more content to get personalized suggestions!</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-black/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            disabled={currentIndex >= recommendations.length - 1}
            className="p-2 rounded-full bg-black/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex space-x-4 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 280}px)` }}
        >
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="flex-shrink-0 w-64 group cursor-pointer"
            >
              <GlassCard className="overflow-hidden hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  <img
                    src={recommendation.content.thumbnail}
                    alt={recommendation.content.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {recommendation.content.title}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {recommendation.content.releaseYear} • {recommendation.content.rating}
                      </p>
                    </div>
                  </div>
                  
                  {/* Recommendation type badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getRecommendationTypeColor(recommendation.recommendationType)}`}>
                    {getRecommendationTypeLabel(recommendation.recommendationType)}
                  </div>

                  {/* Recommendation score */}
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    {Math.round(recommendation.recommendationScore * 100)}% match
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-1">
                    {recommendation.content.title}
                  </h3>
                  
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                    {recommendation.content.description}
                  </p>

                  {/* Genre tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recommendation.content.genre.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Feedback buttons */}
                  {showFeedback && !recommendation.hasFeedback && (
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'like')}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                          title="Like this recommendation"
                        >
                          <ThumbsUp size={16} className="text-green-400" />
                        </button>
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'dislike')}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                          title="Dislike this recommendation"
                        >
                          <ThumbsDown size={16} className="text-red-400" />
                        </button>
                        <button
                          onClick={() => handleFeedback(recommendation.id, 'not_interested')}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                          title="Not interested"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {Math.round(recommendation.recommendationScore * 100)}% match
                      </span>
                    </div>
                  )}

                  {recommendation.hasFeedback && (
                    <div className="text-xs text-green-400">
                      ✓ Feedback submitted
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
