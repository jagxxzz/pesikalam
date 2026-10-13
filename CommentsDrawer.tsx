import React, { useState } from 'react';
import { X, Heart, Send, Sparkles } from 'lucide-react';
import { Comment, User } from '../types';
import { sounds } from '../utils/soundEffects';

interface CommentsDrawerProps {
  comments: Comment[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  comments,
  currentUser,
  onClose,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    sounds.playMessageSent();
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleToggleLike = (id: string) => {
    sounds.playLike();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-[#121622] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Comments</span>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {comments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[200px]">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No comments yet. Be the first to start the vibe! ✨
            </div>
          ) : (
            comments.map((c) => {
              const isLiked = likedMap[c.id] ?? c.isLiked;
              return (
                <div key={c.id} className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <img
                      src={c.userAvatar}
                      alt={c.username}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white hover:text-cyan-400 cursor-pointer">
                          @{c.username}
                        </span>
                        <span className="text-[10px] text-slate-500">• {c.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words">
                        {c.text}
                      </p>
                    </div>
                  </div>

                  {/* Comment heart */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(c.id)}
                    className="p-1 text-slate-500 hover:text-pink-500 cursor-pointer shrink-0"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-pink-500 text-pink-500' : ''
                      }`}
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handlePost}
          className="p-3 border-t border-slate-800 bg-[#0d1017] flex items-center gap-2"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <input
            type="text"
            placeholder={`Comment as @${currentUser.username}...`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-[#141926] border border-slate-700/80 focus:border-cyan-400 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-40 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
