'use client';

import React from 'react';
import { Download, Upload, Clock, Activity } from 'lucide-react';

interface NetworkMetricsProps {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  status: 'idle' | 'initializing' | 'ping' | 'download' | 'upload' | 'saving' | 'completed' | 'aborted' | 'failed';
}

export default function NetworkMetrics({
  downloadSpeed,
  uploadSpeed,
  ping,
  jitter,
  status,
}: NetworkMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {/* PING CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'ping' ? 'border-blue-500/40 bg-blue-500/[0.02] ring-1 ring-blue-500/10' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ping</span>
          <Clock className={`w-4 h-4 text-slate-400 ${status === 'ping' ? 'text-blue-600 animate-pulse' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-slate-800 tracking-tight">
            {status === 'initializing' ? '—' : ping > 0 ? ping.toFixed(0) : '0'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">ms</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Latency of packets</div>
      </div>

      {/* JITTER CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'ping' ? 'border-blue-500/40 bg-blue-500/[0.02] ring-1 ring-blue-500/10' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jitter</span>
          <Activity className={`w-4 h-4 text-slate-400 ${status === 'ping' ? 'text-blue-600 animate-pulse' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-slate-800 tracking-tight">
            {status === 'initializing' ? '—' : jitter > 0 ? jitter.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">ms</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Consistency of response</div>
      </div>

      {/* DOWNLOAD CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'download' ? 'border-blue-500/40 bg-blue-500/[0.02] ring-1 ring-blue-500/10' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Download</span>
          <Download className={`w-4 h-4 text-slate-400 ${status === 'download' ? 'text-blue-600 animate-bounce' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-slate-800 tracking-tight">
            {status === 'initializing' || status === 'ping' ? '—' : downloadSpeed > 0 ? downloadSpeed.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">Mbps</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Data download rate</div>
      </div>

      {/* UPLOAD CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'upload' ? 'border-blue-500/40 bg-blue-500/[0.02] ring-1 ring-blue-500/10' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upload</span>
          <Upload className={`w-4 h-4 text-slate-400 ${status === 'upload' ? 'text-blue-600 animate-bounce' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-slate-800 tracking-tight">
            {status === 'initializing' || status === 'ping' || status === 'download' ? '—' : uploadSpeed > 0 ? uploadSpeed.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">Mbps</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Data upload rate</div>
      </div>
    </div>
  );
}
