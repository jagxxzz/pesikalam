import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  RotateCw,
  Video,
  VideoOff,
  Wand2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { User, VoicePreset } from '../types';
import { VOICE_PRESETS, voiceChangerEngine } from '../utils/voiceChangerProcessor';
import { VoiceChangerModal } from './VoiceChangerModal';
import { sounds } from '../utils/soundEffects';

interface CallingScreenModalProps {
  callType: 'audio' | 'video';
  callee: {
    name: string;
    username: string;
    avatar: string;
    isOnline?: boolean;
  };
  currentUser: User;
  onEndCall: () => void;
}

export const CallingScreenModal: React.FC<CallingScreenModalProps> = ({
  callType,
  callee,
  currentUser,
  onEndCall,
}) => {
  // Call status: 'ringing' | 'connected'
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  // Active Call Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Voice Changer State
  const [showVoiceChanger, setShowVoiceChanger] = useState(false);
  const [activeVoicePreset, setActiveVoicePreset] = useState<VoicePreset>(
    VOICE_PRESETS.find((p) => p.id === 'deep_bass') || VOICE_PRESETS[0]
  );

  // Timer Ref
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Start ring tone
    sounds.startRingTone();

    // Auto-answer after 2.4 seconds to simulate realistic connection
    const connectTimer = setTimeout(() => {
      sounds.stopRingTone();
      sounds.playCallConnected();
      setCallStatus('connected');

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 2400);

    return () => {
      sounds.stopRingTone();
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      voiceChangerEngine.stop();
    };
  }, []);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleEndCall = () => {
    sounds.stopRingTone();
    sounds.playHangupTone();
    voiceChangerEngine.stop();
    onEndCall();
  };

  const toggleMute = () => {
    sounds.playPop();
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    sounds.playPop();
    setIsSpeakerOn(!isSpeakerOn);
  };

  const toggleVideo = () => {
    sounds.playPop();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleFlipCamera = () => {
    sounds.playPop();
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b10] flex flex-col justify-between overflow-hidden select-none animate-in fade-in">
      {/* Background for Video Call or Atmospheric ambient gradient for Audio Call */}
      {callType === 'video' && isVideoEnabled ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Callee Fullscreen Simulated Video Backdrop */}
          <img
            src={callee.avatar}
            alt={callee.name}
            className="w-full h-full object-cover filter brightness-75 scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

          {/* User Self Floating PiP (Picture-in-Picture) */}
          <div className="absolute top-16 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl z-20 bg-black">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-full h-full object-cover ${
                isFrontCamera ? 'scale-x-[-1]' : ''
              }`}
            />
            <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
              You
            </div>
            <button
              type="button"
              onClick={handleFlipCamera}
              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
              title="Flip Camera"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0e1424] via-[#10101f] to-[#08090d]">
          {/* Neon Soundwave Pulsing Ambience */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
        </div>
      )}

      {/* Top Bar: Caller Info & Status */}
      <div className="relative z-10 p-5 pt-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs mb-3 shadow-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pesikalam End-to-End Encrypted HD Call</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-wide">{callee.name}</h2>
        <p className="text-xs text-cyan-400 font-bold mt-0.5">@{callee.username}</p>

        <div className="mt-2 text-xs font-mono font-semibold tracking-wider flex items-center gap-2">
          {callStatus === 'ringing' ? (
            <span className="text-amber-400 animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
              Ringing...
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Connected • {formatDuration(callDuration)}
            </span>
          )}
        </div>

        {/* Active Voice Changer Filter Badge */}
        {activeVoicePreset && (
          <button
            type="button"
            onClick={() => setShowVoiceChanger(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/70 to-pink-900/70 border border-purple-500/50 text-white text-xs font-bold shadow-lg hover:border-pink-400 transition cursor-pointer active:scale-95"
          >
            <span className="text-sm">{activeVoicePreset.icon}</span>
            <span>Voice FX: {activeVoicePreset.name}</span>
            <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
          </button>
        )}
      </div>

      {/* Center Visualizer / Avatar (Audio Call) */}
      {callType === 'audio' && (
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {/* Pulsing Avatar Frame */}
          <div className="relative">
            <div
              className={`w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-2xl transition duration-500 ${
                callStatus === 'ringing'
                  ? 'animate-pulse shadow-cyan-500/50'
                  : 'shadow-purple-500/40 ring-4 ring-cyan-400/20'
              }`}
            >
              <img
                src={callee.avatar}
                alt={callee.name}
                className="w-full h-full rounded-full object-cover border-4 border-[#090b10]"
              />
            </div>

            {/* Speaking Audio Wave Visualizer Bars */}
            {callStatus === 'connected' && !isMuted && (
              <div className="flex items-center justify-center gap-1 mt-6">
                {[12, 24, 38, 52, 34, 46, 28, 16].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1.5 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls Dock */}
      <div className="relative z-10 p-6 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-6">
        {/* Quick Voice Changer Pill Button */}
        <button
          type="button"
          onClick={() => setShowVoiceChanger(true)}
          className="px-5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-purple-500/60 hover:border-purple-400 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-purple-500/20 active:scale-95 cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-pink-400" />
          <span>Real-Time Voice Changer (22 FX Presets)</span>
          <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded font-mono">
            LIVE
          </span>
        </button>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {/* Mute Mic */}
          <button
            type="button"
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition shadow-lg cursor-pointer active:scale-95 ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500'
                : 'bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Speakerphone */}
          <button
            type="button"
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition shadow-lg cursor-pointer active:scale-95 ${
              isSpeakerOn
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400'
                : 'bg-slate-800/90 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Speakerphone"
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Video Toggle (If video call) */}
          {callType === 'video' ? (
            <button
              type="button"
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition shadow-lg cursor-pointer active:scale-95 ${
                isVideoEnabled
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500'
              }`}
              title="Camera On/Off"
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
          ) : (
            /* Camera Flip / Effect */
            <button
              type="button"
              onClick={() => setShowVoiceChanger(true)}
              className="w-14 h-14 rounded-full bg-slate-800/90 text-pink-400 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center gap-1 transition shadow-lg cursor-pointer active:scale-95"
              title="Voice Changer"
            >
              <Wand2 className="w-6 h-6" />
            </button>
          )}

          {/* End Call (Red Button) */}
          <button
            type="button"
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Voice Changer Drawer / Modal */}
      {showVoiceChanger && (
        <VoiceChangerModal
          activePresetId={activeVoicePreset.id}
          onSelectPreset={(preset) => {
            setActiveVoicePreset(preset);
          }}
          onClose={() => setShowVoiceChanger(false)}
        />
      )}
    </div>
  );
};
