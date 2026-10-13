import React from 'react';
import {
  Home,
  Search,
  Film,
  MessageCircle,
  User as UserIcon,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type TabType = 'feed' | 'search' | 'reels' | 'messages' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadMessagesCount: number;
  userAvatar: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  userAvatar,
}) => {
  const handleNavClick = (tab: TabType) => {
    sounds.playPop();
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0f17]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Tab 1: Feed (Home) */}
        <button
          type="button"
          onClick={() => handleNavClick('feed')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'feed'
              ? 'text-cyan-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Feed (Home)"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5">Feed</span>
        </button>

        {/* Tab 2: Search / Explore */}
        <button
          type="button"
          onClick={() => handleNavClick('search')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'search'
              ? 'text-cyan-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Search Users"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5">Search</span>
        </button>

        {/* Tab 3: Reels (Prominent Central Highlighted Button) */}
        <div className="relative -top-3">
          <button
            type="button"
            onClick={() => handleNavClick('reels')}
            className={`w-13 h-13 rounded-2xl p-[2px] transition-all duration-300 shadow-xl group cursor-pointer ${
              activeTab === 'reels'
                ? 'bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 shadow-purple-500/50 scale-110'
                : 'bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-cyan-500/25 hover:scale-105'
            }`}
            title="Reels (Vertical Video)"
          >
            <div className="w-full h-full bg-[#0c0f17] rounded-[14px] flex items-center justify-center group-hover:bg-[#121622] transition">
              <Film
                className={`w-6 h-6 transition-transform group-hover:rotate-12 ${
                  activeTab === 'reels'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 stroke-cyan-400 fill-cyan-400/20'
                    : 'text-cyan-300 stroke-cyan-400'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Tab 4: Messages */}
        <button
          type="button"
          onClick={() => handleNavClick('messages')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'messages'
              ? 'text-cyan-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Direct Messages"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center border border-[#0c0f17]">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold mt-0.5">Chat</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          type="button"
          onClick={() => handleNavClick('profile')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'profile'
              ? 'text-cyan-400 scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="My Profile"
        >
          <div
            className={`w-5 h-5 rounded-full p-[1px] ${
              activeTab === 'profile'
                ? 'bg-gradient-to-tr from-cyan-400 to-pink-500'
                : 'bg-slate-700'
            }`}
          >
            <img
              src={userAvatar}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-[9px] font-bold mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
