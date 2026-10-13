import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Film,
  Music,
  MapPin,
  Upload,
  Check,
  Camera,
  Play,
  Sparkles,
} from 'lucide-react';
import { User, Post, Reel } from '../types';
import { sounds } from '../utils/soundEffects';
import { TamilMusicPickerModal } from './TamilMusicPickerModal';

interface CreatePostOrReelModalProps {
  initialMode?: 'post' | 'reel';
  currentUser: User;
  onClose: () => void;
  onCreatePost: (newPost: Post) => void;
  onCreateReel: (newReel: Reel) => void;
}

const PRESET_SONGS = [
  'Anirudh Ravichander • Hukum (Jailer)',
  'Harris Jayaraj • Vaseegara Chill Mix',
  'Yuvan Shankar Raja • Oru Naalil Lo-Fi',
  'AR Rahman • Roja Flute Theme',
  'Ilaiyaraaja • Thendral Vanthu Theendumbothu',
  'Santhosh Narayanan • Kaala Fire Beat',
];

const PRESET_GALLERY = [
  {
    name: 'Marina Waves',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
    type: 'image',
  },
  {
    name: 'Chennai Coffee',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1080&q=80',
    type: 'image',
  },
  {
    name: 'ECR Night Ride',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1080&q=80',
    type: 'image',
  },
  {
    name: 'Street Food Fiesta',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1080&q=80',
    type: 'video',
  },
];

export const CreatePostOrReelModal: React.FC<CreatePostOrReelModalProps> = ({
  initialMode = 'post',
  currentUser,
  onClose,
  onCreatePost,
  onCreateReel,
}) => {
  const [mode, setMode] = useState<'post' | 'reel'>(initialMode);
  const [mediaDataUrl, setMediaDataUrl] = useState<string>(PRESET_GALLERY[0].url);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Besant Nagar, Chennai');
  const [musicTrack, setMusicTrack] = useState('Anirudh Ravichander • Hukum (Jailer)');
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [selectedTag, setSelectedTag] = useState('#pesikalam');
  const [isCustomUpload, setIsCustomUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle device file selection (photo / video from phone storage)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const isVideo = file.type.startsWith('video');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMediaDataUrl(event.target.result as string);
        setIsCustomUpload(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playLike();

    const fullCaption = `${caption.trim()} ${selectedTag}`.trim();

    if (mode === 'post') {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isVerified: currentUser.isVerified,
        },
        mediaUrl: mediaDataUrl,
        mediaType,
        caption: fullCaption || 'Living the Chennai vibe ✨ #nature #travel #pesikalam',
        location: location || 'Chennai, Tamil Nadu',
        musicTrack: musicTrack || PRESET_SONGS[0],
        likesCount: 1,
        commentsCount: 0,
        isLiked: true,
        isSaved: false,
        timestamp: 'Just now',
        comments: [],
      };
      onCreatePost(newPost);
    } else {
      const newReel: Reel = {
        id: `reel_${Date.now()}`,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isVerified: currentUser.isVerified,
        },
        mediaUrl: mediaDataUrl,
        caption: fullCaption || 'New reel uploaded from device! 🔥',
        musicTrack: musicTrack || PRESET_SONGS[0],
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: true,
        isSaved: false,
        tags: [selectedTag, '#pesikalam', '#reels'],
      };
      onCreateReel(newReel);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header with Mode Toggle */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex bg-[#0b0e14] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('post');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'post'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Feed Post</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('reel');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                mode === 'reel'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Upload Reel</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Media Preview & Device File Picker Button */}
          <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-black border border-slate-700/80 group">
            {mediaType === 'video' ? (
              <video
                src={mediaDataUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={mediaDataUrl}
                alt="Selected media"
                className="w-full h-full object-cover"
              />
            )}

            {/* Device Pick Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-4 text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer active:scale-95 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Upload from Phone Gallery / Storage</span>
              </button>
              <span className="text-[10px] text-slate-300">
                Supports local JPG, PNG, MP4, WebM
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={mode === 'reel' ? 'video/*,image/*' : 'image/*,video/*'}
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload indicator pill */}
            <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-medium">
              {isCustomUpload ? 'Device Media Loaded ✓' : 'Default Sample'}
            </div>
          </div>

          {/* Quick Gallery Presets */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Or pick sample Chennai media:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GALLERY.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setMediaDataUrl(item.url);
                    setMediaType(item.type as 'image' | 'video');
                    setIsCustomUpload(false);
                    sounds.playPop();
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition ${
                    mediaDataUrl === item.url && !isCustomUpload
                      ? 'border-cyan-400 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Caption
            </label>
            <textarea
              rows={2}
              required
              placeholder="Write a custom caption for your circle..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Hashtag Quick Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['#nature', '#travel', '#pesikalam', '#chennaidiaries', '#reels'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                    selectedTag === tag
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Tamil Music Picker Track Card */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5 text-xs">
                <Music className="w-3.5 h-3.5 text-pink-400" />
                <span>Audio Track (Tamil Music Library)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setShowMusicPicker(true);
                }}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Change Audio</span>
              </button>
            </div>

            <div
              onClick={() => {
                sounds.playPop();
                setShowMusicPicker(true);
              }}
              className="w-full bg-[#0b0e14] border border-slate-700 hover:border-pink-500/80 rounded-xl px-3 py-2.5 text-white flex items-center justify-between gap-2 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition">
                  <Music className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{musicTrack}</div>
                  <div className="text-[10px] text-slate-400">Tap to search & preview categorized songs</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full shrink-0">
                Browse
              </span>
            </div>
          </div>

          {/* Location Tag */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location Tag</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Publish Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-xs font-bold text-white rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            {mode === 'post' ? 'Publish Post to Feed' : 'Publish Reel to Feed'}
          </button>
        </form>
      </div>

      {/* Expanded Tamil Music Picker Modal */}
      {showMusicPicker && (
        <TamilMusicPickerModal
          currentTrack={musicTrack}
          onSelectTrack={(track) => setMusicTrack(track)}
          onClose={() => setShowMusicPicker(false)}
        />
      )}
    </div>
  );
};
