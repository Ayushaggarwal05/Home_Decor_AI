'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Eye, Compass, MoveHorizontal, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock presets data
const ROOM_PRESETS = [
  {
    id: 'living',
    name: 'Modern Living Room',
    subtitle: 'Open-concept 450 sq.ft living area',
    originalImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    styles: {
      japandi: {
        name: 'Japandi Zen',
        description: 'Light oak wood, low-profile linen sofa, organic paper lamp accents',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        score: 94,
        scoreDelta: '+28%',
        clearance: '0.92m',
        flowIndex: '98/100',
      },
      scandi: {
        name: 'Scandinavian Light',
        description: 'Monochromatic white walls, wool textures, clean geometric lines',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        score: 91,
        scoreDelta: '+25%',
        clearance: '0.88m',
        flowIndex: '94/100',
      },
      industrial: {
        name: 'Industrial Loft',
        description: 'Exposed brick accents, matte black steel frames, cognac leather',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
        score: 89,
        scoreDelta: '+23%',
        clearance: '0.85m',
        flowIndex: '91/100',
      },
    },
    boundingBoxes: [
      { id: 'sofa', label: 'Sofa [98%]', color: 'border-violet-500 bg-violet-500/20 text-violet-900', coords: { top: '35%', left: '15%', width: '45%', height: '35%' } },
      { id: 'table', label: 'Coffee Table [95%]', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-900', coords: { top: '55%', left: '25%', width: '25%', height: '20%' } },
      { id: 'chair', label: 'Armchair [92%]', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-900', coords: { top: '40%', left: '68%', width: '22%', height: '28%' } },
      { id: 'door', label: 'Doorway [Exclusion 0.9m]', color: 'border-amber-500 bg-amber-500/20 text-amber-900', coords: { top: '10%', left: '5%', width: '15%', height: '40%' } },
    ],
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    subtitle: 'Restful 320 sq.ft suite with window focal wall',
    originalImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c5173?auto=format&fit=crop&w=1200&q=80',
    styles: {
      japandi: {
        name: 'Japandi Zen',
        description: 'Tatami mat accents, muted beige linen headboard, warm indirect strip LED',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
        score: 96,
        scoreDelta: '+34%',
        clearance: '1.05m',
        flowIndex: '99/100',
      },
      scandi: {
        name: 'Scandinavian Light',
        description: 'Pine bed frame, crisp white duvet, potted fiddle leaf fig plant',
        image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        score: 93,
        scoreDelta: '+31%',
        clearance: '0.98m',
        flowIndex: '96/100',
      },
      industrial: {
        name: 'Industrial Loft',
        description: 'Raw concrete headboard panel, pipe wardrobe rack, Edison bulb pendants',
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
        score: 88,
        scoreDelta: '+26%',
        clearance: '0.89m',
        flowIndex: '90/100',
      },
    },
    boundingBoxes: [
      { id: 'bed', label: 'King Bed [99%]', color: 'border-violet-500 bg-violet-500/20 text-violet-900', coords: { top: '30%', left: '25%', width: '50%', height: '50%' } },
      { id: 'nightstand_l', label: 'Nightstand L [94%]', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-900', coords: { top: '35%', left: '10%', width: '12%', height: '20%' } },
      { id: 'nightstand_r', label: 'Nightstand R [93%]', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-900', coords: { top: '35%', left: '78%', width: '12%', height: '20%' } },
    ],
  },
];

type StyleKey = 'japandi' | 'scandi' | 'industrial';

export default function InteractiveDemo() {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>('japandi');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showSpatialVision, setShowSpatialVision] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const activeRoom = ROOM_PRESETS[selectedRoomIndex];
  const activeStyleData = activeRoom.styles[selectedStyle];

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 w-full z-10 space-y-8">
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-700">
          <Compass className="h-3.5 w-3.5" />
          <span>Live Interactive Spatial Sandbox</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Experience Spatial Intelligence In Action
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Drag the slider to compare original scans with restyled concepts, toggle computer vision detection overlays, and switch interior design presets in real time.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 shadow-lg shadow-slate-200/50">
        {/* Room Presets Tabs */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {ROOM_PRESETS.map((room, idx) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomIndex(idx)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedRoomIndex === idx
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Style Selector Chips */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {(Object.keys(activeRoom.styles) as StyleKey[]).map((styleKey) => {
            const style = activeRoom.styles[styleKey];
            const isSelected = selectedStyle === styleKey;
            return (
              <button
                key={styleKey}
                onClick={() => setSelectedStyle(styleKey)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>{style.name}</span>
              </button>
            );
          })}
        </div>

        {/* Spatial Vision Toggle */}
        <button
          onClick={() => setShowSpatialVision(!showSpatialVision)}
          className={`w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
            showSpatialVision
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Spatial Vision {showSpatialVision ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Interactive Slider Canvas */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[500px] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl select-none group cursor-ew-resize"
      >
        {/* Underlay Image: AI Restyled Image */}
        <div className="absolute inset-0 w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeStyleData.image}
            alt={activeStyleData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>AI Restyled: {activeStyleData.name}</span>
          </div>
        </div>

        {/* Overlay Image: Original Room Scan */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeRoom.originalImage}
            alt="Original Scan"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: sliderRef.current?.getBoundingClientRect().width || '100%' }}
          />

          {/* Spatial AI Bounding Boxes */}
          <AnimatePresence>
            {showSpatialVision && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

                {activeRoom.boundingBoxes.map((box) => (
                  <div
                    key={box.id}
                    className={`absolute border-2 rounded-xl flex items-start justify-start p-1.5 shadow-lg transition-all ${box.color}`}
                    style={box.coords}
                  >
                    <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-900 shadow border border-slate-200">
                      {box.label}
                    </span>
                  </div>
                ))}

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 100,200 Q 300,300 500,220 T 900,350"
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="animate-pulse opacity-80"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>Original Scan Blueprint</span>
          </div>
        </div>

        {/* Divider Bar & Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-violet-500 to-indigo-600 shadow-[0_0_12px_rgba(139,92,246,0.6)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-violet-600 text-violet-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <MoveHorizontal className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bottom Live Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Optimization Gain</div>
          <div className="text-xl font-extrabold text-emerald-600">{activeStyleData.scoreDelta}</div>
          <div className="text-[10px] text-slate-400">NSGA-II Fitness Score</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Walkway Clearance</div>
          <div className="text-xl font-extrabold text-cyan-600">{activeStyleData.clearance}</div>
          <div className="text-[10px] text-slate-400">Min safety buffer compliant</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">A* Flow Index</div>
          <div className="text-xl font-extrabold text-violet-600">{activeStyleData.flowIndex}</div>
          <div className="text-[10px] text-slate-400">Walkability Graph Score</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Overall Harmony</div>
          <div className="text-xl font-extrabold text-slate-900">{activeStyleData.score}/100</div>
          <div className="text-[10px] text-slate-400">Explainable composite</div>
        </div>
      </div>
    </section>
  );
}
