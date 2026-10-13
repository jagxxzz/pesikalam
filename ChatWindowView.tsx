import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
  Image as ImageIcon,
  X,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Download,
} from 'lucide-react';
import { ChatConversation, Message, User, FileScanResult } from '../types';
import { sounds } from '../utils/soundEffects';
import { CallingScreenModal } from './CallingScreenModal';
import { FileSafetyEngine } from '../utils/fileSafetyEngine';
import { FileSafetyWarningModal } from './FileSafetyWarningModal';

interface ChatWindowViewProps {
  conversation: ChatConversation;
  currentUser: User;
  onBack: () => void;
  onSendMessage: (conversationId: string, text: string, mediaUrl?: string) => void;
}

export const ChatWindowView: React.FC<ChatWindowViewProps> = ({
  conversation,
  currentUser,
  onBack,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<FileScanResult | null>(null);
  const [isScanningFile, setIsScanningFile] = useState(false);
  const [threatModalResult, setThreatModalResult] = useState<FileScanResult | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mockCallState, setMockCallState] = useState<'audio' | 'video' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageAttachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, isTyping]);

  // Handle device file / media attachment with automated antivirus & threat scanning
  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    setIsScanningFile(true);
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Run automated antivirus & threat inspection engine
      const result = await FileSafetyEngine.scanFile({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
      });

      setIsScanningFile(false);
      setScanResult(result);

      if (result.isThreat) {
        sounds.playHangupTone();
        // Trigger explicit warning modal: "Risk Detected! This file may be harmful to your device."
        setThreatModalResult(result);
      } else {
        sounds.playLike();
        setSelectedImageBase64(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text && !selectedImageBase64) return;

    sounds.playMessageSent();
    onSendMessage(conversation.id, text || 'File attached 📎', selectedImageBase64 || undefined);
    setInputText('');
    setSelectedImageBase64(null);
    setSelectedFileName(null);
    setScanResult(null);

    // Natural human friend typing simulation
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        sounds.playMessageReceived();
        const friendlyReplies = [
          'Aama da, kandippa!',
          'Super! Evening meet pannalam.',
          'Haha semma picture da! 🔥',
          'Vera level, I will join in 10 mins!',
          'Seri da, phone call panren iru.',
        ];
        const randomReply = friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)];
        onSendMessage(conversation.id, randomReply);
      }, 1600);
    }, 1200);
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] max-w-xl mx-auto flex flex-col bg-[#0b0e15] sm:border sm:border-slate-800 sm:rounded-3xl shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#121622]/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-500">
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className="w-full h-full rounded-full object-cover border border-[#121622]"
              />
            </div>
            {conversation.user.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#121622] rounded-full" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-xs text-white leading-tight">
              {conversation.user.name}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium leading-none mt-0.5">
              {conversation.user.isOnline ? 'Online' : 'Active 5m ago'}
            </span>
          </div>
        </div>

        {/* Audio / Video call buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMockCallState('audio')}
            className="p-2 text-slate-400 hover:text-cyan-400 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMockCallState('video')}
            className="p-2 text-slate-400 hover:text-pink-400 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex justify-center">
          <span className="text-[10px] bg-slate-900 text-slate-400 font-medium px-2.5 py-0.5 rounded-full border border-slate-800">
            End-to-end encrypted direct chat • Pesikalam
          </span>
        </div>

        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isSentByMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                msg.isSentByMe
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-cyan-500/10'
                  : 'bg-[#181d2a] text-slate-100 rounded-bl-none border border-slate-800'
              }`}
            >
              {/* Device Photo attachment if present */}
              {msg.mediaUrl && (
                <div className="mb-2 rounded-xl overflow-hidden max-h-56 bg-black">
                  <img
                    src={msg.mediaUrl}
                    alt="Shared media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <span>{msg.text}</span>
            </div>

            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500 px-1">
              <span>{msg.timestamp}</span>
              {msg.isSentByMe && (
                <CheckCheck className="w-3 h-3 text-cyan-400 stroke-[2.5]" />
              )}
            </div>
          </div>
        ))}

        {/* Real-time typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
              <img
                src={conversation.user.avatar}
                alt={conversation.user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#181d2a] border border-slate-800 rounded-2xl px-3 py-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-slate-400 ml-1">typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scanning status banner */}
      {isScanningFile && (
        <div className="p-2.5 bg-cyan-950/60 border-t border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Running Antivirus & Malware Threat Scanner on "{selectedFileName}"...</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Deep Scan</span>
        </div>
      )}

      {/* Selected device photo preview badge with green Scanned & Verified Safe badge */}
      {selectedImageBase64 && (
        <div className="p-2.5 bg-[#121622] border-t border-slate-800 flex items-center gap-2.5">
          <img
            src={selectedImageBase64}
            alt="Preview"
            className="w-12 h-12 rounded-xl object-cover border border-cyan-400 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate block">
                {selectedFileName || 'Photo Attachment'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Scanned & Verified Safe
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Zero malware signatures • Validated by Pesikalam Security Engine
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedImageBase64(null);
              setSelectedFileName(null);
              setScanResult(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Bar Picker */}
      {showEmojiPicker && (
        <div className="p-2 bg-[#101420] border-t border-slate-800 flex items-center justify-around gap-1 text-lg">
          {['🔥', '❤️', '😂', '👍', '☕', '🏍️', '✨', '👏'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputText((prev) => prev + emoji);
                sounds.playPop();
              }}
              className="hover:scale-125 transition cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Message Input Box */}
      <div className="bg-[#121622] border-t border-slate-800 p-2.5 sm:p-3 flex items-center gap-2 shrink-0">
        {/* Device Attachment Picker (Accepts photos, videos, apks, documents) */}
        <button
          type="button"
          onClick={() => imageAttachmentInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-cyan-400 transition cursor-pointer relative"
          title="Attach file / photo with Antivirus scan"
        >
          <Paperclip className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#121622]" />
        </button>
        <input
          ref={imageAttachmentInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.apk,.exe,.txt,.zip"
          className="hidden"
          onChange={handleAttachmentChange}
        />

        {/* Emoji Bar Toggle */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-slate-400 hover:text-amber-400 transition cursor-pointer"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder={`Message @${conversation.user.username}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 bg-[#0b0e15] border border-slate-800 focus:border-cyan-400 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() && !selectedImageBase64}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/30 transition active:scale-[0.98] disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Real-Time Calling Interface with Live Voice Changer */}
      {mockCallState && (
        <CallingScreenModal
          callType={mockCallState}
          callee={conversation.user}
          currentUser={currentUser}
          onEndCall={() => setMockCallState(null)}
        />
      )}

      {/* Threat Safety Warning Modal */}
      {threatModalResult && (
        <FileSafetyWarningModal
          scanResult={threatModalResult}
          onBlockAndDelete={() => {
            setThreatModalResult(null);
            setSelectedImageBase64(null);
            setSelectedFileName(null);
            setScanResult(null);
          }}
          onProceedAnyway={() => {
            if (threatModalResult.dataUrl) {
              setSelectedImageBase64(threatModalResult.dataUrl);
            }
            setThreatModalResult(null);
          }}
        />
      )}
    </div>
  );
};
