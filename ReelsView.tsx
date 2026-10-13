import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { Reel, User } from '../types';
import { sounds } from '../utils/soundEffects';

interface ReelsViewProps {
  reels: Reel[];
  currentUser: User;
  onOpenComments: (reelId: string) => void;
  onShareReel: (reel: Reel) => void;
  onOpenProfile: (username: string) => void;
  onOpenUploadReel: () => void;
  followingUsernames: string[];
  onToggleFollow: (username: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onOpenComments,
  onShareReel,
  onOpenProfile,
  onOpenUploadReel,
  followingUsernames,
  onToggleFollow,
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ [id: string]: boolean }>({});
  const [localReels, setLocalReels] = useState<Reel[]>(reels);

  const currentReel = localReels[activeReelIndex] || localReels[0];

  const handleNextReel = () => {
    if (activeReelIndex < localReels.length - 1) {
      sounds.playPop();
      setActiveReelIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (activeReelIndex > 0) {
      sounds.playPop();
      setActiveReelIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleToggleLike = (reelId: string) => {
    sounds.playLike();
    setLocalReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const newLiked = !r.isLiked;
          return {
            ...r,
            isLiked: newLiked,
            likesCount: newLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleDoubleTap = (reelId: string) => {
    sounds.playLike();
    setDoubleTapHeart((prev) => ({ ...prev, [reelId]: true }));
    setTimeout(() => {
      setDoubleTapHeart((prev) => ({ ...prev, [reelId]: false }));
    }, 700);

    setLocalReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId && !r.isLiked) {
          return {
            ...r,
            isLiked: true,
            likesCount: r.likesCount + 1,
          };
        }
        return r;
      })
    );
  };

  const handleToggleSave = (reelId: string) => {
    sounds.playPop();
    setLocalReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          return { ...r, isSaved: !r.isSaved };
        }
        return r;
      })
    );
  };

  if (!currentReel) return null;

  const isFollowingAuthor = followingUsernames.includes(currentReel.user.username);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] max-w-xl mx-auto flex items-center justify-center bg-black overflow-hidden sm:rounded-3xl border sm:border-slate-800 shadow-2xl select-none">
      {/* Background Reel Media */}
      <div
        className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center bg-[#07090e]"
        onClick={() => setIsPlaying(!isPlaying)}
        onDoubleClick={() => handleDoubleTap(currentReel.id)}
      >
        <img
          src={currentReel.mediaUrl}
          alt={currentReel.caption}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying ? 'scale-100' : 'scale-[1.02] filter brightness-90'
          }`}
        />

        {/* Play / Pause indicator overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-10 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Double-tap heart animation */}
        {doubleTapHeart[currentReel.id] && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="w-28 h-28 text-pink-500 fill-pink-500 drop-shadow-2xl animate-heart-burst" />
          </div>
        )}

        {/* Top Vignette gradient & Header with Reel counter & Upload Reel Button */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white font-['Outfit'] tracking-wide">
              Reels
            </span>
            <span className="text-[10px] bg-white/20 backdrop-blur-md text-cyan-300 font-mono px-2 py-0.5 rounded-full font-bold">
              {activeReelIndex + 1}/{localReels.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload Reel button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                onOpenUploadReel();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post Reel</span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-black/70 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Vignette */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

        {/* Left Side Reel Information (Bottom Left) */}
        <div className="absolute bottom-4 left-4 right-20 z-20 text-white space-y-2 pointer-events-auto">
          {/* Creator Profile & Follow Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProfile(currentReel.user.username);
              }}
              className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-pink-500 shrink-0"
            >
              <img
                src={currentReel.user.avatar}
                alt={currentReel.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProfile(currentReel.user.username);
              }}
              className="font-bold text-xs hover:text-cyan-400 transition flex items-center gap-1"
            >
              @{currentReel.user.username}
              {currentReel.user.isVerified && (
                <span className="w-3 h-3 bg-cyan-400 text-black text-[8px] font-black rounded-full flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>

            {currentReel.user.username !== currentUser.username && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playPop();
                  onToggleFollow(currentReel.user.username);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                  isFollowingAuthor
                    ? 'bg-white/20 text-slate-200 border-white/20'
                    : 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400'
                }`}
              >
                {isFollowingAuthor ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-2">
            {currentReel.caption}
          </p>

          {/* Tags */}
          {currentReel.tags && currentReel.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-[10px] text-cyan-300 font-semibold">
              {currentReel.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Music Track Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-200 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 w-fit">
            <Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="truncate max-w-[200px]">{currentReel.musicTrack}</span>
          </div>
        </div>

        {/* Right Side Action Column (Likes, Comments, Share, Save, Rotating Disc) */}
        <div className="absolute bottom-4 right-3.5 z-20 flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-125 transition">
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-white group-hover:text-pink-400'
                }`}
              />
            </div>
            <span className="text-[10px] font-bold">
              {currentReel.likesCount > 1000
                ? `${(currentReel.likesCount / 1000).toFixed(1)}k`
                : currentReel.likesCount}
            </span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playPop();
              onOpenComments(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-125 transition">
              <MessageCircle className="w-6 h-6 text-white group-hover:text-cyan-400" />
            </div>
            <span className="text-[10px] font-bold">
              {currentReel.commentsCount > 1000
                ? `${(currentReel.commentsCount / 1000).toFixed(1)}k`
                : currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playPop();
              onShareReel(currentReel);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-125 transition">
              <Share2 className="w-6 h-6 text-white group-hover:text-purple-400" />
            </div>
            <span className="text-[10px] font-bold">Share</span>
          </button>

          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSave(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-active:scale-125 transition">
              <Bookmark
                className={`w-6 h-6 ${
                  currentReel.isSaved
                    ? 'fill-cyan-400 text-cyan-400'
                    : 'text-white group-hover:text-cyan-400'
                }`}
              />
            </div>
            <span className="text-[10px] font-bold">Save</span>
          </button>

          {/* Rotating Vinyl Audio Track Disc */}
          <div className="mt-1 relative">
            <div
              className={`w-10 h-10 rounded-full border-2 border-slate-700 bg-gradient-to-tr from-slate-900 to-black p-1 shadow-lg ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              <img
                src={currentReel.user.avatar}
                alt="Audio cover"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Animated music note dot */}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping" />
            )}
          </div>
        </div>

        {/* Up / Down Navigation Floating Controls */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {activeReelIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevReel();
              }}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md border border-white/10 transition active:scale-95"
              title="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {activeReelIndex < localReels.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextReel();
              }}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md border border-white/10 transition active:scale-95"
              title="Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
