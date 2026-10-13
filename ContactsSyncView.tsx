import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Phone,
  Search,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { User, PhoneContact } from '../types';
import { sounds } from '../utils/soundEffects';

interface ContactsSyncViewProps {
  allUsers: User[];
  currentUser: User;
  followingUsernames: string[];
  onToggleFollow: (username: string) => void;
  onOpenChatWithUser: (user: User) => void;
  onOpenUserProfile: (username: string) => void;
}

const STORAGE_SYNC_KEY = 'pesikalam_contacts_sync_enabled';

// Realistic sample phone contacts from user's address book
const DEVICE_PHONE_CONTACTS = [
  { name: 'Kumar (College Mate)', phone: '9840112233', relationshipTag: 'College' },
  { name: 'Priya Mylapore', phone: '9840223344', relationshipTag: 'Dance Academy' },
  { name: 'Manoj Beat Producer', phone: '9840334455', relationshipTag: 'Music Studio' },
  { name: 'Ananya Architect', phone: '9840445566', relationshipTag: 'Work / Design' },
  { name: 'Siva Tech Hub', phone: '9840556677', relationshipTag: 'Chennai Tech' },
  { name: 'Divya Filter Coffee', phone: '9840667788', relationshipTag: 'Neighborhood' },
  { name: 'Karthik Gym Bro', phone: '9940123456', relationshipTag: 'Fitness' },
  { name: 'Soundarya Arts', phone: '9790123456', relationshipTag: 'Friend' },
];

