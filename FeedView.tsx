import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  MapPin,
  MoreHorizontal,
  Send,
  Sparkles,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import { Post, User } from '../types';
import { sounds } from '../utils/soundEffects';

interface FeedViewProps {
  posts: Post[];
  currentUser: User;
  onOpenComments: (postId: string) => void;
  onSharePost: (post: Post) => void;
  onOpenProfile: (username: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  onOpenComments,
  onSharePost,
  onOpenProfile,
}) => {
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts);
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ [postId: string]: boolean }>({});
  const [inlineComments, setInlineComments] = useState<{ [postId: string]: string }>({});
  const [copiedLinkPostId, setCopiedLinkPostId] = useState<string | null>(null);

  // Keep feedPosts in sync whenever parent posts change
  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  // Handle Like Toggle
  const handleToggleLike = (postId: string) => {
    sounds.playLike();
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likesCount: newLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Double Tap to Like
  const handleDoubleTap = (postId: string) => {
    sounds.playLike();
    setDoubleTapHeart((prev) => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setDoubleTapHeart((prev) => ({ ...prev, [postId]: false }));
    }, 700);

    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && !p.isLiked) {
          return {
            ...p,
            isLiked: true,
            likesCount: p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Toggle Save
  const handleToggleSave = (postId: string) => {
    sounds.playPop();
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
  };

  // Post Inline Comment
  const handlePostInlineComment = (postId: string) => {
    const text = inlineComments[postId]?.trim();
    if (!text) return;
    sounds.playMessageSent();

    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            username: currentUser.username,
            userAvatar: currentUser.avatar,
            text,
            timestamp: 'Just now',
            likesCount: 0,
            isLiked: false,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setInlineComments((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 pt-2 space-y-5 px-2 sm:px-0">
      {feedPosts.map((post) => (
        <article
          key={post.id}
          className="bg-[#0f131d] border border-slate-800/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between p-3.5 sm:px-4">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onOpenProfile(post.user.username)}
                className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 cursor-pointer"
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#0f131d]"
                />
              </button>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(post.user.username)}
                    className="text-xs font-bold text-white hover:text-cyan-400 transition cursor-pointer"
                  >
                    {post.user.username}
                  </button>
                  {post.user.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">• {post.timestamp}</span>
                </div>

                {post.location && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="w-2.5 h-2.5 text-pink-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{post.location}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="text-slate-400 hover:text-white p-1 rounded-full"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Post Media Container with Double-tap recognition */}
          <div
            className="relative w-full aspect-square bg-black overflow-hidden cursor-pointer select-none"
            onDoubleClick={() => handleDoubleTap(post.id)}
          >
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Heart burst animation on double tap */}
            {doubleTapHeart[post.id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <Heart className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-2xl animate-heart-burst" />
              </div>
            )}

            {/* Audio pill indicator if post has music */}
            {post.musicTrack && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-white text-[10px]">
                <Music className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="truncate max-w-[190px]">{post.musicTrack}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => handleToggleLike(post.id)}
                className="group flex items-center gap-1.5 cursor-pointer"
              >
                <Heart
                  className={`w-6 h-6 transition-transform group-hover:scale-110 active:scale-125 ${
                    post.isLiked
                      ? 'fill-pink-500 text-pink-500'
                      : 'text-slate-300 hover:text-white'
                  }`}
                />
              </button>

              {/* Comment Drawer Button */}
              <button
                type="button"
                onClick={() => onOpenComments(post.id)}
                className="group flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
              >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 active:scale-125 transition-transform" />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => onSharePost(post)}
                className="group flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
              >
                <Share2 className="w-5 h-5 group-hover:scale-110 active:scale-125 transition-transform" />
              </button>
            </div>

            {/* Save Bookmark Button */}
            <button
              type="button"
              onClick={() => handleToggleSave(post.id)}
              className="cursor-pointer text-slate-300 hover:text-white"
            >
              <Bookmark
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  post.isSaved
                    ? 'fill-cyan-400 text-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              />
            </button>
          </div>

          {/* Likes Count */}
          <div className="px-4 text-xs font-bold text-white">
            {post.likesCount.toLocaleString()} likes
          </div>

          {/* Caption & Location */}
          <div className="px-4 pt-1.5 text-xs text-slate-200">
            <span
              onClick={() => onOpenProfile(post.user.username)}
              className="font-bold text-white hover:text-cyan-400 cursor-pointer mr-1.5"
            >
              {post.user.username}
            </span>
            <span className="leading-relaxed">{post.caption}</span>
          </div>

          {/* Comments count link */}
          {post.commentsCount > 0 && (
            <button
              type="button"
              onClick={() => onOpenComments(post.id)}
              className="px-4 pt-2 text-[11px] text-slate-400 hover:text-slate-300 block cursor-pointer font-medium"
            >
              View all {post.commentsCount} comments
            </button>
          )}

          {/* Latest comment preview */}
          {post.comments.length > 0 && (
            <div className="px-4 pt-1 text-xs text-slate-300 space-y-1">
              <div className="flex items-start gap-1">
                <span className="font-bold text-slate-200 text-[11px]">
                  @{post.comments[post.comments.length - 1].username}:
                </span>
                <span className="text-slate-300 text-[11px] truncate">
                  {post.comments[post.comments.length - 1].text}
                </span>
              </div>
            </div>
          )}

          {/* Quick inline comment box */}
          <div className="px-4 py-3 mt-1 border-t border-slate-800/60 flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700"
            />
            <input
              type="text"
              placeholder="Add a comment... (e.g. Vera level machan!)"
              value={inlineComments[post.id] || ''}
              onChange={(e) =>
                setInlineComments((prev) => ({ ...prev, [post.id]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePostInlineComment(post.id);
              }}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
            />
            {inlineComments[post.id]?.trim() && (
              <button
                type="button"
                onClick={() => handlePostInlineComment(post.id)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Post
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};
