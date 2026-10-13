import React from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  MessageCircle,
  Lock,
  Grid,
  Film,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { User, Post, Reel } from '../types';
import { sounds } from '../utils/soundEffects';

interface UserProfileModalProps {
  user: User;
  currentUser: User;
  isFollowing: boolean;
  userPosts: Post[];
  userReels: Reel[];
  onToggleFollow: () => void;
  onOpenChat: () => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  currentUser,
  isFollowing,
  userPosts,
  userReels,
  onToggleFollow,
  onOpenChat,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<'posts' | 'reels'>('posts');
  const [followNotice, setFollowNotice] = React.useState<string | null>(null);

  const handleChatClick = () => {
    if (!isFollowing) {
      sounds.playPop();
      setFollowNotice(`Follow Gate: Click "Follow" on @${user.username} to unlock chat!`);
      setTimeout(() => setFollowNotice(null), 3000);
      return;
    }
    sounds.playPop();
    onOpenChat();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white">@{user.username}</span>
            {user.isVerified && (
              <span className="w-3.5 h-3.5 bg-cyan-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                ✓
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Avatar and Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shrink-0 shadow-lg shadow-cyan-500/20">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#121622]"
              />
            </div>

            <div className="flex-1 flex justify-around text-center">
              <div>
                <div className="text-sm font-extrabold text-white">{userPosts.length}</div>
                <div className="text-[10px] text-slate-400">Posts</div>
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">
                  {(user.followersCount + (isFollowing ? 1 : 0)).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Followers</div>
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">
                  {user.followingCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Following</div>
              </div>
            </div>
          </div>

          {/* User Bio Details */}
          <div>
            <h3 className="font-bold text-sm text-white">{user.name}</h3>
            {user.location && (
              <div className="flex items-center gap-1 text-[11px] text-cyan-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            )}
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{user.bio}</p>
          </div>

          {/* Follow Notice */}
          {followNotice && (
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{followNotice}</span>
            </div>
          )}

          {/* Follow & Message Buttons (Follow-Gated) */}
          <div className="flex gap-2">
            {/* Follow / Following Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playLike();
                onToggleFollow();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isFollowing
                  ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow @{user.username}</span>
                </>
              )}
            </button>

            {/* Message Button */}
            <button
              type="button"
              onClick={handleChatClick}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isFollowing
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {isFollowing ? (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct Message</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Follow to Chat</span>
                </>
              )}
            </button>
          </div>

          {/* Tabs: Posts vs Reels */}
          <div className="flex border-t border-slate-800 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold transition ${
                activeTab === 'posts'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Posts ({userPosts.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reels')}
              className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-bold transition ${
                activeTab === 'reels'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Reels ({userReels.length})</span>
            </button>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {activeTab === 'posts' ? (
              userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square rounded-lg overflow-hidden bg-black relative group"
                  >
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-6 text-xs text-slate-500">
                  No posts shared yet.
                </div>
              )
            ) : userReels.length > 0 ? (
              userReels.map((reel) => (
                <div
                  key={reel.id}
                  className="aspect-[9/16] rounded-lg overflow-hidden bg-black relative group"
                >
                  <img
                    src={reel.mediaUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-1 right-1 text-[9px] text-white bg-black/60 px-1 rounded font-bold">
                    ▶ {reel.likesCount > 1000 ? `${(reel.likesCount / 1000).toFixed(0)}k` : reel.likesCount}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-slate-500">
                No reels published yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