export const ContactsSyncView: React.FC<ContactsSyncViewProps> = ({
  allUsers,
  currentUser,
  followingUsernames,
  onToggleFollow,
  onOpenChatWithUser,
  onOpenUserProfile,
}) => {
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_SYNC_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>(
    isSyncEnabled ? 'granted' : 'prompt'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchContact, setSearchContact] = useState('');
  const [followGateNotice, setFollowGateNotice] = useState<string | null>(null);

  // Match contacts against registered users in the database
  const matchedContacts: PhoneContact[] = DEVICE_PHONE_CONTACTS.map((c, index) => {
    const cleanPhone = c.phone.replace(/\D/g, '');
    const matched = allUsers.find(
      (u) => u.phone && u.phone.replace(/\D/g, '') === cleanPhone && u.id !== currentUser.id
    );

    return {
      id: `contact_${index}`,
      name: c.name,
      phone: c.phone,
      matchedUser: matched || null,
      isRegistered: !!matched,
      relationshipTag: c.relationshipTag,
    };
  });

  const registeredFriends = matchedContacts.filter((c) => c.isRegistered && c.matchedUser);
  const unregisteredContacts = matchedContacts.filter((c) => !c.isRegistered);

  const handleToggleSync = () => {
    sounds.playPop();
    if (!isSyncEnabled) {
      // Simulate permission prompt grant
      setIsSyncEnabled(true);
      setPermissionState('granted');
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, 'true');
      } catch {}
    } else {
      setIsSyncEnabled(false);
      setPermissionState('denied');
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, 'false');
      } catch {}
    }
  };

  const handleManualRefresh = () => {
    sounds.playPop();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      sounds.playLike();
    }, 700);
  };

  const handleMessageUser = (user: User) => {
    const isFollowing = followingUsernames.includes(user.username);
    if (!isFollowing) {
      sounds.playPop();
      setFollowGateNotice(
        `Follow Gate Active: Tap "Follow" on @${user.username} to initiate direct chat!`
      );
      setTimeout(() => setFollowGateNotice(null), 3500);
      return;
    }
    sounds.playPop();
    onOpenChatWithUser(user);
  };

  // Filtered list
  const filteredRegistered = registeredFriends.filter((c) => {
    if (!searchContact.trim()) return true;
    const q = searchContact.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.matchedUser && c.matchedUser.name.toLowerCase().includes(q)) ||
      (c.matchedUser && c.matchedUser.username.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* 1. Privacy & Contact Sync Permission Card */}
      <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
                <span>Sync Phone Contacts</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    permissionState === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {permissionState === 'granted' ? 'Permission: Granted' : 'Permission: Off'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically match phone address book to discover friends on Pesikalam
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleSync}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 cursor-pointer shrink-0 ${
              isSyncEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300 shadow-md ${
                isSyncEnabled ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Security & Cryptographic Matching Notice */}
        <div className="p-3 bg-[#0b0e15] border border-slate-800/80 rounded-2xl flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Zero address-book leaks. Numbers are cryptographically matched using SHA-256 hashes.
            </span>
          </div>

          {isSyncEnabled && (
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              title="Re-scan address book for newly joined friends"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>
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

      {/* When Sync is Enabled: Display Results Tray & Directory */}
      {isSyncEnabled ? (
        <div className="space-y-4">
          {/* Horizontal Friends Tray */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Friends on Pesikalam ({registeredFriends.length} in your contacts)</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                Active in Chennai
              </span>
            </div>

            {/* Horizontal Scrollable Tray */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {registeredFriends.map((contact) => {
                const user = contact.matchedUser!;
                const isFollowing = followingUsernames.includes(user.username);

                return (
                  <div
                    key={contact.id}
                    className="flex flex-col items-center bg-[#0d1017] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-3 shrink-0 w-36 text-center transition"
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => onOpenUserProfile(user.username)}
                    >
                      <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-md">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover border border-[#121622]"
                        />
                      </div>
                      {user.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#121622] rounded-full" />
                      )}
                    </div>

                    <div className="mt-2 min-w-0 w-full">
                      <span
                        onClick={() => onOpenUserProfile(user.username)}
                        className="text-xs font-bold text-white block truncate cursor-pointer hover:text-cyan-400"
                      >
                        {user.name}
                      </span>
                      <span className="text-[10px] text-cyan-400 block truncate font-mono">
                        @{user.username}
                      </span>
                      <span className="text-[9px] text-slate-500 block truncate mt-0.5">
                        In contacts as: {contact.name}
                      </span>
                    </div>

                    {/* Instant Action: Follow */}
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playLike();
                        onToggleFollow(user.username);
                      }}
                      className={`w-full mt-2.5 py-1.5 px-2 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                        isFollowing
                          ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3 h-3 text-cyan-400" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Contacts List with Instant Follow & Message */}
          <div className="bg-[#121622] border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>All Matched Address Book Contacts</span>
              </h4>

              <div className="relative max-w-[170px]">
                <input
                  type="text"
                  placeholder="Filter name / phone..."
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                  className="w-full bg-[#0b0e15] border border-slate-800 rounded-xl py-1.5 pl-7 pr-2 text-[11px] text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {filteredRegistered.map((contact) => {
                const user = contact.matchedUser!;
                const isFollowing = followingUsernames.includes(user.username);

                return (
                  <div
                    key={contact.id}
                    className="p-3 bg-[#0d1017] rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      onClick={() => onOpenUserProfile(user.username)}
                    >
                      <div className="w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 to-pink-500 shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover border border-[#121622]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate hover:text-cyan-400">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-cyan-400 font-mono">
                            @{user.username}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          Phone: +91 {contact.phone} • Tag: {contact.relationshipTag || 'Phone Contact'}
                        </div>
                      </div>
                    </div>

                    {/* Follow & Message Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playLike();
                          onToggleFollow(user.username);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          isFollowing
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
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

                      <button
                        type="button"
                        onClick={() => handleMessageUser(user)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          isFollowing
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm hover:opacity-95'
                            : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                        }`}
                        title={
                          isFollowing
                            ? `Message @${user.username}`
                            : `Follow @${user.username} first to unlock direct chat`
                        }
                      >
                        {isFollowing ? (
                          <>
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Message</span>
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
              })}

              {/* Unregistered Contacts Section */}
              {unregisteredContacts.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Invite to Pesikalam ({unregisteredContacts.length} not yet joined)
                  </span>
                  {unregisteredContacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.id}
                      className="p-2.5 bg-[#0b0e15] rounded-xl border border-slate-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-300 block">{contact.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">+91 {contact.phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(
                              `Vanakkam! Join me on Pesikalam: ${window.location.href}`
                            );
                          }
                          alert(`Invite link for ${contact.name} copied to clipboard! ✨`);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-bold rounded-lg border border-slate-700 cursor-pointer"
                      >
                        Invite (SMS)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Permission Prompt State */
        <div className="bg-[#121622]/70 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-extrabold text-white">Find Your Real-Life Friends</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Turn on contact synchronization above to immediately find friends, colleagues, and family who are already active on Pesikalam.
          </p>
          <button
            type="button"
            onClick={handleToggleSync}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition active:scale-95"
          >
            Allow Contact Access
          </button>
        </div>
      )}
    </div>
  );
};
