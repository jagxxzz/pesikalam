import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Volume2,
  Wand2,
  Check,
  Search,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import { VoicePreset } from '../types';
import { VOICE_PRESETS, voiceChangerEngine } from '../utils/voiceChangerProcessor';
import { sounds } from '../utils/soundEffects';

interface VoiceChangerModalProps {
  activePresetId: string;
  onSelectPreset: (preset: VoicePreset) => void;
  onClose: () => void;
}

const CATEGORIES = ['All Presets', 'Cinematic', 'Fun', 'Sci-Fi', 'Acoustic', 'Vocal'] as const;

export const VoiceChangerModal: React.FC<VoiceChangerModalProps> = ({
  activePresetId,
  onSelectPreset,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Presets');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const filteredPresets = VOICE_PRESETS.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Presets' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tamilTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (e: React.MouseEvent, preset: VoicePreset) => {
    e.stopPropagation();
    sounds.playPop();
    setPreviewingId(preset.id);
    voiceChangerEngine.playTestSample(preset);
    setTimeout(() => {
      setPreviewingId(null);
    }, 700);
  };

  const handleSelect = (preset: VoicePreset) => {
    sounds.playLike();
    voiceChangerEngine.applyPreset(preset);
    onSelectPreset(preset);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#121622] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-gradient-to-r from-purple-900/30 to-cyan-900/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                Real-Time Voice Changer
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  22 Presets
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Live DSP audio filter applied directly during call
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              placeholder="Search voice filters (e.g. Deep Bass, Chipmunk, Robot)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121622] border border-slate-700/80 focus:border-cyan-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredPresets.map((preset) => {
              const isSelected = preset.id === activePresetId;
              const isPreviewing = previewingId === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelect(preset)}
                  className={`p-3 rounded-2xl border transition text-left cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#1c2237] to-[#251b3d] border-cyan-400/90 shadow-lg shadow-cyan-500/15'
                      : 'bg-[#101420] border-slate-800/90 hover:border-slate-700 hover:bg-[#141a29]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1.5 bg-[#0b0e14] rounded-xl border border-slate-800">
                        {preset.icon}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-xs text-white leading-tight">
                          {preset.name}
                        </h4>
                        <span className="text-[10px] text-pink-400 font-bold block mt-0.5">
                          {preset.tamilTag}
                        </span>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="p-1 rounded-full bg-cyan-500 text-black shadow-sm">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handlePreview(e, preset)}
                        title="Test voice sample"
                        className={`p-1.5 rounded-xl border transition ${
                          isPreviewing
                            ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                            : 'bg-slate-800/80 text-slate-400 hover:text-cyan-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 capitalize">{preset.category}</span>
                    <button
                      type="button"
                      onClick={(e) => handlePreview(e, preset)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{isPreviewing ? 'Playing...' : 'Test Sample'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              No voice presets found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0b0e14] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            Applied live to microphone & calling audio stream
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl shadow-md cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
