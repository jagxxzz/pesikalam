import React, { useState, useEffect } from 'react';
import {
  X,
  Music,
  Search,
  Play,
  Square,
  Check,
  Sparkles,
  Volume2,
  Heart,
  Flame,
  Zap,
} from 'lucide-react';
import {
  TAMIL_SONGS_CATALOG,
  TAMIL_MUSIC_CATEGORIES,
  TamilSong,
  TamilMusicCategory,
} from '../data/tamilMusicLibrary';
import { sounds } from '../utils/soundEffects';

interface TamilMusicPickerModalProps {
  currentTrack?: string;
  onSelectTrack: (trackName: string) => void;
  onClose: () => void;
}

export const TamilMusicPickerModal: React.FC<TamilMusicPickerModalProps> = ({
  currentTrack,
  onSelectTrack,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TamilMusicCategory>('All Tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Clean up music preview upon modal unmount
  useEffect(() => {
    return () => {
      sounds.stopMusicPreview();
    };
  }, []);

  const filteredSongs = TAMIL_SONGS_CATALOG.filter((song) => {
    const matchesCategory =
      selectedCategory === 'All Tracks' || song.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      song.title.toLowerCase().includes(q) ||
      song.movie.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.vibe.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleTogglePlay = (e: React.MouseEvent, song: TamilSong) => {
    e.stopPropagation();
    if (playingSongId === song.id) {
      sounds.stopMusicPreview();
      setPlayingSongId(null);
    } else {
      sounds.playMusicPreview(song.category, () => {
        setPlayingSongId(null);
      });
      setPlayingSongId(song.id);
    }
  };

  const handleChooseSong = (song: TamilSong) => {
    sounds.playLike();
    sounds.stopMusicPreview();
    const formatted = `${song.artist.split('•')[0].trim()} • ${song.title} (${song.movie})`;
    onSelectTrack(formatted);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Love & Romance':
        return <Heart className="w-3.5 h-3.5 text-pink-400" />;
      case 'Mass & Fast Beat':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'Motivation & Uplifting':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#121622] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-pink-900/30 to-purple-900/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 text-white shadow-lg shadow-cyan-500/20">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                Tamil Music Library
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  Mass Tracks
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose songs for your Posts, Reels & Stories
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.stopMusicPreview();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-[#0d1017]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by song title, movie, composer (Anirudh, ARR, Yuvan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121622] border border-slate-700/80 focus:border-pink-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {TAMIL_MUSIC_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Song Catalog List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
          {filteredSongs.map((song) => {
            const isPlaying = playingSongId === song.id;
            const isSelected = currentTrack?.includes(song.title);

            return (
              <div
                key={song.id}
                onClick={() => handleChooseSong(song)}
                className={`p-3 rounded-2xl border transition text-left cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#1c1b30] to-[#25152a] border-pink-400/80 shadow-md'
                    : 'bg-[#101420] border-slate-800/80 hover:border-slate-700 hover:bg-[#141824]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Play / Pause Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => handleTogglePlay(e, song)}
                    title={isPlaying ? 'Pause preview' : 'Play audio preview'}
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition cursor-pointer shadow-md ${
                      isPlaying
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white animate-pulse'
                        : 'bg-[#181d2a] border border-slate-700 text-cyan-400 group-hover:border-cyan-400'
                    }`}
                  >
                    {isPlaying ? (
                      <Square className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs text-white truncate">
                        {song.title}
                      </h4>
                      <span className="text-[10px] text-pink-400 font-bold shrink-0">
                        • {song.movie}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5 italic">
                      "{song.vibe}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {song.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChooseSong(song)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-pink-600 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Select</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredSongs.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              No tracks found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0b0e14] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="text-pink-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            Tap Play icon to audition Tamil melody loops
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.stopMusicPreview();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
