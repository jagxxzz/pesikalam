import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCode,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { FileScanResult } from '../types';
import { sounds } from '../utils/soundEffects';

interface FileSafetyWarningModalProps {
  scanResult: FileScanResult;
  onBlockAndDelete: () => void;
  onProceedAnyway: () => void;
}

export const FileSafetyWarningModal: React.FC<FileSafetyWarningModalProps> = ({
  scanResult,
  onBlockAndDelete,
  onProceedAnyway,
}) => {
  const isCritical = scanResult.threatLevel === 'critical';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in">
      <div className="bg-[#121622] border-2 border-rose-500/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-rose-950/50 flex flex-col animate-in zoom-in-95">
        {/* Red Threat Header */}
        <div className="bg-gradient-to-r from-rose-900/80 via-red-950 to-[#181120] p-5 border-b border-rose-500/40 text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/30 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-rose-500 text-black text-[10px] font-black uppercase tracking-widest mb-1.5">
            Security Shield Active
          </span>
          <h3 className="text-lg font-black text-white">Risk Detected!</h3>
          <p className="text-xs text-rose-200 mt-1">
            This file may be harmful to your device or privacy.
          </p>
        </div>

        {/* Threat File Details */}
        <div className="p-5 space-y-4 text-left">
          <div className="bg-[#0b0e15] border border-rose-500/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 border border-rose-500/20">
              <FileCode className="w-6 h-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-white truncate block">
                  {scanResult.fileName}
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase shrink-0">
                  {scanResult.extension || 'BIN'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Size: {(scanResult.fileSize / 1024).toFixed(1)} KB • {scanResult.threatLevel.toUpperCase()} THREAT
              </div>
              {scanResult.threatName && (
                <div className="text-[11px] font-bold text-rose-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{scanResult.threatName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Threat Reasons */}
          <div className="bg-[#181d2a] rounded-2xl p-3.5 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Threat Inspection Diagnostics:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {scanResult.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span className="leading-tight">{reason}</span>
                </li>
              ))}
            </ul>
            <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Hash: {scanResult.scanHash.substring(0, 18)}...</span>
              <span>Scanned at {scanResult.scannedAt}</span>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-200 leading-relaxed">
            <strong>Security Architect Recommendation:</strong> Executable code, unauthorized APKs, or suspicious scripts can access private photos, camera, or passwords. Blocking is strongly recommended.
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onBlockAndDelete();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Block & Delete (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onProceedAnyway();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Proceed Anyway (At your own risk)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
