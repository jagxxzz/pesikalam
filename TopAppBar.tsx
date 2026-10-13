import React from 'react';
import { Camera, Heart, MessageCircle, Volume2, VolumeX, Download, Smartphone } from 'lucide-react';
import { PesikalamLogo } from './PesikalamLogo';
import { sounds } from '../utils/soundEffects';

interface TopAppBarProps {
  unreadDmCount: number;
  unreadNotificationsCount?: number;
  onOpenAddStoryCamera: () => void;
  onOpenDms: () => void;
  onOpenNotifications: () => void;
  onOpenApkDownload?: () => void;
  onLogoClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  unreadDmCount,
  unreadNotificationsCount = 2,
  onOpenAddStoryCamera,
  onOpenDms,
  onOpenNotifications,
  onOpenApkDownload,
  onLogoClick,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const toggleSound = () => {
    const val = sounds.toggleSound();
    setSoundOn(val);
    if (val) sounds.playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Story Add Camera Icon on Left */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenAddStoryCamera();
          }}
          className="p-2 text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 rounded-full transition active:scale-95 cursor-pointer"
          title="Add Story / Kathai"
        >
          <Camera className="w-6 h-6" />
        </button>

        {/* Center: Pesikalam Branded Logo */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            if (onLogoClick) onLogoClick();
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <PesikalamLogo size={36} showSubtitle={false} className="group-hover:rotate-6 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tight font-['Outfit'] bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent leading-none">
              Pesikalam
            </span>
            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-extrabold leading-tight mt-0.5">
              பேசிக்கலாம்
            </span>
          </div>
        </button>

        {/* Right Action Icons: Sound, Notifications, and Direct Messages */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Official Android APK Download Trigger */}
          {onOpenApkDownload && (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onOpenApkDownload();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              title="Get Official Android App (APK)"
            >
              <Smartphone className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-wider text-emerald-300">
                APK
              </span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-full transition cursor-pointer"
            title={soundOn ? 'Sound effects on' : 'Sound muted'}
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          {/* Notifications Icon (Heart) with dot indicator */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenNotifications();
            }}
            className="relative p-2 text-slate-200 hover:text-pink-400 hover:bg-slate-800/50 rounded-full transition active:scale-95 cursor-pointer"
            title="Activity & Notifications"
          >
            <Heart className="w-6 h-6" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#0c0f17] animate-pulse" />
            )}
          </button>

          {/* Direct Message (DM) Badge with Counter */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenDms();
            }}
            className="relative p-2 text-slate-200 hover:text-cyan-400 hover:bg-slate-800/50 rounded-full transition active:scale-95 cursor-pointer"
            title="Direct Messages"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadDmCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#0c0f17] shadow-md shadow-pink-500/40">
                {unreadDmCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
