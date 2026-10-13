import React, { useState } from 'react';
import {
  Search,
  MessageCircle,
  Sparkles,
  CheckCheck,
  Check,
  Plus,
} from 'lucide-react';
import { ChatConversation, User } from '../types';
import { sounds } from '../utils/soundEffects';

interface ChatListViewProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onStartNewChat: () => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onStartNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl mx-auto pb-24 pt-2 px-3 space-y-3">
      {/* Search & New Chat Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search direct messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121622] border border-slate-800 focus:border-cyan-400 rounded-2xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onStartNewChat();
          }}
          className="p-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-2xl shadow-md shadow-purple-500/20 hover:opacity-90 active:scale-95 transition cursor-pointer"
          title="New Chat"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Online Friends Mini Horizontal Reel */}
      <div className="bg-[#101420] border border-slate-800/80 rounded-2xl p-3">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2 px-1">
          Active Now (நேரலையில்)
        </span>
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sounds.playPop();
                onSelectConversation(c.id);
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-500 group-hover:scale-105 transition">
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="w-full h-full rounded-full object-cover border border-[#101420]"
                  />
                </div>
                {c.user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#101420] rounded-full shadow-sm" />
                )}
              </div>
              <span className="text-[10px] text-slate-300 font-medium truncate max-w-[56px] mt-1">
                {c.user.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-1.5">
        {filteredConversations.map((convo) => {
          const isSelected = convo.id === activeConversationId;

          return (
            <div
              key={convo.id}
              onClick={() => {
                sounds.playPop();
                onSelectConversation(convo.id);
              }}
              className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-[#121622] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 to-purple-600">
                    <img
                      src={convo.user.avatar}
                      alt={convo.user.name}
                      className="w-full h-full rounded-full object-cover border border-[#121622]"
                    />
                  </div>
                  {convo.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#121622] rounded-full" />
                  )}
                </div>

                {/* Name & snippet */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white truncate">
                      {convo.user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                      {convo.lastMessageTime}
                    </span>
                  </div>

                  <p
                    className={`text-[11px] truncate leading-tight ${
                      convo.unreadCount > 0 ? 'text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {convo.lastMessage}
                  </p>
                </div>
              </div>

              {/* Unread badge */}
              {convo.unreadCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 shadow-md shadow-pink-500/30">
                  {convo.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
