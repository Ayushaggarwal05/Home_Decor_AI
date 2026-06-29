'use client';

import React from 'react';
import { GraphData } from '../../types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RelationshipGraphProps {
  graphData?: GraphData;
}

export default function RelationshipGraph({ graphData }: RelationshipGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);

  if (!graphData || !graphData.nodes.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[220px]">
        <p>No relational connections calculated.</p>
        <p className="text-[10px] mt-1">Check that furniture has been successfully detected.</p>
      </div>
    );
  }

  // Filter out Wall nodes if they make the visual network too busy, or keep them to show anchoring.
  // We'll show walls in a clean, smaller visual style.
  const nodes = graphData.nodes;
  const edges = graphData.edges.filter(e => e.relationship !== 'pathway_connected');

  // Check if a node is highlighted
  const isNodeActive = (nodeId: string) => {
    if (!hoveredNodeId) return true;
    if (hoveredNodeId === nodeId) return true;
    // Check if there is an edge connecting the hovered node to this node
    return edges.some(
      (e) =>
        (e.source === hoveredNodeId && e.target === nodeId) ||
        (e.target === hoveredNodeId && e.source === nodeId)
    );
  };

  // Check if an edge is highlighted
  const isEdgeActive = (source: string, target: string) => {
    if (!hoveredNodeId) return true;
    return source === hoveredNodeId || target === hoveredNodeId;
  };

  const getCategoryStyles = (category: string, id: string) => {
    if (id.startsWith('Wall_')) {
      return {
        bg: 'bg-slate-900 border-slate-700',
        text: 'text-slate-400',
        glow: 'shadow-slate-500/5',
        circleColor: '#1e293b',
        textColor: '#94a3b8',
      };
    }

    const cat = category.toLowerCase();
    switch (cat) {
      case 'seating':
        return {
          bg: 'bg-cyan-500/10 border-cyan-400/40',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-500/10',
          circleColor: '#06b6d4',
          textColor: '#22d3ee',
        };
      case 'storage':
        return {
          bg: 'bg-emerald-500/10 border-emerald-400/40',
          text: 'text-emerald-400',
          glow: 'shadow-emerald-500/10',
          circleColor: '#10b981',
          textColor: '#34d399',
        };
      case 'focal':
        return {
          bg: 'bg-violet-500/10 border-violet-400/40',
          text: 'text-violet-400',
          glow: 'shadow-violet-500/10',
          circleColor: '#8b5cf6',
          textColor: '#a78bfa',
        };
      case 'work':
        return {
          bg: 'bg-blue-500/10 border-blue-400/40',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/10',
          circleColor: '#3b82f6',
          textColor: '#60a5fa',
        };
      case 'structural':
        return {
          bg: 'bg-amber-500/10 border-amber-400/40',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/10',
          circleColor: '#f59e0b',
          textColor: '#fbbf24',
        };
      default:
        return {
          bg: 'bg-pink-500/10 border-pink-400/40',
          text: 'text-pink-400',
          glow: 'shadow-pink-500/10',
          circleColor: '#ec4899',
          textColor: '#f472b6',
        };
    }
  };

  return (
    <div className="glass-panel border rounded-3xl p-5 space-y-4 bg-slate-950/20 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
      <div>
        <h4 className="text-sm font-bold text-foreground">Semantic Spatial Mindmap</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Map of semantic layout forces and node connections
        </p>
      </div>

      {/* Network visualization canvas (relative dimensions) */}
      <div className="relative border border-white/5 bg-slate-950/60 rounded-2xl h-60 w-full overflow-hidden flex items-center justify-center">
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Relationship Connection Paths */}
          {edges.map((edge, idx) => {
            const start = nodes.find(n => n.id === edge.source);
            const end = nodes.find(n => n.id === edge.target);
            if (!start || !end) return null;

            const cx1 = start.center_x ?? (start.boundingBox ? start.boundingBox.x + start.boundingBox.width / 2 : 50);
            const cy1 = start.center_y ?? (start.boundingBox ? start.boundingBox.y + start.boundingBox.height / 2 : 50);
            const cx2 = end.center_x ?? (end.boundingBox ? end.boundingBox.x + end.boundingBox.width / 2 : 50);
            const cy2 = end.center_y ?? (end.boundingBox ? end.boundingBox.y + end.boundingBox.height / 2 : 50);

            const active = isEdgeActive(edge.source, edge.target);

            let pathStroke = 'rgba(255, 255, 255, 0.08)';
            if (active) {
              if (edge.relationship === 'faces') pathStroke = 'rgba(139, 92, 246, 0.55)'; // violet
              if (edge.relationship === 'grouped_with') pathStroke = 'rgba(16, 185, 129, 0.55)'; // emerald
              if (edge.relationship === 'attached_to_wall') pathStroke = 'rgba(245, 158, 11, 0.4)'; // amber
            }

            return (
              <g key={`${edge.source}-${edge.target}-${idx}`}>
                <motion.line
                  x1={`${cx1}%`}
                  y1={`${cy1}%`}
                  x2={`${cx2}%`}
                  y2={`${cy2}%`}
                  stroke={pathStroke}
                  strokeWidth={active ? 1.5 : 0.8}
                  className="transition-all duration-300"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Edge Label Pill */}
                {active && hoveredNodeId && (
                  <foreignObject
                    x={`${(cx1 + cx2) / 2}%`}
                    y={`${(cy1 + cy2) / 2}%`}
                    width="60"
                    height="12"
                    className="overflow-visible select-none pointer-events-none"
                    style={{ transform: 'translate(-30px, -6px)' }}
                  >
                    <div className="flex justify-center items-center h-full">
                      <span className="px-1 py-0.5 rounded bg-slate-950/90 border border-white/5 text-[5px] uppercase font-bold text-slate-300 font-mono tracking-wider">
                        {edge.relationship.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Furniture & Wall Nodes */}
          {nodes.map((node) => {
            const cx = node.center_x ?? (node.boundingBox ? node.boundingBox.x + node.boundingBox.width / 2 : 50);
            const cy = node.center_y ?? (node.boundingBox ? node.boundingBox.y + node.boundingBox.height / 2 : 50);
            const active = isNodeActive(node.id);
            const isWall = node.id.startsWith('Wall_');
            const style = getCategoryStyles(node.category, node.id);

            return (
              <g key={node.id}>
                {/* Node outer glow */}
                <circle
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r={isWall ? 2 : 4}
                  fill="transparent"
                  stroke={active ? style.circleColor : 'rgba(255,255,255,0.05)'}
                  strokeWidth="0.5"
                  className="transition-colors duration-300"
                  style={{
                    filter: active ? `drop-shadow(0 0 3px ${style.circleColor})` : 'none',
                  }}
                />

                {/* Node Interactive Handle */}
                <circle
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r={isWall ? 2.5 : 4.5}
                  fill={active ? style.circleColor : 'rgba(255,255,255,0.08)'}
                  opacity={active ? 0.95 : 0.4}
                  className="transition-all duration-300 cursor-pointer pointer-events-auto"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-2 text-[8px] bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/5 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <span className="text-slate-400">Focal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="text-slate-400">Seating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-slate-400">Structural</span>
          </div>
        </div>
      </div>

      {/* Connection Info text panel */}
      <AnimatePresence mode="wait">
        {hoveredNodeId ? (
          <motion.div
            key={hoveredNodeId}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px]"
          >
            {(() => {
              const node = nodes.find(n => n.id === hoveredNodeId);
              if (!node) return null;
              const relatedEdges = edges.filter(
                e => e.source === hoveredNodeId || e.target === hoveredNodeId
              );

              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="font-bold text-foreground truncate">{node.label}</span>
                    <span className="text-[8px] px-1.5 py-0.2 bg-white/5 rounded text-muted-foreground uppercase font-mono capitalize">
                      {node.category}
                    </span>
                  </div>
                  
                  {relatedEdges.length === 0 ? (
                    <p className="text-slate-400 text-[9px] italic">No functional relationships resolved.</p>
                  ) : (
                    <div className="max-h-12 overflow-y-auto scrollbar-none space-y-1">
                      {relatedEdges.map((e, idx) => {
                        const otherId = e.source === hoveredNodeId ? e.target : e.source;
                        const otherNode = nodes.find(n => n.id === otherId);
                        if (!otherNode) return null;

                        return (
                          <div key={idx} className="flex justify-between items-center text-[9px]">
                            <span className="text-slate-400 capitalize">{e.relationship.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-slate-300">{otherNode.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        ) : (
          <div className="p-3 bg-white/[0.01] border border-white/[0.02] rounded-2xl text-[10px] text-center text-slate-500 italic">
            Hover over nodes in the graph to display spatial coordinates and connection properties
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
