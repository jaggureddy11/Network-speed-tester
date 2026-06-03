'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, BarChart2 } from 'lucide-react';

interface TrendPoint {
  label: string;
  download: number;
  upload: number;
  ping: number;
}

interface AnalyticsData {
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  bestSpeed: {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter: number;
    createdAt: string;
  } | null;
  worstSpeed: {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter: number;
    createdAt: string;
  } | null;
  trends: {
    daily: TrendPoint[];
    weekly: TrendPoint[];
    monthly: TrendPoint[];
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrend, setActiveTrend] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/network/analytics?userId=guest-user-123');
        if (res.ok) {
          const analytics = await res.json();
          setData(analytics);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-400">Compiling connection trends...</span>
      </div>
    );
  }

  if (!data || (!data.bestSpeed && data.trends.daily.length === 0)) {
    return (
      <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <BarChart2 className="w-6 h-6 text-slate-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800 leading-none">No Data Available</span>
          <span className="text-xs text-slate-500 mt-2">
            Analytics require at least one speed test record to compile averages and chart trends. Run a test to begin.
          </span>
        </div>
      </div>
    );
  }

  const activeTrendData = data.trends[activeTrend] || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">Network Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Perform depth analysis on internet speeds, latencies, and performance cycles.
        </p>
      </div>

      {/* Averages and Stats Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Average Download */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-20 h-20 text-slate-400" />
          </div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Average Download</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-black tracking-tight text-slate-800 font-mono">
              {data.averageDownload.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-bold font-mono">Mbps</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-4">
            <ArrowUpRight className="w-3.5 h-3.5" /> High throughput performance
          </div>
        </div>

        {/* Average Upload */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-20 h-20 text-slate-400" />
          </div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Average Upload</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-black tracking-tight text-slate-800 font-mono">
              {data.averageUpload.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-bold font-mono">Mbps</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold mt-4">
            <ArrowUpRight className="w-3.5 h-3.5" /> Optimal streaming support
          </div>
        </div>

        {/* Average Ping */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-20 h-20 text-slate-400" />
          </div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Average Latency</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-black tracking-tight text-slate-800 font-mono">
              {data.averagePing.toFixed(0)}
            </span>
            <span className="text-xs text-slate-500 font-bold font-mono">ms</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-4">
            <ArrowDownRight className="w-3.5 h-3.5" /> Consistent ping intervals
          </div>
        </div>
      </div>

      {/* Peak Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Peak Record */}
        {data.bestSpeed && (
          <div className="glass-panel rounded-3xl p-5 border-emerald-200 bg-emerald-50/20">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Best Speed Recorded</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-slate-800 font-mono">{data.bestSpeed.downloadSpeed.toFixed(1)} Mbps</span>
              <span className="text-[11px] text-slate-500">Download</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
              <div>Upload: <span className="text-slate-800 font-semibold">{data.bestSpeed.uploadSpeed.toFixed(1)} Mbps</span></div>
              <div>Ping: <span className="text-slate-800 font-semibold">{data.bestSpeed.ping.toFixed(0)} ms</span></div>
              <div>Jitter: <span className="text-slate-800 font-semibold">{data.bestSpeed.jitter.toFixed(1)} ms</span></div>
            </div>
          </div>
        )}

        {/* Worst Record */}
        {data.worstSpeed && (
          <div className="glass-panel rounded-3xl p-5 border-rose-200 bg-rose-50/20">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">Worst Speed Recorded</span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-slate-800 font-mono">{data.worstSpeed.downloadSpeed.toFixed(1)} Mbps</span>
              <span className="text-[11px] text-slate-500">Download</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-500 border-t border-slate-100 pt-3">
              <div>Upload: <span className="text-slate-800 font-semibold">{data.worstSpeed.uploadSpeed.toFixed(1)} Mbps</span></div>
              <div>Ping: <span className="text-slate-800 font-semibold">{data.worstSpeed.ping.toFixed(0)} ms</span></div>
              <div>Jitter: <span className="text-slate-800 font-semibold">{data.worstSpeed.jitter.toFixed(1)} ms</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Trends Graph Panel */}
      <div className="glass-panel rounded-3xl p-6">
        
        {/* Chart Header and Toggles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-base text-slate-800">Speed Trends Over Time</h3>
          
          {/* Daily/Weekly/Monthly Toggle */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200/60">
            <button
              onClick={() => setActiveTrend('daily')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTrend === 'daily' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTrend('weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTrend === 'weekly' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTrend('monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTrend === 'monthly' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Recharts Component */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeTrendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={10}
                fontWeight={600}
                tickLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={10}
                fontWeight={600}
                tickLine={false}
                label={{ value: 'Mbps', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748B', fontSize: 9 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  color: '#1E293B',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
                }}
                itemStyle={{ color: '#475569' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}
              />
              <Area
                type="monotone"
                name="Download Speed"
                dataKey="download"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#dlGrad)"
              />
              <Area
                type="monotone"
                name="Upload Speed"
                dataKey="upload"
                stroke="#64748b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ulGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
