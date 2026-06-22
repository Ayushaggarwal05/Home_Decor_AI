'use client';

import React from 'react';
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
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const STYLE_PRESETS = [
  'Modern Minimalist',
  'Japandi Harmony',
  'Industrial Loft',
  'Scandinavian Crisp',
  'Mid-Century Chic',
  'Neo-Classical Luxury',
];

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image upload */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel border rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  1. Mount Spatial Photo
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drag and drop a raw landscape photograph of your room
                  environment
                </p>
              </div>

              {uploadPreview ? <ImagePreview /> : <UploadDropzone />}
            </div>

            {isPending && <UploadProgress />}
          </div>

          {/* Right Column: Metadata setup */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="glass-panel border rounded-3xl p-6 space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-foreground">
                  2. Set Core Dimensions
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure categories to index model heuristics
                </p>
              </div>

              {/* Room Name */}
              <div className="space-y-2">
                <label
                  htmlFor="room-name"
                  className="text-xs font-bold text-muted-foreground uppercase"
                >
                  Room Name or Label
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Master Bedroom, Primary Living Hall"
                  disabled={!isIdle}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Room Type */}
                <div className="space-y-2">
                  <label
                    htmlFor="room-type"
                    className="text-xs font-bold text-muted-foreground uppercase"
                  >
                    Space Type
                  </label>
                  <select
                    id="room-type"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as typeof roomType)}
                    disabled={!isIdle}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                  >
                    <option value="living_room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="office">Home Office</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="dining">Dining Room</option>
                  </select>
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <label
                    htmlFor="style-preference"
                    className="text-xs font-bold text-muted-foreground uppercase"
                  >
                    Style Target Preset
                  </label>
                  <select
                    id="style-preference"
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    disabled={!isIdle}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                  >
                    {STYLE_PRESETS.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <PromptInput />

              <button
                id="upload-submit-btn"
                type="submit"
                disabled={!uploadPreview || !isIdle}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Initialize Spatial Audit</span>
              </button>
            </form>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
