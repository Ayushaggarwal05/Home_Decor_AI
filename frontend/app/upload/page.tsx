'use client';

import React, { useState } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { roomService } from '@/services/room.service';
import { useRoomPolling } from '@/hooks/useRoomPolling';
import { useToastStore } from '@/store/toastStore';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import UploadDropzone from '@/components/upload/UploadDropzone';
import ImagePreview from '@/components/upload/ImagePreview';
import PromptInput from '@/components/upload/PromptInput';
import UploadProgress from '@/components/upload/UploadProgress';
import { CameraGuidanceBanner } from '@/components/upload/CameraGuidanceBanner';
import { SpaceTypeSelector } from '@/components/upload/SpaceTypeSelector';
import { StylePresetSelector } from '@/components/upload/StylePresetSelector';
import { RoomScaleSelector } from '@/components/upload/RoomScaleSelector';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function UploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToastStore();
  const {
    uploadFile,
    uploadPreview,
    roomType,
    stylePreference,
    prompt,
    uploadStatus,
    activeRoomId,
    setRoomType,
    setStylePreference,
    setUploadProgress,
    setUploadStatus,
    setErrorMessage,
    addRoom,
    resetUploadState,
  } = useRoomStore();

  const [roomName, setRoomName] = React.useState('');
  const [dimensions, setDimensions] = useState<{ length: number; width: number; unit: 'ft' | 'm' }>({
    length: 16,
    width: 20,
    unit: 'ft'
  });

  // Once room is created, start polling for analysis
  useRoomPolling({ roomId: activeRoomId, enabled: uploadStatus === 'done' });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile) throw new Error('No image file selected.');

      setUploadStatus('uploading');

      const newRoom = await roomService.uploadRoom(
        uploadFile,
        roomName ||
          `${roomType.charAt(0).toUpperCase() + roomType.slice(1).replace('_', ' ')} Workspace`,
        roomType,
        stylePreference,
        prompt,
        (progress) => {
          setUploadProgress(progress);
          if (progress >= 100) {
            setUploadStatus('processing');
          }
        }
      );
      return newRoom;
    },
    onSuccess: (data) => {
      addRoom(data);
      setUploadStatus('done');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success(
        'Room uploaded! Spatial analysis is running in the background…'
      );
      resetUploadState();
      router.push('/research');
    },
    onError: (err: unknown) => {
      setUploadStatus('error');
      const msg =
        (err as { message?: string })?.message ||
        'Upload failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const isIdle = uploadStatus === 'idle';
  const isPending =
    uploadStatus === 'uploading' || uploadStatus === 'processing';

  return (
    <DashboardShell>
      <PageContainer>
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#B8860B] text-xs font-bold border border-[#D4AF37]/30">
                <Layers className="h-3.5 w-3.5" />
                <span>Spatial Project Studio</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F1A17] tracking-tight">
                Create New Room Environment Scan
              </h2>
              <p className="text-xs text-[#6E655F]">
                Mount landscape room photograph and set design heuristics for 3D AI spatial indexing.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <CameraGuidanceBanner />
            </div>
          </div>

          {/* Asymmetric Studio Canvas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: 7 Columns (Primary Photo Stage & Prompt) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Photo Stage */}
              <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1F1A17]">
                      1. Photo Stage Canvas
                    </h3>
                    <p className="text-xs text-[#6E655F] mt-0.5">
                      Upload raw landscape photo of your room environment
                    </p>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                    {uploadPreview ? 'Scan Ready ✓' : '16:9 Landscape Mode'}
                  </span>
                </div>

                {uploadPreview ? <ImagePreview /> : <UploadDropzone />}
              </div>

              {/* Progress Bar during Upload */}
              {isPending && <UploadProgress />}

              {/* AI Design Prompt Input Box */}
              <div className="bg-white border border-[#E8E2D8] rounded-3xl p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1F1A17]">
                    Custom Design Instructions & Notes
                  </h3>
                  <span className="text-[10px] text-[#6E655F]">Optional</span>
                </div>
                <PromptInput />
              </div>
            </div>

            {/* RIGHT COLUMN: 5 Columns (Controls & Launch CTA) */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#E8E2D8] rounded-3xl p-6 space-y-5 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1F1A17]">
                      2. Project Heuristics
                    </h3>
                    <p className="text-xs text-[#6E655F] mt-0.5">
                      Configure space type & target aesthetic
                    </p>
                  </div>

                  <Sliders className="h-4 w-4 text-[#B8860B]" />
                </div>

                {/* Room Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="room-name"
                    className="text-xs font-bold text-[#6E655F] uppercase tracking-wider block"
                  >
                    Project Label
                  </label>
                  <input
                    id="room-name"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Primary Living Room, Executive Office"
                    disabled={!isIdle}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E2D8] text-[#1F1A17] text-xs placeholder:text-[#9E948B] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:opacity-50"
                  />
                </div>

                {/* Space Category Visual Selector */}
                <SpaceTypeSelector
                  value={roomType}
                  onChange={(type) => setRoomType(type)}
                  disabled={!isIdle}
                />

                {/* Style Target Visual Selector */}
                <StylePresetSelector
                  value={stylePreference}
                  onChange={(style) => setStylePreference(style)}
                  disabled={!isIdle}
                />

                {/* Optional Room Scale Selector */}
                <RoomScaleSelector
                  length={dimensions.length}
                  width={dimensions.width}
                  unit={dimensions.unit}
                  onDimensionsChange={(l, w, u) => setDimensions({ length: l, width: w, unit: u })}
                  disabled={!isIdle}
                />

                {/* Primary Launch Action CTA */}
                <button
                  id="upload-submit-btn"
                  type="submit"
                  disabled={!uploadPreview || !isIdle}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#C86D51] to-[#768A75] hover:opacity-95 disabled:opacity-40 disabled:hover:opacity-40 text-white font-black rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer text-xs uppercase tracking-wider mt-2"
                >
                  <Compass className="h-4.5 w-4.5" />
                  <span>Initialize AI Spatial Audit</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
