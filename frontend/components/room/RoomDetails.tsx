import React from 'react';
import { Room } from '../../types';
import { Ruler, Calendar, Compass, Grid, Sparkles } from 'lucide-react';

interface RoomDetailsProps {
  room: Room;
}

export default function RoomDetails({ room }: RoomDetailsProps) {
  const metadataRows = [
    { label: 'Indexed Name', val: room.name, icon: Compass, color: 'text-primary' },
    { label: 'Space Type', val: room.type.replace('_', ' '), icon: Grid, color: 'text-cyan-400', isCapitalize: true },
    { label: 'Style Preference', val: room.stylePreference, icon: Sparkles, color: 'text-violet-400' },
    { label: 'Room Dimensions', val: room.dimensions ? `${room.dimensions.length}x${room.dimensions.width} ${room.dimensions.unit}` : 'Not Specified', icon: Ruler, color: 'text-emerald-400' },
    { label: 'Scanned On', val: new Date(room.createdAt).toLocaleDateString(), icon: Calendar, color: 'text-amber-400' }
  ];

  return (
    <div className="glass-panel border rounded-3xl p-6 space-y-4">
      <div>
        <h4 className="text-sm font-bold text-foreground">Spatial Metadata</h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Blueprint configurations tracked in database
        </p>
      </div>

      <div className="space-y-3">
        {metadataRows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex justify-between items-center text-xs border-b border-border/40 pb-2.5 last:border-b-0 last:pb-0">
              <span className="text-muted-foreground flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${row.color}`} />
                <span>{row.label}</span>
              </span>
              <span className={`font-bold text-foreground ${row.isCapitalize ? 'capitalize' : ''}`}>
                {row.val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
