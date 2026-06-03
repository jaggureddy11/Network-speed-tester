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
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Network Speed Logs</h2>
          <p className="text-sm text-slate-500 mt-1">
            Historical archives of all completed speed tests for this client.
          </p>
        </div>
        
        <button
          onClick={fetchHistory}
          className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 rounded-xl transition duration-200 cursor-pointer"
        >
          Refresh Log
        </button>
      </div>

      {/* History Card Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-400">Loading archives...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="py-24 text-center text-slate-500 flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-none">No Records Found</span>
              <span className="text-xs text-slate-500 mt-2">
                You haven't run any network speed tests yet. Go back to the dashboard and trigger your first run.
              </span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Download</th>
                  <th className="py-4 px-6">Upload</th>
                  <th className="py-4 px-6">Ping</th>
                  <th className="py-4 px-6">Jitter</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6 hidden md:table-cell">Client Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-sm text-slate-600">
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
                    <tr key={record.id} className="hover:bg-slate-50/40 transition-colors duration-150">
                      {/* Timestamp */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{dateStr}</span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{timeStr}</span>
                        </div>
                      </td>

                      {/* Download */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {record.downloadSpeed.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">Mbps</span>
                        </div>
                      </td>

                      {/* Upload */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          {record.uploadSpeed.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">Mbps</span>
                        </div>
                      </td>

                      {/* Ping */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {record.ping.toFixed(0)}
                          <span className="text-[10px] text-slate-500 font-medium">ms</span>
                        </div>
                      </td>

                      {/* Jitter */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {record.jitter.toFixed(1)}
                          <span className="text-[10px] text-slate-500 font-medium">ms</span>
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          record.networkQuality === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          record.networkQuality === 'Good' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          record.networkQuality === 'Fair' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {record.networkQuality}
                        </span>
                      </td>

                      {/* Client Metadata */}
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex flex-col space-y-1 text-[11px] text-slate-500">
                          {record.ispName && (
                            <span className="flex items-center gap-1 text-slate-700 font-medium">
                              <Globe className="w-3 h-3 text-slate-400" />
                              {record.ispName} ({record.ipAddress || '0.0.0.0'})
                            </span>
                          )}
                          {record.deviceInfo && (
                            <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                              <Compass className="w-3 h-3 text-slate-400" />
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
