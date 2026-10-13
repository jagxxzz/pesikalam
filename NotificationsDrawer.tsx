import React from 'react';
import { X, Heart, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NotificationsDrawerProps {
  onClose: () => void;
  onOpenUserProfile: (username: string) => void;
}

const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'like',
    username: 'kumar_k',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    text: 'liked your sunset photo at Marina Beach.',
    time: '5m ago',
  },
  {
    id: 'n2',
    type: 'comment',
    username: 'priya_s',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    text: 'commented: "Degree coffee aroma is unbeatable! ☕"',
    time: '25m ago',
  },
  {
    id: 'n3',
    type: 'follow',
    username: 'manoj_beats',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    text: 'started following you. You can now direct message them!',
    time: '1h ago',
  },
  {
    id: 'n4',
    type: 'ai',
    username: 'pesikalam_ai',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    text: 'AI Machan suggested 3 new trending reels for you 🔥',
    time: '3h ago',
  },
];

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  onClose,
  onOpenUserProfile,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm bg-[#121622] border-l border-slate-800 h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sounds.playPop();
                onOpenUserProfile(item.username);
              }}
              className="p-2.5 rounded-2xl bg-[#0e121c] hover:bg-[#161c2b] border border-slate-800/80 flex items-start gap-3 cursor-pointer transition"
            >
              <div className="relative">
                <img
                  src={item.avatar}
                  alt={item.username}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900">
                  {item.type === 'like' && <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />}
                  {item.type === 'comment' && <MessageCircle className="w-3 h-3 text-cyan-400" />}
                  {item.type === 'follow' && <UserPlus className="w-3 h-3 text-emerald-400" />}
                  {item.type === 'ai' && <Sparkles className="w-3 h-3 text-amber-400" />}
                </span>
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <span className="font-bold text-white">@{item.username} </span>
                <span className="text-slate-300">{item.text}</span>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
