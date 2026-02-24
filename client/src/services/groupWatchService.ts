import axios, { AxiosRequestConfig } from 'axios';
import { 
  WatchRoom, 
  WatchRoomParticipant, 
  ChatMessage, 
  ApiResponse 
} from '../types';

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

// Group Watch Rooms API Service
export class GroupWatchService {
  /**
   * Create a new watch room
   */
  static async createWatchRoom(
    contentId: number,
    roomName?: string
  ): Promise<ApiResponse<WatchRoom>> {
    try {
      const response = await apiClient.post('/watch-rooms', {
        contentId,
        roomName,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating watch room:', error);
      throw error;
    }
  }

  /**
   * Join a watch room by room code
   */
  static async joinWatchRoom(
    roomCode: string
  ): Promise<ApiResponse<WatchRoom>> {
    try {
      const response = await apiClient.post(`/watch-rooms/join/${roomCode}`);
      return response.data;
    } catch (error) {
      console.error('Error joining watch room:', error);
      throw error;
    }
  }

  /**
   * Get watch room details
   */
  static async getWatchRoom(
    roomCode: string
  ): Promise<ApiResponse<WatchRoom>> {
    try {
      const response = await apiClient.get(`/watch-rooms/${roomCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch room:', error);
      throw error;
    }
  }

  /**
   * Leave a watch room
   */
  static async leaveWatchRoom(
    roomId: number
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post(`/watch-rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving watch room:', error);
      throw error;
    }
  }

  /**
   * Send a chat message
   */
  static async sendMessage(
    roomId: number,
    message: string,
    messageType: 'text' | 'reaction' = 'text'
  ): Promise<ApiResponse<ChatMessage>> {
    try {
      const response = await apiClient.post(`/watch-rooms/${roomId}/chat`, {
        message,
        messageType,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a room
   */
  static async getChatHistory(
    roomId: number,
    limit: number = 50
  ): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const response = await apiClient.get(`/watch-rooms/${roomId}/chat`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Update current timestamp in watch room
   */
  static async updateTimestamp(
    roomId: number,
    timestamp: number
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put(`/watch-rooms/${roomId}/timestamp`, {
        timestamp,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating timestamp:', error);
      throw error;
    }
  }

  /**
   * Get user's active watch rooms
   */
  static async getUserWatchRooms(
    userId: number
  ): Promise<ApiResponse<WatchRoom[]>> {
    try {
      const response = await apiClient.get(`/watch-rooms/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user watch rooms:', error);
      throw error;
    }
  }
}

export default GroupWatchService;
