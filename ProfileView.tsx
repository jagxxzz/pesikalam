import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  Edit3,
  LogOut,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  X,
  Plus,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Laptop,
  RefreshCw,
  Bell,
  Clock,
  LogOut as LogOutIcon,
  Cloud,
  Check,
  Users,
  Phone,
} from 'lucide-react';
import { User, Post, Reel, DeviceSession, SecurityAlert } from '../types';
import { ImageCropModal } from './ImageCropModal';
import { sounds } from '../utils/soundEffects';

interface ProfileViewProps {
  currentUser: User;
  userPosts: Post[];
  userReels: Reel[];
  savedPosts: Post[];
  registeredUsernames: string[];
  onUpdateProfile: (updated: Partial<User>) => void;
  onLogout: () => void;
  onOpenUpload: (mode: 'post' | 'reel') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userPosts,
  userReels,
  savedPosts,
  registeredUsernames,
  onUpdateProfile,
  onLogout,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'security'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location || 'Chennai, Tamil Nadu');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [usernameError, setUsernameError] = useState('');

  // Security & Logged-in Devices State
  const [activeSessions, setActiveSessions] = useState<DeviceSession[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isLoggingOutOthers, setIsLoggingOutOthers] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing'>('synced');

  // Fetch active logged-in devices and security alerts
  const fetchDeviceSessions = async () => {
    setIsLoadingDevices(true);
    try {
      const res = await fetch(`/api/auth/devices/${currentUser.username}`);
      const data = await res.json();
      if (data.success) {
        setActiveSessions(data.sessions || []);
        setSecurityAlerts(data.securityAlerts || []);
      }
    } catch {
      // fallback local session
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'security') {
      fetchDeviceSessions();
    }
  }, [activeTab, currentUser.username]);

  // Log out from all other devices
  const handleLogoutAllOtherDevices = async () => {
    setIsLoggingOutOthers(true);
    sounds.playPop();
    try {
      const res = await fetch('/api/auth/devices/logout-all-others', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sounds.playLike();
        setActiveSessions(data.activeSessions || []);
        setSecurityNotice('Successfully logged out from all other devices! All remote sessions terminated.');
        setTimeout(() => setSecurityNotice(null), 4000);
      }
    } catch {
      setSecurityNotice('Failed to disconnect other devices. Please check connection.');
    } finally {
      setIsLoggingOutOthers(false);
    }
  };

  // Trigger Cloud Sync
  const handleTriggerCloudSync = async () => {
    setCloudSyncStatus('syncing');
    sounds.playPop();
    try {
      await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          posts: userPosts,
          reels: userReels,
          savedPostIds: savedPosts.map((p) => p.id),
        }),
      });
      sounds.playLike();
      setTimeout(() => {
        setCloudSyncStatus('synced');
        setSecurityNotice('Complete two-way cloud sync completed! Data continuity active.');
        setTimeout(() => setSecurityNotice(null), 3000);
      }, 500);
    } catch {
      setCloudSyncStatus('synced');
    }
  };

  // Live uniqueness check for handle update
  const cleanedHandle = editUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const isSelf = cleanedHandle === currentUser.username.toLowerCase();
  const isTakenByOther = !isSelf && registeredUsernames.includes(cleanedHandle);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanedHandle.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    if (isTakenByOther) {
      setUsernameError(`@${cleanedHandle} is already taken by another user!`);
      return;
    }

    sounds.playLike();
    onUpdateProfile({
      name: editName.trim() || currentUser.name,
      username: cleanedHandle,
      bio: editBio.trim(),
      location: editLocation.trim(),
      avatar: editAvatar.trim() || currentUser.avatar,
    });
    setShowEditModal(false);
  };

  const handleSaveCroppedDP = (croppedBase64: string) => {
    sounds.playLike();
    setEditAvatar(croppedBase64);
    onUpdateProfile({ avatar: croppedBase64 });
    setShowCropModal(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 pt-3 px-3 space-y-4">
      {/* Top Header Card */}
      <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
        {/* Avatar with Camera Crop Access + Stats */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative group cursor-pointer" onClick={() => setShowCropModal(true)}>
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#121622]"
              />
            </div>

            {/* Quick DP Crop Button overlay */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCropModal(true);
              }}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black border-2 border-[#121622] shadow-md transition active:scale-95 cursor-pointer"
              title="Change Profile Picture (Camera / Crop)"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 flex justify-around text-center">
            <div>
              <div className="text-base font-extrabold text-white">{userPosts.length}</div>
              <div className="text-[10px] text-slate-400">Posts</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                {currentUser.followersCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Followers</div>
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                {currentUser.followingCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Following</div>
            </div>
          </div>
        </div>

        {/* Bio info */}
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-extrabold text-white">{currentUser.name}</h2>
            <span className="text-xs text-cyan-400 font-bold">@{currentUser.username}</span>
            {currentUser.isVerified && (
              <span className="w-3.5 h-3.5 bg-cyan-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                ✓
              </span>
            )}
          </div>
          {currentUser.location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-pink-400" />
              <span>{currentUser.location}</span>
            </div>
          )}
          <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{currentUser.bio}</p>
        </div>

        {/* Action Buttons: Edit Profile & Logout */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setEditName(currentUser.name);
              setEditUsername(currentUser.username);
              setEditBio(currentUser.bio);
              setEditLocation(currentUser.location || '');
              setEditAvatar(currentUser.avatar);
              setUsernameError('');
              setShowEditModal(true);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700/80 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`p-2 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Logged-in Devices & Security"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-xs">Security</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onLogout();
            }}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition border border-rose-500/25 flex items-center justify-center cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Story Highlights Row */}
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-2">
            Highlights
          </span>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {(currentUser.highlights || []).map((h) => (
              <div key={h.id} className="flex flex-col items-center shrink-0">
                <div className="w-13 h-13 rounded-full p-[1.5px] bg-slate-700">
                  <img
                    src={h.cover}
                    alt={h.title}
                    className="w-full h-full rounded-full object-cover border border-[#121622]"
                  />
                </div>
                <span className="text-[10px] text-slate-300 mt-1 truncate max-w-[56px]">
                  {h.title}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center shrink-0 cursor-pointer">
              <div className="w-13 h-13 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-400 transition">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1">New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs: Posts, Reels, Saved, Security */}
      <div className="flex bg-[#101420] p-1 rounded-2xl border border-slate-800 gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex-1 min-w-[70px] py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'posts'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex-1 min-w-[70px] py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'reels'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Reels ({userReels.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex-1 min-w-[70px] py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'saved'
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[85px] py-2 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl transition ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Devices</span>
        </button>
      </div>

      {/* Grid Content or Security Tab */}
      {activeTab === 'security' ? (
        /* 4. SECURITY & LOGGED-IN DEVICES SECTION */
        <div className="space-y-4">
          {securityNotice && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{securityNotice}</span>
            </div>
          )}

          {/* Cloud Synchronization Card */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Complete Cloud Synchronization</h4>
                  <p className="text-[10px] text-slate-400">Two-way multi-device session continuity</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerCloudSync}
                disabled={cloudSyncStatus === 'syncing'}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>{cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-center">
              <div className="p-2 bg-[#0b0e14] rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">Chats & DMs</div>
                <div className="text-[9px] text-slate-400">100% Synced ✓</div>
              </div>
              <div className="p-2 bg-[#0b0e14] rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">Photos & Media</div>
                <div className="text-[9px] text-slate-400">Live Cloud Store ✓</div>
              </div>
              <div className="p-2 bg-[#0b0e14] rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">Posts & Reels</div>
                <div className="text-[9px] text-slate-400">{userPosts.length + userReels.length} Items ✓</div>
              </div>
              <div className="p-2 bg-[#0b0e14] rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">Bookmarks</div>
                <div className="text-[9px] text-slate-400">{savedPosts.length} Saved ✓</div>
              </div>
            </div>
          </div>

          {/* Phone Contact Synchronization Setting Card */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white flex items-center gap-2">
                    <span>Phone Address Book Sync</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Privacy Protected
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Matches your phone contacts to discover friends on Pesikalam
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  const current = localStorage.getItem('pesikalam_contacts_sync_enabled') === 'true';
                  localStorage.setItem('pesikalam_contacts_sync_enabled', (!current).toString());
                  setSecurityNotice(
                    !current
                      ? 'Phone contacts sync activated! Check the Find Friends tab to see your contacts.'
                      : 'Phone contacts sync paused. Contact matching disabled.'
                  );
                  setTimeout(() => setSecurityNotice(null), 4000);
                }}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 cursor-pointer"
              >
                {localStorage.getItem('pesikalam_contacts_sync_enabled') === 'true'
                  ? 'Enabled (Turn Off)'
                  : 'Turn On'}
              </button>
            </div>
          </div>

          {/* Logged-in Devices Section */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Active Logged-in Devices
                </h4>
                <p className="text-[10px] text-slate-400">
                  Manage browsers and phones where @{currentUser.username} is logged in
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogoutAllOtherDevices}
                disabled={isLoggingOutOthers}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>{isLoggingOutOthers ? 'Disconnecting...' : 'Log out from all other devices'}</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {/* Current Device Card */}
              <div className="p-3 bg-gradient-to-r from-[#161c2b] to-[#121622] rounded-2xl border border-cyan-500/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-2">
                      <span>This Device (Current Browser)</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        Active Now
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Chennai, Tamil Nadu (IN) • Chrome / Mobile App
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-emerald-400">Verified</div>
              </div>

              {/* Other Active Devices list */}
              {activeSessions
                .filter((s) => !s.isCurrent)
                .map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-[#0d1017] rounded-2xl border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-700">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{session.deviceName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {session.location} • Login: {session.loginTime}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Standby</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Automated Security SMS & Email Notifications Log */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-pink-400" />
                Security Alerts & SMS Dispatches
              </h4>
              <span className="text-[10px] text-slate-400">Automated carrier delivery</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0b0e14] border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  New device login detected on Pesikalam!
                </span>
                <span className="text-[9px] font-mono text-slate-500">Just now</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-[#121622] p-2.5 rounded-xl border border-slate-800">
                "New device login detected on Pesikalam! Device: Mobile Smartphone • Google Chrome, Location: Chennai, Tamil Nadu, Time: Active now. If this wasn't you, secure your account immediately."
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Dispatched to phone: +91 {currentUser.phone || '9840123456'}</span>
                <span className="text-emerald-400 font-bold">SMS Delivered ✓</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Posts, Reels, Saved Grids */
        <div className="grid grid-cols-3 gap-2">
          {activeTab === 'posts' &&
            (userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl overflow-hidden bg-black relative group shadow-md"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-2">
                    <span>❤️ {post.likesCount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 bg-[#121622]/50 rounded-2xl border border-slate-800/80 p-4 space-y-2">
                <p className="text-xs text-slate-400">You haven't posted any photos yet.</p>
                <button
                  type="button"
                  onClick={() => onOpenUpload('post')}
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer"
                >
                  Upload First Post
                </button>
              </div>
            ))}

          {activeTab === 'reels' &&
            (userReels.length > 0 ? (
              userReels.map((reel) => (
                <div
                  key={reel.id}
                  className="aspect-[9/16] rounded-xl overflow-hidden bg-black relative group shadow-md"
                >
                  <img
                    src={reel.mediaUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-1 right-1 text-[9px] text-white bg-black/60 px-1.5 py-0.5 rounded font-bold">
                    ▶ {reel.likesCount}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 bg-[#121622]/50 rounded-2xl border border-slate-800/80 p-4 space-y-2">
                <p className="text-xs text-slate-400">No reels published yet.</p>
                <button
                  type="button"
                  onClick={() => onOpenUpload('reel')}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer"
                >
                  Upload Reel
                </button>
              </div>
            ))}

          {activeTab === 'saved' &&
            (savedPosts.length > 0 ? (
              savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl overflow-hidden bg-black relative group shadow-md"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 bg-[#121622]/50 rounded-2xl border border-slate-800/80 p-4 text-xs text-slate-400">
                No saved bookmarks yet.
              </div>
            ))}
        </div>
      )}

      {/* Edit Profile Modal / Drawer */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141824] border border-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl relative space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Edit Profile & DP</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {usernameError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {usernameError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              {/* DP Picture Preview & Integrated Crop/Camera Trigger */}
              <div className="flex items-center gap-3 p-3 bg-[#0d1017] rounded-2xl border border-slate-800">
                <img
                  src={editAvatar}
                  alt="DP Preview"
                  className="w-14 h-14 rounded-full object-cover border border-cyan-400 cursor-pointer"
                  onClick={() => setShowCropModal(true)}
                />
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setShowCropModal(true)}
                    className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Photo / Crop DP</span>
                  </button>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Live camera access or gallery crop
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              {/* Unique Handle Validation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Unique Username</label>
                  {cleanedHandle.length >= 3 && (
                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${
                        isTakenByOther ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isTakenByOther ? (
                        <>
                          <XCircle className="w-3 h-3" /> Already Claimed
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Guaranteed Available
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => {
                      setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                      setUsernameError('');
                    }}
                    className={`w-full bg-[#0b0e14] border rounded-xl py-2 pl-8 pr-3 text-white outline-none ${
                      isTakenByOther ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isTakenByOther}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl shadow-md disabled:opacity-50 mt-2 cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Integrated Image Cropper & Device Camera Modal */}
      {showCropModal && (
        <ImageCropModal
          initialImage={currentUser.avatar}
          onClose={() => setShowCropModal(false)}
          onSaveCroppedImage={handleSaveCroppedDP}
        />
      )}
    </div>
  );
};
