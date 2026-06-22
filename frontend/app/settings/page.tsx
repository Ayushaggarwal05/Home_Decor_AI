'use client';

import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import DashboardShell from '@/components/layout/DashboardShell';
import PageContainer from '@/components/layout/PageContainer';
import Link from 'next/link';
import { 
  Settings, 
  ArrowLeft, 
  User, 
  Ruler, 
  SlidersHorizontal, 
  HelpCircle,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { uiPreferences, setUnit, resetUploadState } = useRoomStore();
  const { user } = useAuthStore();

  const handleResetSession = () => {
    resetUploadState();
    alert('Local workspace session cleared.');
  };

  return (
    <DashboardShell>
      <PageContainer>
        {/* Navigation title bar */}
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/studio" 
              className="p-2 border border-border bg-card hover:bg-muted/40 text-foreground rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h3 className="text-base font-bold text-slate-100">System Preferences</h3>
              <p className="text-xs text-muted-foreground">
                Configure spatial measurements and sandbox utilities
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Settings Content */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Section 1: User Profile Mockup */}
          {user && (
            <div className="glass-panel border rounded-3xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
                <User className="h-4.5 w-4.5 text-primary" />
                <span>Account Profile</span>
              </h4>
              <div className="flex items-center space-x-4 p-4 bg-muted/20 border border-border rounded-2xl">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md text-base">
                  {user?.fullName
                    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : user?.email?.slice(0, 2).toUpperCase() ?? 'AU'}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-foreground">{user.fullName || 'Aura User'}</h5>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-0.5 text-[9px] bg-primary/20 text-primary rounded-md font-bold border border-primary/20">
                    {user.tier} Plan Member
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Measurements config */}
          <div className="glass-panel border rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
              <Ruler className="h-4.5 w-4.5 text-cyan-400" />
              <span>Spatial Configurations</span>
            </h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-semibold text-foreground">Default Measurement Unit</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Define metrics for bounding box and clearance guidelines</p>
                </div>

                <div className="flex space-x-1.5 p-1 bg-muted rounded-xl border border-border">
                  {[
                    { key: 'ft', label: 'Feet (ft)' },
                    { key: 'm', label: 'Meters (m)' }
                  ].map((unitOption) => {
                    const isActive = uiPreferences.defaultUnit === unitOption.key;
                    return (
                      <button
                        key={unitOption.key}
                        onClick={() => setUnit(unitOption.key as any)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                          isActive 
                            ? "bg-card text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {unitOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sandbox utilities */}
          <div className="glass-panel border rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
              <Database className="h-4.5 w-4.5 text-amber-500" />
              <span>Sandbox Utilities</span>
            </h4>

            <div className="flex justify-between items-center text-xs">
              <div>
                <h5 className="font-semibold text-foreground">Clear Session Storage</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">Reset file upload flows and clear input diagnostics</p>
              </div>
              <button
                onClick={handleResetSession}
                className="px-4 py-2 border border-border hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Sandbox Session
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-3xl flex items-start space-x-3 text-xs text-muted-foreground">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="leading-normal">
              Aura AI coordinates the frontend user interfaces and API orchestration pipelines. To modify spatial intelligence rules or change Stable Diffusion endpoints, modify environment variables inside <strong className="text-white">.env.local</strong>.
            </p>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
