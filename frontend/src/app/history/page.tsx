'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Download, Upload, Clock, Activity, Globe, Compass, Trash2 } from 'lucide-react';

interface SpeedTestRecord {
  id: number;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  networkQuality: string;
  ipAddress: string;
  ispName: string;
  deviceInfo: string;
  connectionInfo: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SpeedTestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/network/history?userId=guest-user-123');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching test history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Network Speed Logs</h2>
          <p className="text-sm text-slate-400 mt-1">
            Historical archives of all completed speed tests for this client.
          </p>
        </div>
        
        <button
          onClick={fetchHistory}
          className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 rounded-xl transition duration-200 cursor-pointer"
        >
          Refresh Log
        </button>
      </div>

      {/* History Card Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-400">Loading archives...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">No Records Found</span>
              <span className="text-xs text-slate-500 mt-2">
                You haven't run any network speed tests yet. Go back to the dashboard and trigger your first run.
              </span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-white/[0.01]">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6 text-emerald-400">Download</th>
                  <th className="py-4 px-6 text-purple-400">Upload</th>
                  <th className="py-4 px-6 text-indigo-400">Ping</th>
                  <th className="py-4 px-6 text-blue-400">Jitter</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6 hidden md:table-cell">Client Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {history.map((record) => {
                  const dateStr = new Date(record.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const timeStr = new Date(record.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={record.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                      {/* Timestamp */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{dateStr}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{timeStr}</span>
                        </div>
                      </td>

                      {/* Download */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                          <Download className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {record.downloadSpeed.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">Mbps</span>
                        </div>
                      </td>

                      {/* Upload */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                          <Upload className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          {record.uploadSpeed.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">Mbps</span>
                        </div>
                      </td>

                      {/* Ping */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          {record.ping.toFixed(0)}
                          <span className="text-[10px] text-slate-500 font-medium">ms</span>
                        </div>
                      </td>

                      {/* Jitter */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                          <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {record.jitter.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">ms</span>
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          record.networkQuality === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          record.networkQuality === 'Good' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          record.networkQuality === 'Fair' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {record.networkQuality}
                        </span>
                      </td>

                      {/* Client Metadata */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex flex-col space-y-1 text-[11px] text-slate-400">
                          {record.ispName && (
                            <span className="flex items-center gap-1 text-slate-300 font-medium">
                              <Globe className="w-3 h-3 text-slate-500" />
                              {record.ispName} ({record.ipAddress || '0.0.0.0'})
                            </span>
                          )}
                          {record.deviceInfo && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                              <Compass className="w-3 h-3 text-slate-500" />
                              {record.deviceInfo} ({record.connectionInfo || 'WiFi'})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
