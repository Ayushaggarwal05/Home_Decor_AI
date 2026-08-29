"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  FileCode,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { useToastStore } from "@/store/toastStore";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoom: any;
}

export function ExportReportModal({
  isOpen,
  onClose,
  activeRoom,
}: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToastStore();

  if (!isOpen || !activeRoom) return null;

  const { analysis, name, spaceType, dimensions } = activeRoom;

  // 1. Enriched JSON Export Handler
  const handleDownloadJSON = () => {
    try {
      const exportData = {
        meta: {
          platform: "Matter AI Spatial Intelligence Engine",
          version: "2.0",
          exportedAt: new Date().toISOString(),
          roomId: activeRoom.id,
          roomName: name,
          spaceType: spaceType,
          dimensions: {
            length: dimensions?.length || 16.0,
            width: dimensions?.width || 12.0,
            height: dimensions?.height || 9.0,
            unit: dimensions?.unit || "ft",
          },
          overallHealthScore: analysis?.overallScore || 85,
        },
        scoresBreakdown: {
          overallScore: {
            score: analysis?.overallScore || 85,
            benchmark: "Optimal",
          },
          flowCirculation: {
            score: analysis?.flowScore || 80,
            weight: 0.25,
            benchmark: "Good",
          },
          visualSymmetry: {
            score: analysis?.symmetryScore || 88,
            weight: 0.2,
            benchmark: "Excellent",
          },
          clutterDensity: {
            score: analysis?.clutterScore || 75,
            weight: 0.2,
            benchmark: "Moderate",
          },
          ergonomicAccessibility: {
            score: analysis?.accessibilityScore || 90,
            weight: 0.2,
            benchmark: "High",
          },
          lightingBalance: {
            score: analysis?.lightingScore || 85,
            weight: 0.15,
            benchmark: "Balanced",
          },
        },
        detectedFurnitureInventory: (analysis?.detections || []).map(
          (det: any, index: number) => ({
            index: index + 1,
            id: det.id || `item-${index + 1}`,
            label: det.label,
            category: det.category || "Furniture",
            confidenceScore: det.confidence,
            confidencePercentage: `${Math.round(det.confidence * 100)}%`,
            boundingBoxPercentage: det.boundingBox,
            estimatedPhysicalDimensions: {
              width: det.dimWidth || 3.0,
              depth: det.dimDepth || 2.0,
              height: det.dimHeight || 2.5,
              unit: dimensions?.unit || "ft",
            },
          }),
        ),
        relationalClearanceGraph: {
          nodes: analysis?.graphData?.nodes || [],
          edges: analysis?.graphData?.edges || [],
        },
        ergonomicReasoning: analysis?.reasoning || [],
        occupancyGridMatrix: {
          rows: analysis?.occupancyMap?.rows || 10,
          cols: analysis?.occupancyMap?.cols || 10,
          cells: analysis?.occupancyMap?.grid || [],
        },
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `${name.toLowerCase().replace(/\s+/g, "_")}_spatial_analysis.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("JSON spatial dataset exported successfully!");
    } catch (err) {
      toast.error("Failed to export JSON file.");
    }
  };

  // 2. Copy Executive Summary Handler
  const handleCopySummary = () => {
    try {
      const summaryText = `
🏠 SPATIAL AI AUDIT REPORT: ${name}
=================================================
Space Type: ${spaceType?.replace("_", " ").toUpperCase()}
Dimensions: ${dimensions?.length || 16}x${dimensions?.width || 12} ${dimensions?.unit || "ft"}

📊 SPATIAL HEALTH SCORES
• Overall Score: ${analysis?.overallScore || 85}/100
• Flow & Circulation: ${analysis?.flowScore || 80}/100
• Visual Symmetry: ${analysis?.symmetryScore || 88}/100
• Clutter Density: ${analysis?.clutterScore || 75}/100
• Ergonomic Access: ${analysis?.accessibilityScore || 90}/100
• Lighting Balance: ${analysis?.lightingScore || 85}/100

🛋️ DETECTED ELEMENTS (${analysis?.detections?.length || 0} items)
${(analysis?.detections || []).map((item: any) => `- ${item.label} (${Math.round(item.confidence * 100)}% conf)`).join("\n")}

💡 AI RECOMMENDATIONS
${(analysis?.reasoning || [])
  .slice(0, 3)
  .map((r: any) => `• [${r.type?.toUpperCase()}] ${r.title}: ${r.description}`)
  .join("\n")}

Generated by Matter AI Spatial Intelligence Platform
`.trim();

      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      toast.success("Executive summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error("Failed to copy summary.");
    }
  };

  // 3. Print / PDF Export Handler
  const handlePrintPDF = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export Suite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Export Spatial Analysis Report
            </h2>
            <p className="text-xs text-slate-400">
              Download or copy spatial health metrics, detected furniture
              inventories, and AI design tips for <strong>{name}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-full hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          {/* Option 1: PDF Printable Report */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  PDF Spatial Audit Report
                </h4>
                <p className="text-[11px] text-slate-400">
                  Print or save as a PDF document with charts, score cards, and
                  design advice.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PDF / Print</span>
            </button>
          </div>

          {/* Option 2: JSON Raw Data */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-violet-500/30 transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-violet-300 transition-colors">
                  Raw JSON Data Specification
                </h4>
                <p className="text-[11px] text-slate-400">
                  Export bounding box coordinates, grid matrices, and raw score
                  metrics for CAD/BIM.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>.JSON Data</span>
            </button>
          </div>

          {/* Option 3: Copy Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Copy className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                  Copy Executive Summary
                </h4>
                <p className="text-[11px] text-slate-400">
                  Copy formatted analysis highlights to clipboard for instant
                  messaging & emails.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Matter AI Certified Spatial Analytics</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
