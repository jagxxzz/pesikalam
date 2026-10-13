export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  password?: string;
  dob?: string;
  avatar: string;
  bio: string;
  location?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  highlights?: { id: string; title: string; cover: string }[];
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  isSeen: boolean;
  musicTrack?: string;
}

export interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked: boolean;
}

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  location: string;
  musicTrack?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: string;
  comments: Comment[];
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface Reel {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  mediaUrl: string;
  videoPlaceholderUrl?: string;
  caption: string;
  musicTrack: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSentByMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string; // Device photo attachment
  isVoiceNote?: boolean;
  audioDuration?: string;
}

export interface ChatConversation {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    tagline?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface DeviceSession {
  id: string;
  username: string;
  deviceName: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  loginTime: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface SecurityAlert {
  id: string;
  username: string;
  phone: string;
  type: 'NEW_DEVICE_LOGIN';
  title: string;
  message: string;
  device: string;
  location: string;
  timestamp: string;
  deliveredVia: 'SMS' | 'IN_APP';
}

export interface VoicePreset {
  id: string;
  name: string;
  tamilTag: string;
  category: 'Cinematic' | 'Sci-Fi' | 'Fun' | 'Acoustic' | 'Vocal';
  icon: string;
  description: string;
  pitch: number; // semi-tone or relative shift
  distortion: number; // 0 to 1
  reverb: number; // 0 to 1
  delay: number; // 0 to 1
  filterType: BiquadFilterType;
  filterFreq: number;
}

export interface PhoneContact {
  id: string;
  name: string;
  phone: string;
  matchedUser?: User | null;
  isRegistered: boolean;
  avatarPlaceholder?: string;
  relationshipTag?: string;
}

export interface FileScanResult {
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  extension: string;
  isThreat: boolean;
  threatLevel: 'safe' | 'low' | 'suspicious' | 'critical';
  threatName?: string;
  reasons: string[];
  scanHash: string;
  scannedAt: string;
  status: 'scanning' | 'clean' | 'threat_detected';
  dataUrl?: string;
}

