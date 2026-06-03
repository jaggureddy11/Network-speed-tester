'use client';

import React from 'react';
import { ShieldCheck, Video, Gamepad2, Tv, RefreshCw, Cpu } from 'lucide-react';

interface AIInsightsProps {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  status: string;
}

export default function AIInsights({
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  status,
}: AIInsightsProps) {
  if (status !== 'completed') return null;

  // 1. Task Suitabilities Heuristics
  const canStream4K = downloadSpeed >= 25;
  const canGame = ping <= 30 && jitter <= 5;
  const canZoom = downloadSpeed >= 10 && uploadSpeed >= 5 && ping <= 65;
  const isSuperFast = downloadSpeed >= 150;

  // 2. Generate customized recommendation strings
  const getInsights = () => {
    const items = [];

    if (downloadSpeed >= 100) {
      items.push('Your download speed is exceptionally high. You can download large files and run multiple high-demand applications simultaneously.');
    } else if (downloadSpeed >= 25) {
      items.push('Your download speed is adequate for typical household use, including HD streaming and general browsing.');
    } else {
      items.push('Your download speed is below average. You may experience buffering when streaming high-definition content, especially if multiple devices are connected.');
    }

    if (ping > 50) {
      items.push('High latency (ping) detected. Real-time multiplayer gaming, VoIP calls, and interactive remote desktops may feel laggy. Consider moving closer to your router or connecting via Ethernet.');
    } else {
      items.push('Excellent latency. Online gaming and voice calls will run smoothly without noticeable lag.');
    }

    if (uploadSpeed < 5) {
      items.push('Your upload speed is quite low. Hosting video conferences or uploading large files (like videos or photos) may take a long time or impact call quality.');
    } else {
      items.push('Healthy upload speed. Video conferencing, screen sharing, and streaming live feeds will perform reliably.');
    }

    if (jitter > 8) {
      items.push('Jitter fluctuations are elevated. This can cause packet delivery gaps, leading to sudden stuttering in audio/video calls.');
    }

    return items;
  };

  const insightsList = getInsights();

  return (
    <div className="glass-panel rounded-3xl p-6 w-full relative overflow-hidden">
      {/* Decorative border line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-600" />
      
      <div className="flex items-center gap-2.5 mb-5">
        <Cpu className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-lg text-white">AI Connection Insights</h3>
      </div>

      {/* Task Suitability Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* 4K Streaming */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
          canStream4K ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-slate-800 bg-slate-900/20 text-slate-400'
        }`}>
          <Tv className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300">4K UHD Streaming</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">{canStream4K ? 'Optimal' : 'Limited'}</span>
          </div>
        </div>

        {/* Gaming */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
          canGame ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400' : 'border-slate-800 bg-slate-900/20 text-slate-400'
        }`}>
          <Gamepad2 className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300">Online Gaming</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">{canGame ? 'Lag-Free' : 'Potential Lag'}</span>
          </div>
        </div>

        {/* Video Conference */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
          canZoom ? 'border-purple-500/20 bg-purple-500/5 text-purple-400' : 'border-slate-800 bg-slate-900/20 text-slate-400'
        }`}>
          <Video className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-300">Video Conferencing</span>
            <span className="text-[10px] font-bold uppercase mt-0.5">{canZoom ? 'Excellent' : 'Unstable'}</span>
          </div>
        </div>
      </div>

      {/* Recommendations Bullet List */}
      <div className="space-y-3.5">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">
          Recommendations
        </span>
        {insightsList.map((insight, idx) => (
          <div key={idx} className="flex gap-2.5 items-start text-sm text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
