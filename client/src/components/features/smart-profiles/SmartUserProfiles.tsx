import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Eye,
  EyeOff,
  Sliders,
  Heart,
  Star
} from 'lucide-react';
import { UserProfile, ProfilePreferences } from '../../types';
import GlassCard from '../ui/GlassCard';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SmartUserProfilesProps {
  userId: number;
  onProfileSelect?: (profile: UserProfile) => void;
  currentProfileId?: number;
}

const SmartUserProfiles: React.FC<SmartUserProfilesProps> = ({
  userId,
  onProfileSelect,
  currentProfileId
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    profileName: '',
    avatarUrl: '',
    preferences: {
      autoplay: true,
      subtitles: false,
      quality: 'auto' as const,
      language: 'en',
      maturityLevel: 'all'
    } as ProfilePreferences,
    watchHistoryWeight: 0.4,
    genrePreferences: {} as Record<string, number>
  });

  // Fetch user profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, [userId]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      const mockProfiles: UserProfile[] = [
        {
          id: 1,
          userId,
          profileName: 'Kids',
          avatarUrl: '',
          preferences: {
            autoplay: false,
            subtitles: true,
            quality: 'medium',
            language: 'en',
            maturityLevel: 'kids'
          },
          watchHistoryWeight: 0.3,
          genrePreferences: {
            'Animation': 0.8,
            'Family': 0.9,
            'Adventure': 0.6
          },
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          userId,
          profileName: 'Action Fan',
          avatarUrl: '',
          preferences: {
            autoplay: true,
            subtitles: false,
            quality: 'high',
            language: 'en',
            maturityLevel: 'adult'
          },
          watchHistoryWeight: 0.6,
          genrePreferences: {
            'Action': 0.9,
            'Thriller': 0.8,
            'Adventure': 0.7
          },
          createdAt: new Date().toISOString()
        }
      ];
      
      setProfiles(mockProfiles);
    } catch (err) {
      setError('Failed to load profiles');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    if (!formData.profileName.trim()) return;

    const newProfile: UserProfile = {
      id: Date.now(), // Temporary ID
      userId,
      profileName: formData.profileName,
      avatarUrl: formData.avatarUrl,
      preferences: formData.preferences,
      watchHistoryWeight: formData.watchHistoryWeight,
      genrePreferences: formData.genrePreferences,
      createdAt: new Date().toISOString()
    };

    setProfiles(prev => [...prev, newProfile]);
    resetForm();
    setShowCreateForm(false);
  };

  const handleUpdateProfile = () => {
    if (!editingProfile || !formData.profileName.trim()) return;

    const updatedProfile: UserProfile = {
      ...editingProfile,
      profileName: formData.profileName,
      avatarUrl: formData.avatarUrl,
      preferences: formData.preferences,
      watchHistoryWeight: formData.watchHistoryWeight,
      genrePreferences: formData.genrePreferences
    };

    setProfiles(prev => 
      prev.map(p => p.id === editingProfile.id ? updatedProfile : p)
    );
    resetForm();
    setEditingProfile(null);
  };

  const handleDeleteProfile = (profileId: number) => {
    if (profiles.length <= 1) {
      setError('You must have at least one profile');
      return;
    }

    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const handleEditProfile = (profile: UserProfile) => {
    setEditingProfile(profile);
    setFormData({
      profileName: profile.profileName,
      avatarUrl: profile.avatarUrl,
      preferences: profile.preferences,
      watchHistoryWeight: profile.watchHistoryWeight,
      genrePreferences: profile.genrePreferences
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      profileName: '',
      avatarUrl: '',
      preferences: {
        autoplay: true,
        subtitles: false,
        quality: 'auto',
        language: 'en',
        maturityLevel: 'all'
      },
      watchHistoryWeight: 0.4,
      genrePreferences: {}
    });
  };

  const handleProfileSelect = (profile: UserProfile) => {
    onProfileSelect?.(profile);
  };

  const updateGenrePreference = (genre: string, weight: number) => {
    setFormData(prev => ({
      ...prev,
      genrePreferences: {
        ...prev.genrePreferences,
        [genre]: weight
      }
    }));
  };

  const getProfileIcon = (profileName: string) => {
    const name = profileName.toLowerCase();
    if (name.includes('kid')) return '👶';
    if (name.includes('action')) return '🎬';
    if (name.includes('comedy')) return '😄';
    if (name.includes('drama')) return '🎭';
    if (name.includes('horror')) return '👻';
    return '👤';
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'kids': return 'bg-green-600';
      case 'teen': return 'bg-blue-600';
      case 'adult': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
    'Thriller', 'Animation', 'Documentary', 'Sci-Fi', 'Fantasy'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Who's watching?</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Profile</span>
        </Button>
      </div>

      {error && (
        <GlassCard className="p-4 bg-red-600/20 border border-red-600">
          <p className="text-red-400">{error}</p>
        </GlassCard>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`relative group cursor-pointer transition-all duration-200 ${
              currentProfileId === profile.id ? 'scale-105' : 'hover:scale-105'
            }`}
            onClick={() => handleProfileSelect(profile)}
          >
            <GlassCard className={`p-6 text-center ${
              currentProfileId === profile.id ? 'ring-2 ring-white' : ''
            }`}>
              {/* Profile Avatar */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-4xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.profileName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getProfileIcon(profile.profileName)
                )}
              </div>

              {/* Profile Name */}
              <h3 className="text-white font-medium text-lg mb-2">
                {profile.profileName}
              </h3>

              {/* Maturity Badge */}
              <div className={`inline-block px-2 py-1 rounded text-xs text-white ${getMaturityColor(profile.preferences.maturityLevel)}`}>
                {profile.preferences.maturityLevel.toUpperCase()}
              </div>

              {/* Edit/Delete Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProfile(profile);
                  }}
                  className="p-1 rounded bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <Edit2 size={14} className="text-white" />
                </button>
                {profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                    className="p-1 rounded bg-black/50 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                )}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Create/Edit Profile Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingProfile ? 'Edit Profile' : 'Create Profile'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingProfile(null);
                  resetForm();
                }}
                className="p-2 rounded hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center">
                  <User size={18} className="mr-2" />
                  Basic Information
                </h4>
                
                <Input
                  label="Profile Name"
                  value={formData.profileName}
                  onChange={(e) => setFormData(prev => ({ ...prev, profileName: e.target.value }))}
                  placeholder="Enter profile name"
                  required
                />

                <Input
                  label="Avatar URL (optional)"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Viewing Preferences */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center">
                  <Settings size={18} className="mr-2" />
                  Viewing Preferences
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <span className="text-white">Autoplay</span>
                    <button
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, autoplay: !prev.preferences.autoplay }
                      }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.preferences.autoplay ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.preferences.autoplay ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <span className="text-white">Subtitles</span>
                    <button
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, subtitles: !prev.preferences.subtitles }
                      }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        formData.preferences.subtitles ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.preferences.subtitles ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Quality</label>
                    <select
                      value={formData.preferences.quality}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, quality: e.target.value as any }
                      }))}
                      className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
                    >
                      <option value="auto">Auto</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Maturity Level</label>
                    <select
                      value={formData.preferences.maturityLevel}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, maturityLevel: e.target.value }
                      }))}
                      className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700"
                    >
                      <option value="all">All Ages</option>
                      <option value="kids">Kids</option>
                      <option value="teen">Teen</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Genre Preferences */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center">
                  <Sliders size={18} className="mr-2" />
                  Genre Preferences
                </h4>
                
                <div className="space-y-3">
                  {genres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-3">
                      <span className="text-white w-24">{genre}</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={formData.genrePreferences[genre] || 0.5}
                        onChange={(e) => updateGenrePreference(genre, parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-gray-400 w-12 text-right">
                        {Math.round((formData.genrePreferences[genre] || 0.5) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Learning Weight */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center">
                  <Star size={18} className="mr-2" />
                  AI Learning Weight
                </h4>
                
                <div className="flex items-center space-x-3">
                  <span className="text-white">Watch History Influence</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.watchHistoryWeight}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      watchHistoryWeight: parseFloat(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-gray-400 w-12 text-right">
                    {Math.round(formData.watchHistoryWeight * 100)}%
                  </span>
                </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProfile(null);
                    resetForm();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingProfile ? handleUpdateProfile : handleCreateProfile}
                  disabled={!formData.profileName.trim()}
                >
                  {editingProfile ? 'Update Profile' : 'Create Profile'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default SmartUserProfiles;
