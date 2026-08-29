'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { useAuthStore } from '@/store/authStore';
import { roomService } from '@/services/room.service';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import RoomCard from '@/components/room/RoomCard';
import Link from 'next/link';
import { 
  Plus, 
  ArrowRight, 
  Grid, 
  Sparkles, 
  Compass, 
  Cpu, 
  Activity, 
  Layers,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import FadeIn from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock logs for the Live AI Activity Stream
const AI_LOG_ITEMS = [
  "Initializing neural spatial mapping layers...",
  "Running YOLOv8 furniture detection pipeline...",
  "Constructing 2D occupancy grid footprint...",
  "Applying Genetic Algorithm layout solver...",
  "Calculating accessibility walk-path clearance...",
  "Evaluating symmetry scores and layout alignment...",
  "Mapping Stable Diffusion redesign boundaries...",
  "Retrieving concept inspirations from latent space...",
  "Injecting light vector projections and orientations...",
];

// Curated inspiration moodboards
const INSPIRATION_MOODS = [
  {
    title: 'Japandi Harmony',
    description: 'Minimalism meets warm nature. Fusion of Japanese styling and clean Scandinavian warmth.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    tags: ['Oakwood', 'Bonsai', 'Linen', 'Wabi-Sabi']
  },
  {
    title: 'Industrial Loft',
    description: 'Raw metal structures, exposed brick surfaces, and high ceilings paired with leather.',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    tags: ['Steel', 'Concrete', 'Exposed Brick', 'Leather']
  },
  {
    title: 'Scandinavian Crisp',
    description: 'Vibrant natural light, functional layouts, neutral light tones, and geometric accents.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    tags: ['Pine', 'White Wool', 'Minimal', 'Geometric']
  },
  {
    title: 'Parisian Chic',
    description: 'Ornate crown moldings, chevron parquet flooring, vintage mirrors, and classical elegance.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    tags: ['Marble', 'Gilded Gold', 'Velvet', 'Herringbone']
  }
];

export default function StudioPage() {
  const { rooms, setRooms } = useRoomStore();
  const { user } = useAuthStore();
  const [activeLog, setActiveLog] = React.useState(0);
  const [logsList, setLogsList] = React.useState<string[]>([
    "Matter OS v1.0.0 Online",
    "Ready for spatial scanning instructions"
  ]);
  const [visibleCount, setVisibleCount] = React.useState(6);

  // Fetch rooms from backend
  const { data: fetchedRooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const list = await roomService.getRooms();
      setRooms(list);
      return list;
    },
    staleTime: 30 * 1000,
  });

  const activeRooms = fetchedRooms ?? rooms;

  // Cycle through live AI activity logs
  React.useEffect(() => {
    const timer = setInterval(() => {
      const randomLog = AI_LOG_ITEMS[Math.floor(Math.random() * AI_LOG_ITEMS.length)];
      setLogsList(prev => [randomLog, ...prev.slice(0, 4)]);
      setActiveLog(prev => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardShell>
      <PageContainer className="space-y-12">
        
        {/* 1️⃣ HERO IMMERSIVE CANVAS */}
        <section className="relative w-full rounded-3xl overflow-hidden border border-[#E8E2D8] bg-white p-8 sm:p-12 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] via-white to-[#F9F5EE] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
            <div className="lg:col-span-3 space-y-6">
              {user && (
                <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#F4F0EA] border border-[#E8E2D8] text-xs font-bold text-[#6E655F] uppercase tracking-widest shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>Authorized Studio User: {user.fullName || user.email}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#1F1A17]">
                Designing spaces with{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#C86D51] to-[#768A75]">
                  spatial intelligence.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-[#6E655F] max-w-xl leading-relaxed">
                Welcome to Matter Studio. Initialize a neural audit of your environment, optimize furniture layouts with genetic search parameters, or render AI-powered interior redesign styles in real time.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/upload"
                  className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#C86D51] to-[#768A75] hover:opacity-95 text-white text-xs font-black rounded-2xl flex items-center space-x-2 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Create Space</span>
                </Link>
                <Link
                  href="/research"
                  className="px-6 py-3.5 border border-[#E8E2D8] bg-[#F4F0EA] hover:bg-[#EAE4DC] text-[#1F1A17] text-xs font-bold rounded-2xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Compass className="h-4.5 w-4.5 text-[#B8860B]" />
                  <span>Explore Spatial Lab</span>
                </Link>
              </div>
            </div>

            {/* Cinematic Floating Redesign Mockups */}
            <div className="lg:col-span-2 hidden lg:flex justify-center items-center relative h-64">
              <motion.div
                initial={{ rotate: -6, y: 10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute w-48 h-52 rounded-2xl bg-white border border-[#E8E2D8] overflow-hidden shadow-xl origin-bottom-left z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80" 
                  alt="Original layout" 
                  className="w-full h-2/3 object-cover brightness-90"
                />
                <div className="p-3 text-[10px] bg-[#FAF8F5]">
                  <p className="font-bold text-[#1F1A17]">Original Space Scan</p>
                  <p className="text-[#6E655F] mt-0.5">Symmetry score: 58%</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ rotate: 8, x: 50, y: -10 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute w-48 h-52 rounded-2xl bg-white border border-[#D4AF37]/50 overflow-hidden shadow-xl shadow-[#D4AF37]/15 origin-bottom-right z-20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80" 
                  alt="Optimized layout" 
                  className="w-full h-2/3 object-cover"
                />
                <div className="p-3 text-[10px] bg-[#FAF8F5] border-t border-[#E8E2D8]">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-[#B8860B]">Japandi Redesign</p>
                    <Sparkles className="h-3 w-3 text-[#D4AF37] animate-pulse" />
                  </div>
                  <p className="text-[#6E655F] mt-0.5">Accessibility: 84%</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Outer container splitting Active Spaces & AI Activity stream */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* 2️⃣ ACTIVE DESIGN WORKSPACES */}
          <section className="xl:col-span-3 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-extrabold text-[#1F1A17] flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#B8860B]" />
                  <span>Active Spaces</span>
                </h3>
                <p className="text-xs text-[#6E655F] mt-0.5">
                  Your computational environments and optimization snapshots
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-[#E8E2D8] rounded-3xl aspect-[1.1] animate-pulse p-4 space-y-4 shadow-sm"
                  >
                    <div className="w-full h-1/2 bg-[#F4F0EA] rounded-2xl" />
                    <div className="h-4 bg-[#F4F0EA] rounded w-2/3" />
                    <div className="h-3 bg-[#F4F0EA] rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : activeRooms.length === 0 ? (
              <div className="bg-white border border-[#E8E2D8] rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
                <div className="p-4 bg-[#F4F0EA] rounded-full text-[#B8860B]">
                  <Grid className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1F1A17]">
                    No Spaces Mapped Yet
                  </h4>
                  <p className="text-xs text-[#6E655F] mt-1 max-w-sm">
                    Upload an environment picture to trigger coordinate mapping and spatial diagnostics.
                  </p>
                </div>
                <Link
                  href="/upload"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C86D51] to-[#768A75] text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all flex items-center space-x-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Initialize Space</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeRooms.slice(0, visibleCount).map((room, index) => (
                    <div key={room.id} className="group relative">
                      <RoomCard room={room} delay={0.1 + index * 0.05} />
                    </div>
                  ))}
                </div>
                {activeRooms.length > visibleCount && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 3)}
                      className="px-6 py-2.5 bg-white border border-[#E8E2D8] hover:border-[#D4AF37] text-[#1F1A17] text-xs font-bold rounded-2xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer hover:bg-[#FDFBF7]"
                    >
                      <span>Show More Spaces</span>
                      <span className="text-[10px] text-[#B8860B]">({activeRooms.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 3️⃣ LIVE AI ACTIVITY STREAM */}
          <section className="xl:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#1F1A17] flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#B8860B]" />
                <span>AI Activity Stream</span>
              </h3>
              <p className="text-xs text-[#6E655F] mt-0.5">
                Real-time spatial diagnostics ticker
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 shadow-sm min-h-[320px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 pointer-events-none">
                <Activity className="h-4 w-4 text-[#B8860B] animate-pulse" />
              </div>

              {/* Dynamic live logs list */}
              <div className="space-y-3.5 pt-2">
                {logsList.map((log, index) => (
                  <motion.div
                    key={`${index}-${log}`}
                    initial={{ opacity: 0, x: -10, y: -5 }}
                    animate={{ opacity: 1 - index * 0.2, x: 0, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start space-x-2.5 text-[11px]"
                  >
                    <span className={`h-2 w-2 rounded-full mt-1 shrink-0 ${index === 0 ? 'bg-[#D4AF37] animate-ping' : 'bg-[#E8E2D8]'}`} />
                    <span className={cn(
                      "font-mono leading-relaxed",
                      index === 0 ? "text-[#1F1A17] font-bold" : "text-[#6E655F]"
                    )}>
                      {log}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* System diagnostics info widget */}
              <div className="border-t border-[#E8E2D8] pt-4 mt-8 flex justify-between items-center text-[10px]">
                <div className="flex items-center space-x-1.5 text-[#6E655F] font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Engine: Operational</span>
                </div>
                <span className="text-[#B8860B] font-mono">Tasks: {activeLog}</span>
              </div>
            </div>
          </section>
        </div>

        {/* 4️⃣ INSPIRATION EXPLORER */}
        <section className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1F1A17] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              <span>Inspiration Moods</span>
            </h3>
            <p className="text-xs text-[#6E655F] mt-0.5">
              Explore custom spatial styles and conceptual moodboards
            </p>
          </div>

          {/* Horizontal scrollable slider */}
          <div className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
            {INSPIRATION_MOODS.map((mood, idx) => (
              <motion.div
                key={mood.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="min-w-[280px] sm:min-w-[340px] max-w-[340px] rounded-3xl overflow-hidden bg-white border border-[#E8E2D8] hover:border-[#D4AF37] shadow-sm snap-start flex flex-col justify-between group cursor-pointer transition-all duration-300"
              >
                <div className="relative aspect-[1.5] overflow-hidden">
                  <img
                    src={mood.image}
                    alt={mood.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>
                
                <div className="p-5 space-y-3.5 bg-white flex-1 flex flex-col justify-between border-t border-[#E8E2D8]">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#1F1A17] text-sm group-hover:text-[#B8860B] transition-colors">{mood.title}</h4>
                      <ArrowUpRight className="h-4 w-4 text-[#6E655F] group-hover:text-[#1F1A17] transition-colors" />
                    </div>
                    <p className="text-[11px] text-[#6E655F] leading-normal">
                      {mood.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mood.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2.5 py-0.5 text-[8px] font-semibold bg-[#F4F0EA] border border-[#E8E2D8] text-[#1F1A17] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </PageContainer>
    </DashboardShell>
  );
}
