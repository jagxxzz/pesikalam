import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  Circle,
  Square,
  Upload,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ImageCropModalProps {
  initialImage?: string | null;
  onClose: () => void;
  onSaveCroppedImage: (croppedBase64: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  initialImage,
  onClose,
  onSaveCroppedImage,
}) => {
  // Mode: 'choose' | 'camera' | 'crop'
  const [mode, setMode] = useState<'choose' | 'camera' | 'crop'>(
    initialImage ? 'crop' : 'choose'
  );
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null);

  // Cropper Controls State
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [cropShape, setCropShape] = useState<'circle' | 'square'>('circle');
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initialize and Stop Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setCameraReady(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check permissions.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, stopCamera]);

  // Capture Photo from Camera Viewfinder
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    sounds.playLike();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for natural mirror selfie view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setImageSrc(capturedDataUrl);
    stopCamera();
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setMode('crop');
  };

  // Handle Gallery Selection
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setMode('crop');
      }
    };
    reader.readAsDataURL(file);
  };

  // Dragging to Pan Image
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render and Export Cropped Image via Canvas
  const handleApplyCrop = () => {
    if (!imageSrc) return;
    sounds.playLike();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const outputSize = 400; // 400x400 high-resolution avatar
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Circular clipping path if circle shape
      if (cropShape === 'circle') {
        ctx.beginPath();
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
      }

      ctx.fillStyle = '#0b0e15';
      ctx.fillRect(0, 0, outputSize, outputSize);

      ctx.save();
      ctx.translate(outputSize / 2 + pan.x, outputSize / 2 + pan.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw image centered
      const aspect = img.width / img.height;
      let drawW = outputSize;
      let drawH = outputSize;
      if (aspect > 1) {
        drawH = outputSize;
        drawW = outputSize * aspect;
      } else {
        drawW = outputSize;
        drawH = outputSize / aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      onSaveCroppedImage(croppedBase64);
      onClose();
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#121622] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              {mode === 'choose'
                ? 'Profile Photo Options'
                : mode === 'camera'
                ? 'Take Profile Photo'
                : 'Crop & Adjust Photo'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CHOOSE SOURCE SCREEN */}
        {mode === 'choose' && (
          <div className="p-6 space-y-4 text-center">
            <p className="text-xs text-slate-300">
              Select how you would like to update your profile photo:
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Take Photo with Camera */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setMode('camera');
                }}
                className="p-5 rounded-2xl bg-[#0e121c] hover:bg-[#161c28] border border-cyan-500/30 hover:border-cyan-400 flex flex-col items-center gap-2.5 transition active:scale-95 cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-left text-center">
                  <div className="text-xs font-bold text-white">Take Photo</div>
                  <div className="text-[10px] text-slate-400">Direct Camera Access</div>
                </div>
              </button>

              {/* Upload from Gallery */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  galleryInputRef.current?.click();
                }}
                className="p-5 rounded-2xl bg-[#0e121c] hover:bg-[#161c28] border border-purple-500/30 hover:border-purple-400 flex flex-col items-center gap-2.5 transition active:scale-95 cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-left text-center">
                  <div className="text-xs font-bold text-white">Upload Gallery</div>
                  <div className="text-[10px] text-slate-400">Choose from Storage</div>
                </div>
              </button>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryFileChange}
              />
            </div>
          </div>
        )}

        {/* 2. DIRECT DEVICE CAMERA SCREEN */}
        {mode === 'camera' && (
          <div className="p-4 flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden bg-black border-2 border-cyan-500/50 shadow-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {/* Viewfinder Circle Target Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full border-2 border-dashed border-cyan-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-black/85 p-4 flex flex-col items-center justify-center text-center text-xs text-rose-300 gap-2">
                  <p>{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Retry Access
                  </button>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={!cameraReady}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/30 active:scale-95 transition disabled:opacity-40 cursor-pointer"
                title="Snap Photo"
              >
                <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Gallery
              </button>
            </div>
          </div>
        )}

        {/* 3. INTERACTIVE CROPPER SCREEN */}
        {mode === 'crop' && imageSrc && (
          <div className="p-4 flex flex-col space-y-3.5 overflow-y-auto">
            {/* Viewport Mask Container with Touch & Drag support */}
            <div
              className="relative w-full aspect-square max-w-[320px] mx-auto rounded-3xl overflow-hidden bg-black border border-slate-700 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Image with transforms */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-none w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Viewport Cutout Mask */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className={`w-60 h-60 border-2 border-cyan-400 transition-all ${
                    cropShape === 'circle'
                      ? 'rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]'
                      : 'rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]'
                  }`}
                >
                  {/* Subtle Grid crosshairs */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-25">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>
                </div>
              </div>

              {/* Pan Helper Badge */}
              <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                <span className="text-[10px] bg-black/60 text-slate-300 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Drag to reposition • Pinch or slide to zoom
                </span>
              </div>
            </div>

            {/* Adjustments Tool Controls */}
            <div className="space-y-2.5 bg-[#0e121c] p-3 rounded-2xl border border-slate-800">
              {/* Zoom Slider */}
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Shape & Rotation Buttons */}
              <div className="flex items-center justify-between pt-1">
                {/* Crop Shape: Circle vs Square */}
                <div className="flex bg-[#07090e] p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCropShape('circle');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      cropShape === 'circle'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400'
                    }`}
                  >
                    <Circle className="w-3.5 h-3.5" />
                    <span>Circle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setCropShape('square');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      cropShape === 'square'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Square</span>
                  </button>
                </div>

                {/* Rotate 90° */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setRotation((prev) => (prev + 90) % 360);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rotate</span>
                </button>

                {/* Retake / Change Photo */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setMode('choose');
                  }}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Action Save Button */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Profile Picture</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
