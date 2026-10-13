import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Heart,
  Send,
  Music,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Story } from '../types';
import { sounds } from '../utils/soundEffects';

interface StoryViewerModalProps {
  stories: Story[];
  initialStoryId: string;
  onClose: () => void;
  onSendStoryReply: (userId: string, replyText: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryId,
  onClose,
  onSendStoryReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = stories.findIndex((s) => s.id === initialStoryId);
    return idx >= 0 ? idx : 0;
  });

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [showReactionFeedback, setShowReactionFeedback] = useState<string | null>(null);

  const currentStory = stories[currentIndex] || stories[0];
  const DURATION_MS = 6000;
  const timerRef = useRef<number | null>(null);

  // Timer loop
  useEffect(() => {
    setProgress(0);
    setIsLiked(false);

    if (isPaused) return;

    const interval = 50;
    const step = (interval / DURATION_MS) * 100;

    const id = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    timerRef.current = id;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSendReaction = (emoji: string) => {
    sounds.playLike();
    setShowReactionFeedback(emoji);
    setTimeout(() => setShowReactionFeedback(null), 1200);
    onSendStoryReply(currentStory.userId, `Reacted ${emoji} to your story!`);
  };

  const handleSendTextReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    sounds.playMessageSent();
    onSendStoryReply(currentStory.userId, replyInput);
    setReplyInput('');
    setShowReactionFeedback('Sent! 🚀');
    setTimeout(() => setShowReactionFeedback(null), 1200);
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none">
      {/* Center Container */}
      <div className="relative w-full h-full max-w-[430px] max-h-[880px] bg-[#090b10] flex flex-col overflow-hidden sm:rounded-3xl sm:border sm:border-slate-800 shadow-2xl">
        {/* Top Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
            >
              <div
                className="h-full bg-cyan-400 transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Information */}
        <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-500">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold">{currentStory.username}</span>
                <span className="text-[10px] text-white/70 font-medium">
                  • {currentStory.timestamp}
                </span>
              </div>
              {currentStory.musicTrack && (
                <div className="flex items-center gap-1 text-[10px] text-white/80">
                  <Music className="w-3 h-3 animate-pulse text-pink-400" />
                  <span className="truncate max-w-[180px]">{currentStory.musicTrack}</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls: Mute & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Background */}
        <div
          className="relative flex-1 w-full h-full"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentStory.mediaUrl}
            alt="Story content"
            className="w-full h-full object-cover"
          />

          {/* Gradient Shadows top and bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

          {/* Left/Right Tap Area for Skipping */}
          <div
            className="absolute inset-y-16 left-0 w-1/3 cursor-pointer z-20"
            onClick={handlePrevStory}
          />
          <div
            className="absolute inset-y-16 right-0 w-1/3 cursor-pointer z-20"
            onClick={handleNextStory}
          />

          {/* Navigation Chevron buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevStory}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm hidden sm:block"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleNextStory}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Reaction Animation Toast */}
          {showReactionFeedback && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="text-5xl animate-bounce drop-shadow-2xl">
                {showReactionFeedback}
              </div>
            </div>
          )}

          {/* Caption banner on bottom of photo */}
          <div className="absolute bottom-24 left-4 right-4 z-20 text-white">
            <p className="text-sm font-medium drop-shadow-md bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              {currentStory.caption}
            </p>
          </div>
        </div>

        {/* Bottom Reaction & Reply bar */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2">
          {/* Reaction chips */}
          <div className="flex items-center justify-center gap-2">
            {['🔥', '❤️', '😂', '👏', '✨'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSendReaction(emoji)}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-base flex items-center justify-center active:scale-125 transition hover:scale-110 border border-white/15"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Input Bar */}
          <form onSubmit={handleSendTextReply} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Reply to ${currentStory.username}...`}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-full py-2 pl-4 pr-10 text-xs text-white placeholder-white/60 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!replyInput.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLiked(!isLiked);
                sounds.playLike();
              }}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-pink-500 transition active:scale-125"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? 'fill-pink-500 text-pink-500' : 'text-white'
                }`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
