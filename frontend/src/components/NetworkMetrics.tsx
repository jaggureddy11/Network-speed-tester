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
        status === 'ping' ? 'border-cyan-400 bg-cyan-500/5 ring-1 ring-cyan-400/30' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Ping</span>
          <Clock className={`w-4 h-4 ${status === 'ping' ? 'text-cyan-400 animate-pulse' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-white tracking-tight">
            {status === 'initializing' ? '—' : ping > 0 ? ping.toFixed(0) : '0'}
          </span>
          <span className="text-xs font-bold text-slate-500 font-mono">ms</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Latency of packets</div>
      </div>

      {/* JITTER CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'ping' ? 'border-cyan-400 bg-cyan-500/5 ring-1 ring-cyan-400/30' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Jitter</span>
          <Activity className={`w-4 h-4 ${status === 'ping' ? 'text-cyan-400 animate-pulse' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-white tracking-tight">
            {status === 'initializing' ? '—' : jitter > 0 ? jitter.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-500 font-mono">ms</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Consistency of response</div>
      </div>

      {/* DOWNLOAD CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'download' ? 'border-cyan-400 bg-cyan-500/5 ring-1 ring-cyan-400/30' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Download</span>
          <Download className={`w-4 h-4 ${status === 'download' ? 'text-cyan-400 animate-bounce' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-white tracking-tight">
            {status === 'initializing' || status === 'ping' ? '—' : downloadSpeed > 0 ? downloadSpeed.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-500 font-mono">Mbps</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Data download rate</div>
      </div>

      {/* UPLOAD CARD */}
      <div className={`glass-panel rounded-2xl p-5 flex flex-col transition-all duration-300 ${
        status === 'upload' ? 'border-purple-400 bg-purple-500/5 ring-1 ring-purple-400/30' : ''
      }`}>
        <div className="flex justify-between items-center text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Upload</span>
          <Upload className={`w-4 h-4 ${status === 'upload' ? 'text-purple-400 animate-bounce' : ''}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-black font-mono text-white tracking-tight">
            {status === 'initializing' || status === 'ping' || status === 'download' ? '—' : uploadSpeed > 0 ? uploadSpeed.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs font-bold text-slate-500 font-mono">Mbps</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-2 font-medium">Data upload rate</div>
      </div>
    </div>
  );
}
