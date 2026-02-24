// TypeScript type definitions for Netflix Clone features

export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  type: 'movie' | 'series';
  genre: string[];
  duration?: number;
  releaseYear: number;
  rating: string;
}

export interface Episode {
  id: number;
  contentId: number;
  season: number;
  episode: number;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
}

// AI Recommendations
export interface AIRecommendation {
  id: number;
  userId: number;
  contentId: number;
  content: Content;
  recommendationScore: number;
  recommendationType: 'collaborative' | 'content_based' | 'trending' | 'similar';
  createdAt: string;
}

export interface RecommendationFeedback {
  recommendationId: number;
  feedback: 'like' | 'dislike' | 'not_interested';
  userId: number;
}

// Group Watch Rooms
export interface WatchRoom {
  id: number;
  roomCode: string;
  hostId: number;
  host: User;
  contentId: number;
  content: Content;
  currentTimestamp: number;
  isActive: boolean;
  participants: WatchRoomParticipant[];
  createdAt: string;
}

export interface WatchRoomParticipant {
  id: number;
  roomId: number;
  userId: number;
  user: User;
  joinedAt: string;
  isHost: boolean;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  userId: number;
  user: User;
  message: string;
  messageType: 'text' | 'reaction' | 'system';
  timestamp: number;
  createdAt: string;
}

// Smart User Profiles
export interface UserProfile {
  id: number;
  userId: number;
  profileName: string;
  avatarUrl: string;
  preferences: ProfilePreferences;
  watchHistoryWeight: number;
  genrePreferences: GenrePreference[];
  createdAt: string;
}

export interface ProfilePreferences {
  autoplay: boolean;
  subtitles: boolean;
  quality: 'auto' | 'low' | 'medium' | 'high';
  language: string;
  maturityLevel: string;
}

export interface GenrePreference {
  genre: string;
  weight: number;
}

// Download Manager
export interface Download {
  id: number;
  userId: number;
  contentId: number;
  content: Content;
  quality: '360p' | '480p' | '720p' | '1080p' | '4K';
  fileSize: number;
  downloadPath: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
  expiresAt: string;
  createdAt: string;
}

// Scene Search
export interface SceneTag {
  id: number;
  contentId: number;
  episodeId?: number;
  sceneStart: number;
  sceneEnd: number;
  sceneDescription: string;
  tags: string[];
  thumbnailUrl: string;
  createdAt: string;
}

// AI Summaries
export interface AISummary {
  id: number;
  contentId: number;
  episodeId?: number;
  summaryType: 'brief' | 'detailed' | 'key_points';
  summaryText: string;
  keyPoints: string[];
  durationMinutes: number;
  createdAt: string;
}

// Playlists
export interface Playlist {
  id: number;
  userId: number;
  user: User;
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string;
  items: PlaylistItem[];
  createdAt: string;
}

export interface PlaylistItem {
  id: number;
  playlistId: number;
  contentId: number;
  content: Content;
  position: number;
  addedAt: string;
}

// Watch Statistics
export interface WatchStatistics {
  id: number;
  userId: number;
  contentId: number;
  content: Content;
  totalWatchTime: number; // in seconds
  sessionsCount: number;
  completionRate: number; // percentage
  lastWatched: string;
  createdAt: string;
}

export interface UserStats {
  totalWatchTime: number;
  averageSessionTime: number;
  topGenres: GenrePreference[];
  completionRate: number;
  watchStreak: number;
  favoriteContent: Content[];
}

// Subtitle Features
export interface SubtitlePreferences {
  id: number;
  userId: number;
  language: string;
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  position: 'top' | 'middle' | 'bottom';
  createdAt: string;
}

export interface Subtitle {
  id: number;
  contentId: number;
  episodeId?: number;
  language: string;
  startTime: number;
  endTime: number;
  text: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket.io Events
export interface SocketEvents {
  // Client to Server
  'join-room': (roomCode: string) => void;
  'leave-room': (roomId: number) => void;
  'send-message': (message: string) => void;
  'send-reaction': (reaction: string) => void;
  'update-timestamp': (timestamp: number) => void;
  
  // Server to Client
  'room-joined': (room: WatchRoom) => void;
  'room-updated': (room: WatchRoom) => void;
  'new-message': (message: ChatMessage) => void;
  'user-joined': (participant: WatchRoomParticipant) => void;
  'user-left': (userId: number) => void;
  'timestamp-updated': (timestamp: number) => void;
}
