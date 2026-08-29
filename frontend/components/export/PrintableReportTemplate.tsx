'use client';

import React from 'react';

interface PrintableReportTemplateProps {
  activeRoom: any;
}

export function PrintableReportTemplate({ activeRoom }: PrintableReportTemplateProps) {
  if (!activeRoom) return null;

  const analysis = activeRoom.analysis || {};
  const name = activeRoom.name || "Room Environment";
  const spaceType = activeRoom.type || activeRoom.spaceType || "living_room";
  const dimensions = activeRoom.dimensions || { length: 16, width: 12, unit: "ft" };
  const imageUrl = activeRoom.imageUrl || activeRoom.originalImageUrl || "";

  // Extract scores with robust fallback support across data shapes
  const overallScore = Math.round(analysis.scores?.overall ?? analysis.overallScore ?? 85);
  const flowScore = Math.round(analysis.scores?.flow ?? analysis.flowScore ?? 80);
  const symmetryScore = Math.round(analysis.scores?.symmetry ?? analysis.symmetryScore ?? 88);
  const clutterScore = Math.round(analysis.scores?.clutter ?? analysis.clutterScore ?? 75);
  const accessibilityScore = Math.round(analysis.scores?.accessibility ?? analysis.accessibilityScore ?? 90);
  const lightingScore = Math.round(analysis.scores?.lighting ?? analysis.lightingScore ?? 85);

  const detections = analysis.detections || [];
  const reasoning = analysis.reasoning || [];

  return (
    <div id="printable-report-area" className="hidden print:block print:w-full print:p-8 bg-white text-slate-900 font-sans">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Matter AI Spatial Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{name}</h1>
          <p className="text-xs text-slate-600">
            Space Type: <strong className="capitalize">{spaceType.replace('_', ' ')}</strong> | Dimensions: <strong>{dimensions.length}x{dimensions.width} {dimensions.unit}</strong>
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-900">
            {overallScore}<span className="text-base text-slate-500">/100</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Overall Health Score
          </span>
        </div>
      </div>

      {/* Main Image & Scores Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Room Photo */}
        <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center text-slate-400 text-xs font-bold">
              Room Scan Image
            </div>
          )}
        </div>

        {/* Score Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            Category Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Flow Circulation</span>
              <strong className="text-sm font-bold text-slate-900">{flowScore}/100</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Visual Symmetry</span>
              <strong className="text-sm font-bold text-slate-900">{symmetryScore}/100</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Clutter Density</span>
              <strong className="text-sm font-bold text-slate-900">{clutterScore}/100</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px]">Ergonomic Access</span>
              <strong className="text-sm font-bold text-slate-900">{accessibilityScore}/100</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Furniture Inventory Table */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-3">
          Detected Furniture Inventory ({detections.length} items)
        </h3>
        {detections.length > 0 ? (
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="p-2 font-bold">#</th>
                <th className="p-2 font-bold">Element Label</th>
                <th className="p-2 font-bold">Confidence</th>
                <th className="p-2 font-bold">Position (X, Y)</th>
                <th className="p-2 font-bold">Dimensions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {detections.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-2 font-bold text-slate-900">{item.label}</td>
                  <td className="p-2 text-slate-600">{Math.round((item.confidence || 0.9) * 100)}%</td>
                  <td className="p-2 text-slate-600">
                    ({item.boundingBox?.x || 0}%, {item.boundingBox?.y || 0}%)
                  </td>
                  <td className="p-2 text-slate-600">
                    {item.dimWidth ? `${item.dimWidth}x${item.dimDepth} ${dimensions.unit}` : 'Standard'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 italic">
            No specific floor obstacles detected in scan.
          </div>
        )}
      </div>

      {/* AI Ergonomic Recommendations */}
      {reasoning.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-3">
            AI Ergonomic Layout Advice
          </h3>
          <div className="space-y-2">
            {reasoning.map((r: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <strong className="text-slate-900">{r.title}:</strong> <span className="text-slate-600">{r.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Timestamp */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
        <span>Report Generated: {new Date().toLocaleDateString()}</span>
        <span>Matter AI Spatial Intelligence Engine v2.0</span>
      </div>
    </div>
  );
}
