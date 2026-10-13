import { User, Post, Reel, Story, ChatConversation } from '../types';

const USERS_KEY = 'pesikalam_users';
const CURRENT_USER_KEY = 'pesikalam_current_user';
const POSTS_KEY = 'pesikalam_posts';
const REELS_KEY = 'pesikalam_reels';
const STORIES_KEY = 'pesikalam_stories';
const CONVERSATIONS_KEY = 'pesikalam_conversations';
const FOLLOWING_KEY = 'pesikalam_following';

export const storage = {
  getUsers: (fallback: User[]): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setUsers: (users: User[]) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  },

  setCurrentUser: (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      // ignore
    }
  },

  getPosts: (fallback: Post[]): Post[] => {
    try {
      const data = localStorage.getItem(POSTS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setPosts: (posts: Post[]) => {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  },

  getReels: (fallback: Reel[]): Reel[] => {
    try {
      const data = localStorage.getItem(REELS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setReels: (reels: Reel[]) => {
    try {
      localStorage.setItem(REELS_KEY, JSON.stringify(reels));
    } catch {
      // ignore
    }
  },

  getStories: (fallback: Story[]): Story[] => {
    try {
      const data = localStorage.getItem(STORIES_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setStories: (stories: Story[]) => {
    try {
      localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
    } catch {
      // ignore
    }
  },

  getConversations: (fallback: ChatConversation[]): ChatConversation[] => {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setConversations: (conversations: ChatConversation[]) => {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  },

  getFollowing: (fallback: string[]): string[] => {
    try {
      const data = localStorage.getItem(FOLLOWING_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  },

  setFollowing: (following: string[]) => {
    try {
      localStorage.setItem(FOLLOWING_KEY, JSON.stringify(following));
    } catch {
      // ignore
    }
  },
};
