"use client";

import React from "react";
import { useRoomStore } from "@/store/roomStore";
import { useAuthStore } from "@/store/authStore";
import { roomService } from "@/services/room.service";
import DashboardShell from "@/components/layout/DashboardShell";
import PageContainer from "@/components/layout/PageContainer";
import RoomCard from "@/components/room/RoomCard";
import Link from "next/link";
import {
  Plus,
  Grid,
  Sparkles,
  Compass,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

// Curated inspiration moodboards
const INSPIRATION_MOODS = [
  {
    title: "Japandi Harmony",
    description:
      "Minimalism meets organic warmth. A fusion of Japanese wabi-sabi aesthetics and clean Scandinavian lines.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    tags: ["Oakwood", "Bonsai", "Linen", "Wabi-Sabi"],
  },
  {
    title: "Industrial Loft",
    description:
      "Architectural steel framing, exposed brick masonry, and soaring ceilings paired with cognac leather.",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    tags: ["Steel", "Concrete", "Exposed Brick", "Leather"],
  },
  {
    title: "Scandinavian Crisp",
    description:
      "Abundant natural daylight, functional circulation corridors, neutral wool textures, and geometric accents.",
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    tags: ["Pine", "White Wool", "Minimal", "Geometric"],
  },
  {
    title: "Parisian Chic",
    description:
      "Ornate crown moldings, chevron parquet flooring, gilded vintage mirrors, and classical European elegance.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    tags: ["Marble", "Gilded Gold", "Velvet", "Herringbone"],
  },
];

export default function StudioPage() {
  const { rooms, setRooms } = useRoomStore();
  const { user } = useAuthStore();
  const [visibleCount, setVisibleCount] = React.useState(8);

  // Fetch rooms from backend
  const { data: fetchedRooms, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const list = await roomService.getRooms();
      setRooms(list);
      return list;
    },
    staleTime: 30 * 1000,
  });

  const activeRooms = fetchedRooms ?? rooms;

  return (
    <DashboardShell>
      <PageContainer className="space-y-12">
        {/* 1️⃣ HERO IMMERSIVE CANVAS */}
        <section className="relative w-full pt-2 pb-6 pl-4 sm:pl-6 lg:pl-8 pr-0 sm:pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
            <div className="lg:col-span-3 space-y-6">
              {user && (
                <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#F4F0EA] border border-[#E8E2D8] text-xs font-bold text-[#6E655F] uppercase tracking-widest shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>
                    Spatial Intelligence Engine v2.4 •{" "}
                    {user.fullName || user.email}
                  </span>
                </div>
              )}

              {/* Optically Sized Stacked Headline */}
              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-6xl sm:text-7xl lg:text-[9.5rem] font-black tracking-tight text-slate-900 leading-[0.92]">
                  Space
                </h1>
                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight text-slate-900 leading-[0.92]">
                  Reimagination
                </h1>
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#C86D51] tracking-tight pt-3">
                  With Intelligent Interior Design
                </div>
              </div>

              {/* Expanded Prominent Subtitle */}
              <p className="text-sm sm:text-base text-[#6E655F] max-w-2xl leading-relaxed font-normal pt-2">
                Turn room photos into beautifully balanced floorplans with open
                walkways, natural lighting, and refined aesthetics. Construct 2D
                occupancy grids and discover collision-free furniture layouts
                with intelligent spatial planning.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/upload"
                  className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C86D51] hover:opacity-95 text-white text-xs font-black rounded-2xl flex items-center space-x-2 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Scan New Space</span>
                </Link>
                <Link
                  href="/research"
                  className="px-6 py-3.5 border border-[#E8E2D8] bg-[#F4F0EA] hover:bg-[#EAE4DC] text-[#1F1A17] text-xs font-bold rounded-2xl flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Compass className="h-4.5 w-4.5 text-[#B8860B]" />
                  <span>Spatial Planning Lab</span>
                </Link>
              </div>
            </div>

            {/* Cinematic Floating Redesign Mockups */}
            <div className="lg:col-span-2 hidden lg:flex justify-center items-center relative h-64">
              <motion.div
                initial={{ rotate: -6, y: 10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="absolute w-48 h-52 rounded-2xl bg-white border border-[#E8E2D8] overflow-hidden shadow-xl origin-bottom-left z-10"
              >
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80"
                  alt="Original layout"
                  className="w-full h-2/3 object-cover brightness-90"
                />
                <div className="p-3 text-[10px] bg-[#FAF8F5]">
                  <p className="font-bold text-[#1F1A17]">Raw Room Scan</p>
                  <p className="text-[#6E655F] mt-0.5">Symmetry score: 58%</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ rotate: 8, x: 50, y: -10 }}
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute w-48 h-52 rounded-2xl bg-white border border-[#D4AF37]/50 overflow-hidden shadow-xl shadow-[#D4AF37]/15 origin-bottom-right z-20"
              >
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80"
                  alt="Optimized layout"
                  className="w-full h-2/3 object-cover"
                />
                <div className="p-3 text-[10px] bg-[#FAF8F5] border-t border-[#E8E2D8]">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-[#B8860B]">
                      NSGA-II Japandi Layout
                    </p>
                    <Sparkles className="h-3 w-3 text-[#D4AF37] animate-pulse" />
                  </div>
                  <p className="text-[#6E655F] mt-0.5">
                    Accessibility score: 94%
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2️⃣ ACTIVE DESIGN WORKSPACES (CLEAN FULL WIDTH) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-[#1F1A17] flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-[#B8860B]" />
                <span>Active Spaces</span>
                {activeRooms.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4F0EA] text-[#B8860B] border border-[#E8E2D8]">
                    {activeRooms.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#6E655F] mt-1">
                Your computational room models, layout optimization blueprints,
                and spatial snapshots
              </p>
            </div>

            {activeRooms.length > 0 && (
              <Link
                href="/upload"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#B8860B] bg-[#FDFBF7] border border-[#E8E2D8] hover:border-[#D4AF37] hover:bg-[#FAF8F5] transition-all shadow-sm shrink-0 self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Space Scan</span>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
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
            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-12 sm:p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="p-4 bg-[#F4F0EA] rounded-2xl text-[#B8860B] shadow-inner">
                <Grid className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#1F1A17]">
                  No Spaces Mapped Yet
                </h4>
                <p className="text-xs text-[#6E655F] max-w-md">
                  Upload an interior room photo to automatically extract
                  boundary contours, detect furniture objects, and generate
                  optimization blueprints.
                </p>
              </div>
              <Link
                href="/upload"
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C86D51] text-white text-xs font-black rounded-xl hover:opacity-95 transition-all flex items-center space-x-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer mt-2"
              >
                <Plus className="h-4 w-4" />
                <span>Initialize First Space</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeRooms.slice(0, visibleCount).map((room, index) => (
                  <div key={room.id} className="group relative">
                    <RoomCard room={room} delay={0.08 + index * 0.04} />
                  </div>
                ))}
              </div>
              {activeRooms.length > visibleCount && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="px-6 py-2.5 bg-white border border-[#E8E2D8] hover:border-[#D4AF37] text-[#1F1A17] text-xs font-bold rounded-2xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer hover:bg-[#FDFBF7]"
                  >
                    <span>Show More Spaces</span>
                    <span className="text-[10px] text-[#B8860B]">
                      ({activeRooms.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3️⃣ INSPIRATION EXPLORER */}
        <section className="space-y-6 pt-2">
          <div>
            <h3 className="text-xl font-extrabold text-[#1F1A17] flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              <span>Design Styles & Inspirations</span>
            </h3>
            <p className="text-xs text-[#6E655F] mt-1">
              Explore curated aesthetic presets and material palettes for
              automated generative restyling
            </p>
          </div>

          {/* Horizontal scrollable gallery */}
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
                      <h4 className="font-bold text-[#1F1A17] text-sm group-hover:text-[#B8860B] transition-colors">
                        {mood.title}
                      </h4>
                      <ArrowUpRight className="h-4 w-4 text-[#6E655F] group-hover:text-[#1F1A17] transition-colors" />
                    </div>
                    <p className="text-[11px] text-[#6E655F] leading-normal">
                      {mood.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mood.tags.map((tag) => (
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
