import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Heart, 
  Laugh, 
  ThumbsUp, 
  Play, 
  Pause, 
  Volume2,
  Copy,
  Share
} from 'lucide-react';
import { GroupWatchService } from '../../services/groupWatchService';
import { WatchRoom, ChatMessage, WatchRoomParticipant } from '../../types';
import GlassCard from '../ui/GlassCard';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface GroupWatchRoomProps {
  roomCode?: string;
  onLeave?: () => void;
}

const GroupWatchRoom: React.FC<GroupWatchRoomProps> = ({ roomCode, onLeave }) => {
  const [room, setRoom] = useState<WatchRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<WatchRoomParticipant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize socket connection
  useEffect(() => {
    if (roomCode) {
      initializeSocket();
      fetchRoomDetails();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomCode]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeSocket = () => {
    const socket = io(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/watch-room`, {
      query: { roomCode }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to watch room');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from watch room');
    });

    socket.on('room-joined', (roomData: WatchRoom) => {
      setRoom(roomData);
      setParticipants(roomData.participants);
      setCurrentTimestamp(roomData.currentTimestamp);
    });

    socket.on('new-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user-joined', (participant: WatchRoomParticipant) => {
      setParticipants(prev => [...prev, participant]);
    });

    socket.on('user-left', (userId: number) => {
      setParticipants(prev => prev.filter(p => p.userId !== userId));
    });

    socket.on('timestamp-updated', (timestamp: number) => {
      setCurrentTimestamp(timestamp);
      if (videoRef.current) {
        videoRef.current.currentTime = timestamp;
      }
    });

    socket.on('play-state-changed', (playing: boolean) => {
      setIsPlaying(playing);
      if (videoRef.current) {
        if (playing) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    });
  };

  const fetchRoomDetails = async () => {
    if (!roomCode) return;
    
    try {
      setLoading(true);
      const response = await GroupWatchService.getWatchRoom(roomCode);
      
      if (response.success && response.data) {
        setRoom(response.data);
        setParticipants(response.data.participants);
        setCurrentTimestamp(response.data.currentTimestamp);
        
        // Fetch chat history
        const chatResponse = await GroupWatchService.getChatHistory(response.data.id);
        if (chatResponse.success && chatResponse.data) {
          setMessages(chatResponse.data);
        }
      } else {
        setError(response.error || 'Failed to load room');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching room details:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !room) return;

    try {
      const response = await GroupWatchService.sendMessage(room.id, newMessage);
      
      if (response.success) {
        setNewMessage('');
        // Socket will handle adding the message to the list
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const sendReaction = async (reaction: string) => {
    if (!room) return;

    try {
      await GroupWatchService.sendMessage(room.id, reaction, 'reaction');
    } catch (err) {
      console.error('Error sending reaction:', err);
    }
  };

  const updateTimestamp = (timestamp: number) => {
    setCurrentTimestamp(timestamp);
    
    if (socketRef.current) {
      socketRef.current.emit('update-timestamp', timestamp);
    }
  };

  const togglePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (socketRef.current) {
      socketRef.current.emit('toggle-play', newPlayState);
    }
  };

  const copyRoomCode = () => {
    if (room?.roomCode) {
      navigator.clipboard.writeText(room.roomCode);
    }
  };

  const shareRoom = async () => {
    if (room?.roomCode) {
      const shareUrl = `${window.location.origin}/watch/${room.roomCode}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Join my Netflix Watch Party',
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
      }
    }
  };

  const reactions = [
    { emoji: '❤️', icon: Heart, label: 'Love' },
    { emoji: '😂', icon: Laugh, label: 'Laugh' },
    { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading watch room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-4">{error}</p>
          <Button onClick={onLeave}>Go Back</Button>
        </GlassCard>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Room not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Player Area */}
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full"
            src={room.content.thumbnail} // This would be the actual video URL
            onTimeUpdate={(e) => updateTimestamp(e.currentTarget.currentTime)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                </button>
                <div className="text-white text-sm">
                  {Math.floor(currentTimestamp / 60)}:{String(Math.floor(currentTimestamp % 60)).padStart(2, '0')}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Volume2 size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Room Info Overlay */}
          <div className="absolute top-4 left-4">
            <GlassCard className="p-3">
              <h3 className="text-white font-medium">{room.content.title}</h3>
              <p className="text-gray-300 text-sm">Room Code: {room.roomCode}</p>
            </GlassCard>
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isConnected ? 'bg-green-600' : 'bg-red-600'
            } text-white`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>

        {/* Participants Bar */}
        <div className="bg-gray-900 p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-gray-400" />
              <span className="text-white font-medium">{participants.length} watching</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={copyRoomCode}
                className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Copy room code"
              >
                <Copy size={16} className="text-gray-400" />
              </button>
              <button
                onClick={shareRoom}
                className="p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Share room"
              >
                <Share size={16} className="text-gray-400" />
              </button>
              <Button onClick={onLeave} variant="secondary">Leave Room</Button>
            </div>
          </div>
          
          {/* Participants Avatars */}
          <div className="flex items-center space-x-2 mt-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium"
                title={participant.user.username}
              >
                {participant.user.username.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} className="text-gray-400" />
            <h3 className="text-white font-medium">Chat</h3>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                  {message.user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-400 text-xs">{message.user.username}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              
              {message.messageType === 'text' ? (
                <p className="text-white text-sm ml-8">{message.message}</p>
              ) : (
                <div className="text-2xl ml-8">{message.message}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reactions Bar */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex justify-center space-x-2 mb-3">
            {reactions.map(({ emoji, icon: Icon, label }) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title={label}
              >
                <span className="text-xl">{emoji}</span>
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupWatchRoom;
