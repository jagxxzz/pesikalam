import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '../types';
import { sounds } from '../utils/soundEffects';

interface StoriesBarProps {
  currentUser: User;
  stories: Story[];
  onSelectStory: (storyId: string) => void;
  onAddStoryFile: (fileUrl: string) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  currentUser,
  stories,
  onSelectStory,
  onAddStoryFile,
}) => {
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  const handleStoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playLike();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onAddStoryFile(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-[#0b0e15] border-b border-slate-800/80 py-3 px-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5 max-w-xl mx-auto px-1">
        {/* Your Kathai (+) Circle with Device File Picker */}
        <div
          className="flex flex-col items-center shrink-0 cursor-pointer group"
          onClick={() => storyFileInputRef.current?.click()}
        >
          <div className="relative p-0.5">
            <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-slate-800 group-hover:bg-cyan-500/50 transition">
              <img
                src={currentUser.avatar}
                alt="Your Kathai"
                className="w-full h-full rounded-full object-cover border-2 border-[#0b0e15]"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center border-2 border-[#0b0e15] shadow-md group-hover:scale-110 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] text-slate-300 font-semibold mt-1 truncate max-w-[72px]">
            Your Kathai +
          </span>

          <input
            ref={storyFileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleStoryFileChange}
          />
        </div>

        {/* Stories list */}
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              onSelectStory(story.id);
            }}
            className="flex flex-col items-center shrink-0 cursor-pointer group focus:outline-none"
          >
            <div
              className={`w-[68px] h-[68px] rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
                story.isSeen
                  ? 'bg-slate-700/80'
                  : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 animate-story-gradient shadow-md shadow-pink-500/20'
              }`}
            >
              <div className="w-full h-full rounded-full p-[2px] bg-[#0b0e15]">
                <img
                  src={story.userAvatar}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <span className="text-[11px] font-medium truncate max-w-[68px] text-slate-200 mt-1">
              {story.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
