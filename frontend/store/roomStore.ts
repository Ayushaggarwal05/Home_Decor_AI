import { create } from 'zustand';
import { Room, AnalysisResult, RedesignResult } from '../types';

// ===========================================================================
// ROOM STORE — Manages all room state, upload flow, and UI preferences
// Auth is now handled separately in authStore.ts
// ===========================================================================

interface RoomState {
  // Upload Flow State
  uploadFile: File | null;
  uploadPreview: string | null;
  roomType: 'living_room' | 'bedroom' | 'office' | 'kitchen' | 'dining';
  stylePreference: string;
  prompt: string;
  uploadProgress: number;
  uploadStatus: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  errorMessage: string | null;

  // Active / History State
  rooms: Room[];
  activeRoomId: string | null;

  // Comparison State
  compareRoomIds: string[];

  // UI Preferences
  uiPreferences: {
    theme: 'dark' | 'light';
    showGridOverlay: boolean;
    showHeatmap: boolean;
    showSymmetryAxes: boolean;
    showDetections: boolean;
    defaultUnit: 'ft' | 'm';
  };

  // Upload Actions
  setUploadFile: (file: File | null) => void;
  setRoomType: (type: 'living_room' | 'bedroom' | 'office' | 'kitchen' | 'dining') => void;
  setStylePreference: (style: string) => void;
  setPrompt: (prompt: string) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: 'idle' | 'uploading' | 'processing' | 'done' | 'error') => void;
  setErrorMessage: (msg: string | null) => void;
  resetUploadState: () => void;

  // Rooms & History Actions
  addRoom: (room: Room) => void;
  setRooms: (rooms: Room[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  updateRoomAnalysis: (roomId: string, analysis: AnalysisResult) => void;
  addRoomRedesign: (roomId: string, redesign: RedesignResult) => void;

  // Comparison Actions
  toggleCompareRoom: (roomId: string) => void;
  clearComparison: () => void;

  // UI Preference Actions
  toggleUIPreference: (
    key: 'showGridOverlay' | 'showHeatmap' | 'showSymmetryAxes' | 'showDetections'
  ) => void;
  toggleTheme: () => void;
  setUnit: (unit: 'ft' | 'm') => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  // ── Initial States ─────────────────────────────────────────────────────
  uploadFile: null,
  uploadPreview: null,
  roomType: 'living_room',
  stylePreference: 'Modern Minimalist',
  prompt: '',
  uploadProgress: 0,
  uploadStatus: 'idle',
  errorMessage: null,

  rooms: [],
  activeRoomId: null,
  compareRoomIds: [],

  uiPreferences: {
    theme: 'dark',
    showGridOverlay: true,
    showHeatmap: true,
    showSymmetryAxes: false,
    showDetections: true,
    defaultUnit: 'ft',
  },

  // ── Upload Actions ─────────────────────────────────────────────────────
  setUploadFile: (file) => {
    if (!file) {
      set({ uploadFile: null, uploadPreview: null });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    set({
      uploadFile: file,
      uploadPreview: previewUrl,
      uploadStatus: 'idle',
      uploadProgress: 0,
      errorMessage: null,
    });
  },

  setRoomType: (roomType) => set({ roomType }),
  setStylePreference: (stylePreference) => set({ stylePreference }),
  setPrompt: (prompt) => set({ prompt }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setUploadStatus: (uploadStatus) => set({ uploadStatus }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),

  resetUploadState: () =>
    set({
      uploadFile: null,
      uploadPreview: null,
      roomType: 'living_room',
      stylePreference: 'Modern Minimalist',
      prompt: '',
      uploadProgress: 0,
      uploadStatus: 'idle',
      errorMessage: null,
    }),

  // ── Rooms Actions ──────────────────────────────────────────────────────
  addRoom: (room) =>
    set((state) => {
      const exists = state.rooms.find((r) => r.id === room.id);
      const rooms = exists
        ? state.rooms.map((r) => (r.id === room.id ? room : r))
        : [room, ...state.rooms];
      return { rooms, activeRoomId: room.id };
    }),

  setRooms: (rooms) => set({ rooms }),

  setActiveRoom: (activeRoomId) => set({ activeRoomId }),

  updateRoomAnalysis: (roomId, analysis) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, analysis } : room
      ),
    })),

  addRoomRedesign: (roomId, redesign) =>
    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const existing = room.redesigns ?? [];
        const idx = existing.findIndex((r) => r.id === redesign.id);
        const redesigns =
          idx >= 0
            ? existing.map((r) => (r.id === redesign.id ? redesign : r))
            : [...existing, redesign];
        return { ...room, redesigns };
      }),
    })),

  // ── Comparison Actions ─────────────────────────────────────────────────
  toggleCompareRoom: (roomId) =>
    set((state) => {
      const isIncluded = state.compareRoomIds.includes(roomId);
      let compareRoomIds = [...state.compareRoomIds];
      if (isIncluded) {
        compareRoomIds = compareRoomIds.filter((id) => id !== roomId);
      } else {
        if (compareRoomIds.length >= 2) {
          compareRoomIds = [compareRoomIds[1], roomId];
        } else {
          compareRoomIds.push(roomId);
        }
      }
      return { compareRoomIds };
    }),

  clearComparison: () => set({ compareRoomIds: [] }),

  // ── UI Preference Actions ──────────────────────────────────────────────
  toggleUIPreference: (key) =>
    set((state) => ({
      uiPreferences: {
        ...state.uiPreferences,
        [key]: !state.uiPreferences[key],
      },
    })),

  toggleTheme: () =>
    set((state) => {
      const nextTheme =
        state.uiPreferences.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.toggle('dark', nextTheme === 'dark');
        root.classList.toggle('light', nextTheme === 'light');
      }
      return {
        uiPreferences: { ...state.uiPreferences, theme: nextTheme },
      };
    }),

  setUnit: (defaultUnit) =>
    set((state) => ({
      uiPreferences: { ...state.uiPreferences, defaultUnit },
    })),
}));
