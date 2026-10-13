import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  UserPlus,
  MessageCircle,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { User } from '../types';
import { sounds } from '../utils/soundEffects';

import { ContactsSyncView } from './ContactsSyncView';

interface SearchViewProps {
  allUsers: User[];
  currentUser: User;
  followingUsernames: string[];
  onToggleFollow: (username: string) => void;
  onOpenChatWithUser: (user: User) => void;
  onOpenUserProfile: (username: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  allUsers,
  currentUser,
  followingUsernames,
  onToggleFollow,
  onOpenChatWithUser,
  onOpenUserProfile,
}) => {
  const [subTab, setSubTab] = useState<'directory' | 'contacts'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [followGateNotice, setFollowGateNotice] = useState<string | null>(null);

  // Strict username search
  const query = searchTerm.trim().toLowerCase().replace(/^@/, '');

  const filteredUsers = allUsers.filter((u) => {
    // Exclude current user from search results
    if (u.username === currentUser.username) return false;
    if (!query) return true; // Show all when empty
    // Strictly match unique username (or starts with)
    return u.username.toLowerCase().includes(query);
  });

  const handleMessageClick = (user: User) => {
    const isFollowing = followingUsernames.includes(user.username);
    if (!isFollowing) {
      sounds.playPop();
      setFollowGateNotice(
        `Follow Gate Active: You must click "Follow" on @${user.username} before you can start chatting with them!`
      );
      setTimeout(() => setFollowGateNotice(null), 4000);
      return;
    }

    sounds.playPop();
    onOpenChatWithUser(user);
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 pt-3 px-3 space-y-4">
      {/* Subtab Switcher: Username Directory vs Sync Phone Contacts */}
      <div className="flex bg-[#101420] p-1 rounded-2xl border border-slate-800 gap-1">
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setSubTab('directory');
          }}
          className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            subTab === 'directory'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Username Directory</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setSubTab('contacts');
          }}
          className={`flex-1 py-2 flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            subTab === 'contacts'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Find Phone Contacts</span>
        </button>
      </div>

      {subTab === 'contacts' ? (
        <ContactsSyncView
          allUsers={allUsers}
          currentUser={currentUser}
          followingUsernames={followingUsernames}
          onToggleFollow={onToggleFollow}
          onOpenChatWithUser={onOpenChatWithUser}
          onOpenUserProfile={onOpenUserProfile}
        />
      ) : (
        <>
          {/* Search Input Box (Strictly Search by Username) */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-bold text-sm">
              @
            </span>
            <input
              type="text"
              placeholder="Search strictly by unique username (e.g. kumar_k, priya_s)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#121622] border border-slate-800 focus:border-cyan-400 rounded-2xl py-3 pl-9 pr-10 text-xs text-white placeholder-slate-500 outline-none transition shadow-lg shadow-black/40"
        />
        <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Follow Gate Notice Toast */}
      {followGateNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 shadow-lg animate-shake">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-amber-300">Follow Gate Notice</span>
            <span>{followGateNotice}</span>
          </div>
        </div>
      )}

      {/* Info tag */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Verified Pesikalam User Directory</span>
        <span className="text-cyan-400 font-semibold font-mono">
          {filteredUsers.length} handles found
        </span>
      </div>

      {/* User Results List */}
      <div className="space-y-2.5">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-[#121622]/60 rounded-3xl border border-slate-800/80 p-6 space-y-2">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">
              No username matching "@{searchTerm}"
            </p>
            <p className="text-xs text-slate-500">
              Usernames on Pesikalam are strictly unique. Try searching for "kumar_k", "priya_s", or "manoj_beats".
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isFollowing = followingUsernames.includes(user.username);
            return (
              <div
                key={user.id}
                className="bg-[#121622] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-md transition"
              >
                {/* User Info */}
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => onOpenUserProfile(user.username)}
                >
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover border border-[#121622]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate hover:text-cyan-400 transition">
                        @{user.username}
                      </span>
                      {user.isVerified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {user.followersCount.toLocaleString()} followers • {user.postsCount} posts
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Follow Toggle & Follow-Gated Message */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Follow Button */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playLike();
                      onToggleFollow(user.username);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-95'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* Message Button (Follow Gated) */}
                  <button
                    type="button"
                    onClick={() => handleMessageClick(user)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isFollowing
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20 hover:opacity-95'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                    title={
                      isFollowing
                        ? `Chat with @${user.username}`
                        : `Follow @${user.username} first to unlock direct chat`
                    }
                  >
                    {isFollowing ? (
                      <>
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Locked</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}
    </div>
  );
};
