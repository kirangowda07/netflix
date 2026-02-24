import axios, { AxiosRequestConfig } from 'axios';
import { 
  AIRecommendation, 
  RecommendationFeedback, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// AI Recommendations API Service
export class RecommendationsService {
  /**
   * Get personalized recommendations for a user
   */
  static async getRecommendations(
    userId: number, 
    type?: 'collaborative' | 'content_based' | 'trending' | 'similar'
  ): Promise<ApiResponse<AIRecommendation[]>> {
    try {
      const params = type ? { type } : {};
      const response = await apiClient.get(`/recommendations/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get trending content recommendations
   */
  static async getTrendingRecommendations(
    limit: number = 20
  ): Promise<ApiResponse<AIRecommendation[]>> {
    try {
      const response = await apiClient.get('/recommendations/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending recommendations:', error);
      throw error;
    }
  }

  /**
   * Submit feedback for recommendations
   */
  static async submitFeedback(
    feedback: RecommendationFeedback
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/recommendations/feedback', feedback);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Get similar content based on a specific content ID
   */
  static async getSimilarContent(
    contentId: number,
    limit: number = 10
  ): Promise<ApiResponse<AIRecommendation[]>> {
    try {
      const response = await apiClient.get(`/recommendations/similar/${contentId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching similar content:', error);
      throw error;
    }
  }

  /**
   * Update recommendation algorithm preferences
   */
  static async updatePreferences(
    userId: number,
    preferences: {
      watchHistoryWeight: number;
      genrePreferences: Record<string, number>;
      contentTypes: Record<string, number>;
    }
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put(`/recommendations/preferences/${userId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export default RecommendationsService;
