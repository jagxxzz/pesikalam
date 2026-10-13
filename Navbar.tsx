import React, { useState } from 'react';
import {
  MessageCircle,
  Search,
  PlusSquare,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  unreadDmCount: number;
  onOpenDms: () => void;
  onOpenCreatePost: () => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  unreadDmCount,
  onOpenDms,
  onOpenCreatePost,
  onSearch,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSoundToggle = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
    if (newState) sounds.playPop();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-md shadow-cyan-500/20">
            <MessageCircle className="w-5 h-5 text-white transform -scale-x-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-['Outfit'] leading-none">
              Pesikalam
            </span>
            <span className="text-[9px] uppercase tracking-widest text-cyan-400/80 font-bold leading-none mt-0.5">
              பேசிக்கலாம்
            </span>
          </div>
        </div>

        {/* Search Bar / Input (Inline for desktop or expanding for mobile) */}
        <div className="flex-1 max-w-[200px] hidden sm:block relative">
          <form onSubmit={handleSearchSubmit}>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vibe, tag, user..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full bg-[#141926] border border-slate-800 rounded-full py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition"
            />
          </form>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`p-2 rounded-full transition cursor-pointer ${
              soundEnabled
                ? 'text-cyan-400 hover:bg-cyan-500/10'
                : 'text-slate-500 hover:bg-slate-800/50'
            }`}
            title={soundEnabled ? 'Mute micro-sounds' : 'Unmute sounds'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Create Post (+) */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenCreatePost();
            }}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition cursor-pointer"
            title="Create Post"
          >
            <PlusSquare className="w-5 h-5" />
          </button>

          {/* DM Messenger Icon with Animated Badge */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenDms();
            }}
            className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-800/60 rounded-full transition cursor-pointer"
            title="Direct Messages"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadDmCount > 0 && (
              <span className="absolute 1 top-1 right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#0c0f17] shadow-sm shadow-pink-500/50 animate-pulse">
                {unreadDmCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Expanding Search Bar */}
      {isSearchOpen && (
        <div className="sm:hidden pt-2.5 pb-1 max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search #Chennai, friends, reels..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full bg-[#141926] border border-cyan-500/40 rounded-full py-1.5 pl-8 pr-8 text-xs text-white placeholder-slate-500 outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-cyan-400 font-semibold px-2 py-1"
          >
            Done
          </button>
        </div>
      )}
    </header>
  );
};
