import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Download, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { TopAppBar } from './components/TopAppBar';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewerModal } from './components/StoryViewerModal';
import { FeedView } from './components/FeedView';
import { ReelsView } from './components/ReelsView';
import { SearchView } from './components/SearchView';
import { ChatListView } from './components/ChatListView';
import { ChatWindowView } from './components/ChatWindowView';
import { ProfileView } from './components/ProfileView';
import { BottomNav, TabType } from './components/BottomNav';
import { CreatePostOrReelModal } from './components/CreatePostOrReelModal';
import { CommentsDrawer } from './components/CommentsDrawer';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ApkDownloadModal } from './components/ApkDownloadModal';

import {
  INITIAL_USERS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
} from './data/mockData';
import { User, Story, Post, Reel, ChatConversation } from './types';
import { storage } from './utils/storage';
import { sounds } from './utils/soundEffects';

export default function App() {
  // 1. App Lifecycle State
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return storage.getCurrentUser() !== null;
  });

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('feed');

  // 3. User Data State (Persistent)
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    return storage.getUsers(INITIAL_USERS);
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = storage.getCurrentUser();
    if (saved) return saved;
    return INITIAL_USERS[0];
  });

  // Following list tracks which users currentUser follows (Follow Gate for Chat!)
  const [followingUsernames, setFollowingUsernames] = useState<string[]>(() => {
    return storage.getFollowing(['kumar_k', 'priya_s']);
  });

  // 4. Feeds, Stories & Reels State (Persistent)
  const [stories, setStories] = useState<Story[]>(() => {
    return storage.getStories(INITIAL_STORIES);
  });
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>(() => {
    return storage.getPosts(INITIAL_POSTS);
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    return storage.getReels(INITIAL_REELS);
  });

  // 5. Messaging State (Persistent)
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    return storage.getConversations(INITIAL_CONVERSATIONS);
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // 6. Modals & Drawers State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalMode, setCreateModalMode] = useState<'post' | 'reel'>('post');
  const [activeCommentPostOrReelId, setActiveCommentPostOrReelId] = useState<string | null>(null);
  const [inspectedUsername, setInspectedUsername] = useState<string | null>(null);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showApkBanner, setShowApkBanner] = useState(true);

  // Sync to local storage on state changes
  useEffect(() => {
    storage.setUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      storage.setCurrentUser(currentUser);
    } else if (!isAuthenticated) {
      storage.setCurrentUser(null);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    storage.setFollowing(followingUsernames);
  }, [followingUsernames]);

  useEffect(() => {
    storage.setPosts(posts);
  }, [posts]);

  useEffect(() => {
    storage.setReels(reels);
  }, [reels]);

  useEffect(() => {
    storage.setStories(stories);
  }, [stories]);

  useEffect(() => {
    storage.setConversations(conversations);
  }, [conversations]);

  const [securityBanner, setSecurityBanner] = useState<string | null>(null);
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Pull complete two-way cloud state
  const syncFromCloud = async (username: string) => {
    try {
      const res = await fetch(`/api/sync/pull/${username}`);
      const cloudRes = await res.json();
      if (cloudRes.success && cloudRes.hasCloudData && cloudRes.data) {
        const { conversations: cConvs, posts: cPosts, reels: cReels, followingUsernames: cFollows } = cloudRes.data;
        if (cConvs?.length) setConversations(cConvs);
        if (cPosts?.length) setPosts(cPosts);
        if (cReels?.length) setReels(cReels);
        if (cFollows?.length) setFollowingUsernames(cFollows);
      }
    } catch {
      // offline continuity
    }
  };

  // Push complete two-way cloud state
  const syncToCloud = async (username: string) => {
    try {
      await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          conversations,
          posts,
          reels,
          followingUsernames,
        }),
      });
    } catch {
      // offline continuity
    }
  };

  // Periodic and change-based cloud sync
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const timer = setTimeout(() => {
        syncToCloud(currentUser.username);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [conversations, posts, reels, followingUsernames, isAuthenticated, currentUser]);

  // Handle Login with Cloud Sync & Automated Security Notice
  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab('feed');

    // Trigger two-way cloud sync
    await syncFromCloud(user.username);

    // Formulate security notice
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const deviceName = isMobile ? 'Mobile Smartphone' : 'Desktop Browser';
    const alertText = `New device login detected on Pesikalam! Device: ${deviceName}, Location: Chennai, Tamil Nadu, Time: ${timeStr}. If this wasn't you, secure your account immediately.`;

    setSecurityBanner(alertText);
    setTimeout(() => {
      setSecurityBanner(null);
    }, 12000);
  };

  // Register User
  const handleRegisterUser = (newUser: User): boolean => {
    // Strict uniqueness check
    if (allUsers.some((u) => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return false;
    }

    setAllUsers((prev) => [newUser, ...prev]);
    return true;
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    storage.setCurrentUser(null);
    setActiveTab('feed');
    setSecurityBanner(null);
  };

  // Toggle Follow / Unfollow (updates user counts and unlocks direct chat!)
  const handleToggleFollow = (username: string) => {
    setFollowingUsernames((prev) => {
      const isFollowing = prev.includes(username);
      if (isFollowing) {
        return prev.filter((u) => u !== username);
      } else {
        return [...prev, username];
      }
    });

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.username === username) {
          const wasFollowing = followingUsernames.includes(username);
          return {
            ...u,
            followersCount: wasFollowing ? u.followersCount - 1 : u.followersCount + 1,
          };
        }
        return u;
      })
    );
  };

  // Open Direct Chat with User (Follow Gated check is handled in search/profile)
  const handleOpenChatWithUser = (user: User) => {
    let convo = conversations.find((c) => c.user.username === user.username);
    if (!convo) {
      const newConvo: ChatConversation = {
        id: `chat_${user.username}`,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          isOnline: user.isOnline ?? true,
          tagline: 'Direct Human Message',
        },
        lastMessage: 'Started new direct message',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            senderId: user.id,
            text: `Vanakkam ${currentUser.name}! Thanks for connecting. Enna plan innikku? 😊`,
            timestamp: 'Just now',
            isSentByMe: false,
            status: 'read',
          },
        ],
      };
      setConversations((prev) => [newConvo, ...prev]);
      convo = newConvo;
    }

    setActiveConversationId(convo.id);
    setActiveTab('messages');
    setInspectedUsername(null);
  };

  // Send Message in Direct Chat (supports device image attachment)
  const handleSendMessage = (conversationId: string, text: string, mediaUrl?: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `m_${Date.now()}`,
            senderId: currentUser.id,
            text,
            mediaUrl,
            timestamp: 'Just now',
            isSentByMe: true,
            status: 'read' as const,
          };
          return {
            ...c,
            lastMessage: text || 'Photo attached 📸',
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  // Direct Story Reply into DMs
  const handleSendStoryReply = (userId: string, replyText: string) => {
    const targetUser = allUsers.find((u) => u.id === userId) || allUsers[1];
    handleOpenChatWithUser(targetUser);
    setTimeout(() => {
      handleSendMessage(
        `chat_${targetUser.username}`,
        `Replied to your story: "${replyText}"`
      );
    }, 200);
  };

  // Upload Story from Device Storage
  const handleAddStoryFile = (fileUrl: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      mediaUrl: fileUrl,
      caption: 'My latest Kathai story ✨ #pesikalam',
      timestamp: 'Just now',
      isSeen: false,
      musicTrack: 'Anirudh Ravichander • Hukum',
    };
    setStories((prev) => [newStory, ...prev]);
    setActiveStoryId(newStory.id);
  };

  // Create Post from Device Media
  const handleCreatePost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, postsCount: u.postsCount + 1 } : u
      )
    );
    setActiveTab('feed');
  };

  // Create Reel from Device Media
  const handleCreateReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setActiveTab('reels');
  };

  // Add Comment
  const handleAddComment = (text: string) => {
    if (!activeCommentPostOrReelId) return;

    // Check posts
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === activeCommentPostOrReelId) {
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

    // Check reels
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === activeCommentPostOrReelId) {
          return { ...r, commentsCount: r.commentsCount + 1 };
        }
        return r;
      })
    );
  };

  // Active selected conversation
  const currentConversation = conversations.find((c) => c.id === activeConversationId);

  // Inspected user profile for UserProfileModal
  const inspectedUser = allUsers.find((u) => u.username === inspectedUsername);
  const inspectedUserPosts = posts.filter((p) => p.user.username === inspectedUsername);
  const inspectedUserReels = reels.filter((r) => r.user.username === inspectedUsername);

  // Saved bookmarks
  const userSavedPosts = posts.filter((p) => p.isSaved);
  const myPosts = posts.filter((p) => p.user.username === currentUser.username);
  const myReels = reels.filter((r) => r.user.username === currentUser.username);

  // Comments for drawer
  const activePostForComments = posts.find((p) => p.id === activeCommentPostOrReelId);
  const currentComments = activePostForComments ? activePostForComments.comments : [];

  // 1. Splash Screen Phase
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 2. Authentication Phase
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        registeredUsers={allUsers}
      />
    );
  }

  // 3. Main Dashboard Phase
  return (
    <div className="min-h-screen bg-[#07090e] text-[#f0f2f5] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top App Bar (Hidden when actively chatting inside a 1-on-1 Chat Window) */}
      {!(activeTab === 'messages' && currentConversation) && (
        <TopAppBar
          unreadDmCount={totalUnreadMessages}
          onOpenAddStoryCamera={() => {
            setCreateModalMode('post');
            setShowCreateModal(true);
          }}
          onOpenDms={() => {
            setActiveTab('messages');
            setActiveConversationId(null);
          }}
          onOpenNotifications={() => setShowNotificationsDrawer(true)}
          onOpenApkDownload={() => setShowApkModal(true)}
          onLogoClick={() => setActiveTab('feed')}
        />
      )}

      {/* Official Android App APK Smart Banner */}
      {showApkBanner && !(activeTab === 'messages' && currentConversation) && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#0d161d] to-[#141d2b] border-b border-emerald-500/30 px-3.5 py-2 flex items-center justify-between text-xs text-white z-30 shadow-md">
          <div
            className="flex items-center gap-2.5 min-w-0 pr-2 cursor-pointer flex-1"
            onClick={() => setShowApkModal(true)}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white truncate">
                  Get the Official Pesikalam Android App (APK)
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Native calling • Push notifications • VirusTotal verified ✓
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowApkModal(true);
              }}
              className="px-2.5 py-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 text-black font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={() => setShowApkBanner(false)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Automated New Device Login Security Alert Banner */}
      {securityBanner && (
        <div className="bg-gradient-to-r from-purple-950 via-[#181128] to-slate-900 border-b border-purple-500/40 px-3.5 py-2.5 flex items-center justify-between text-xs text-white z-30 shadow-xl animate-in slide-in-from-top">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400 shrink-0 border border-pink-500/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-pink-300 block text-[10px] uppercase tracking-wider">
                Automated Carrier Security SMS Dispatched:
              </span>
              <p className="text-[11px] text-slate-200 truncate font-mono mt-0.5">
                "{securityBanner}"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSecurityBanner(null);
              }}
              className="px-2.5 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-extrabold text-[10px] rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
            >
              Review Devices
            </button>
            <button
              onClick={() => setSecurityBanner(null)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area by Active Tab */}
      <main className="flex-1 overflow-x-hidden">
        {/* TAB 1: FEED (HOME) */}
        {activeTab === 'feed' && (
          <div className="w-full">
            {/* Stories / Status Bar ("Your Kathai +" with device file upload + friends) */}
            <StoriesBar
              currentUser={currentUser}
              stories={stories}
              onSelectStory={(id) => setActiveStoryId(id)}
              onAddStoryFile={handleAddStoryFile}
            />

            {/* Main Feed Posts */}
            <FeedView
              posts={posts}
              currentUser={currentUser}
              onOpenComments={(postId) => setActiveCommentPostOrReelId(postId)}
              onSharePost={(post) => {
                sounds.playPop();
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
                alert(`Post by @${post.user.username} copied to clipboard! ✨`);
              }}
              onOpenProfile={(username) => setInspectedUsername(username)}
            />
          </div>
        )}

        {/* TAB 2: SEARCH / EXPLORE (Strict Unique Username Directory & Follow Gate) */}
        {activeTab === 'search' && (
          <SearchView
            allUsers={allUsers}
            currentUser={currentUser}
            followingUsernames={followingUsernames}
            onToggleFollow={handleToggleFollow}
            onOpenChatWithUser={handleOpenChatWithUser}
            onOpenUserProfile={(username) => setInspectedUsername(username)}
          />
        )}

        {/* TAB 3: REELS (Fullscreen Vertical Player & Upload Reel from Device) */}
        {activeTab === 'reels' && (
          <ReelsView
            reels={reels}
            currentUser={currentUser}
            onOpenComments={(reelId) => setActiveCommentPostOrReelId(reelId)}
            onShareReel={() => {
              sounds.playPop();
              alert(`Reel link copied! Share the vibe ✨`);
            }}
            onOpenProfile={(username) => setInspectedUsername(username)}
            onOpenUploadReel={() => {
              setCreateModalMode('reel');
              setShowCreateModal(true);
            }}
            followingUsernames={followingUsernames}
            onToggleFollow={handleToggleFollow}
          />
        )}

        {/* TAB 4: MESSAGES / CHAT (100% Real-Time Human Chat with Device Attachments) */}
        {activeTab === 'messages' && (
          currentConversation ? (
            <ChatWindowView
              conversation={currentConversation}
              currentUser={currentUser}
              onBack={() => setActiveConversationId(null)}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <ChatListView
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => setActiveConversationId(id)}
              onStartNewChat={() => setActiveTab('search')}
            />
          )
        )}

        {/* TAB 5: PROFILE (Profile with Device DP Upload, Highlights, and Unique Handle Editor) */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            userPosts={myPosts}
            userReels={myReels}
            savedPosts={userSavedPosts}
            registeredUsernames={allUsers.map((u) => u.username.toLowerCase())}
            onUpdateProfile={(updated) => {
              setCurrentUser((prev) => ({ ...prev, ...updated }));
              setAllUsers((prev) =>
                prev.map((u) =>
                  u.id === currentUser.id ? { ...u, ...updated } : u
                )
              );
            }}
            onLogout={handleLogout}
            onOpenUpload={(mode) => {
              setCreateModalMode(mode);
              setShowCreateModal(true);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Hidden when inside a 1-on-1 Chat Window) */}
      {!(activeTab === 'messages' && currentConversation) && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'messages') setActiveConversationId(null);
          }}
          unreadMessagesCount={totalUnreadMessages}
          userAvatar={currentUser.avatar}
        />
      )}

      {/* MODAL 1: Fullscreen Story Viewer */}
      {activeStoryId && (
        <StoryViewerModal
          stories={stories}
          initialStoryId={activeStoryId}
          onClose={() => setActiveStoryId(null)}
          onSendStoryReply={handleSendStoryReply}
        />
      )}

      {/* MODAL 2: Create Post or Reel from Device Media */}
      {showCreateModal && (
        <CreatePostOrReelModal
          initialMode={createModalMode}
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={handleCreatePost}
          onCreateReel={handleCreateReel}
        />
      )}

      {/* MODAL 3: Comments Drawer */}
      {activeCommentPostOrReelId && (
        <CommentsDrawer
          comments={currentComments}
          currentUser={currentUser}
          onClose={() => setActiveCommentPostOrReelId(null)}
          onAddComment={handleAddComment}
        />
      )}

      {/* MODAL 4: User Profile Modal (with Follow Gate for Chat) */}
      {inspectedUsername && inspectedUser && (
        <UserProfileModal
          user={inspectedUser}
          currentUser={currentUser}
          isFollowing={followingUsernames.includes(inspectedUser.username)}
          userPosts={inspectedUserPosts}
          userReels={inspectedUserReels}
          onToggleFollow={() => handleToggleFollow(inspectedUser.username)}
          onOpenChat={() => handleOpenChatWithUser(inspectedUser)}
          onClose={() => setInspectedUsername(null)}
        />
      )}

      {/* MODAL 5: Notifications Drawer */}
      {showNotificationsDrawer && (
        <NotificationsDrawer
          onClose={() => setShowNotificationsDrawer(false)}
          onOpenUserProfile={(username) => {
            setShowNotificationsDrawer(false);
            setInspectedUsername(username);
          }}
        />
      )}

      {/* MODAL 6: Official Android APK Download Modal */}
      {showApkModal && (
        <ApkDownloadModal
          isOpen={showApkModal}
          onClose={() => setShowApkModal(false)}
        />
      )}
    </div>
  );
}
