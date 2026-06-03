'use client';

import React, { useEffect, useState } from 'react';
import Speedometer from '@/components/Speedometer';
import NetworkMetrics from '@/components/NetworkMetrics';
import AIInsights from '@/components/AIInsights';
import { useSpeedTest, PUBLIC_SERVERS, SpeedTestServer } from '@/hooks/useSpeedTest';
import { Laptop, Wifi, Globe, Clock, ChevronRight, Server } from 'lucide-react';
import Link from 'next/link';

interface PrevTest {
  id: number;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  networkQuality: string;
  createdAt: string;
}

export default function Dashboard() {
  const [selectedServer, setSelectedServer] = useState<SpeedTestServer>(PUBLIC_SERVERS[0]);
  const { metrics, startTest, abortTest } = useSpeedTest('guest-user-123');
  const [prevTest, setPrevTest] = useState<PrevTest | null>(null);
  const [initialIPData, setInitialIPData] = useState<{ ip: string; isp: string } | null>(null);

  // Fetch initial IP info and previous test on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const ipRes = await fetch('/api/network/speedtest/getIP');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.rawIspInfo) {
            setInitialIPData({
              ip: ipData.rawIspInfo.ip,
              isp: ipData.rawIspInfo.isp,
            });
          }
        }

        const prevRes = await fetch('/api/network/latest?userId=guest-user-123');
        if (prevRes.ok) {
          const data = await prevRes.json();
          setPrevTest(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      }
    };

    fetchInitialData();
  }, [metrics.status]);

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(metrics.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Speedometer and Metrics */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Speedometer and Tester widget */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center relative">
          
          {/* Server Selector Dropdown */}
          <div className="w-full max-w-xs mb-4 flex flex-col items-center z-10">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600" /> Choose Testing Server
            </label>
            <select
              value={selectedServer.name}
              disabled={isTesting}
              onChange={(e) => {
                const s = PUBLIC_SERVERS.find(srv => srv.name === e.target.value);
                if (s) setSelectedServer(s);
              }}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 text-xs font-semibold text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {PUBLIC_SERVERS.map((server) => (
                <option key={server.name} value={server.name}>
                  {server.name}
                </option>
              ))}
            </select>
          </div>

          <Speedometer
            speed={
              metrics.status === 'download' ? metrics.downloadSpeed :
              metrics.status === 'upload' ? metrics.uploadSpeed :
              metrics.status === 'ping' ? metrics.ping : 0
            }
            status={metrics.status}
            progress={metrics.progress}
            onStart={() => startTest(selectedServer)}
            onAbort={abortTest}
            grade={metrics.grade}
            score={metrics.score}
          />

          {/* Client IP, ISP, Device Metadata section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6 border-t border-slate-100 pt-6 text-slate-500">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Client Provider</span>
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {metrics.ispName || initialIPData?.isp || 'Resolving ISP...'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {metrics.clientIp || initialIPData?.ip || '0.0.0.0'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Connection</span>
                <span className="text-xs font-semibold text-slate-800 uppercase">
                  {metrics.connectionInfo || 'Ethernet/WiFi'}
                </span>
                <span className="text-[10px] text-slate-500">Auto-detected</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Device Node</span>
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {metrics.deviceInfo || 'Detecting Client...'}
                </span>
                <span className="text-[10px] text-slate-500">Browser Agent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <NetworkMetrics
          downloadSpeed={metrics.downloadSpeed}
          uploadSpeed={metrics.uploadSpeed}
          ping={metrics.ping}
          jitter={metrics.jitter}
          status={metrics.status}
        />

        {/* AI Insights Card */}
        <AIInsights
          downloadSpeed={metrics.downloadSpeed}
          uploadSpeed={metrics.uploadSpeed}
          ping={metrics.ping}
          jitter={metrics.jitter}
          status={metrics.status}
        />

      </div>

      {/* Right Column: Prev Results & Tips */}
      <div className="space-y-8">
        
        {/* Previous Test Results summary */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-slate-800">Previous Speed Test</h3>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>

          {prevTest ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-sm ${
                  prevTest.networkQuality === 'Excellent' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                  prevTest.networkQuality === 'Good' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                  prevTest.networkQuality === 'Fair' ? 'border-amber-500 bg-amber-50 text-amber-700' :
                  'border-rose-500 bg-rose-50 text-rose-700'
                }`}>
                  {prevTest.networkQuality.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 leading-none">
                    {prevTest.networkQuality} Quality
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium mt-1">
                    Tested {new Date(prevTest.createdAt).toLocaleDateString()} at {new Date(prevTest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Download</span>
                  <span className="text-sm font-black text-slate-850 font-mono">{prevTest.downloadSpeed.toFixed(1)} Mbps</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Upload</span>
                  <span className="text-sm font-black text-slate-850 font-mono">{prevTest.uploadSpeed.toFixed(1)} Mbps</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ping</span>
                  <span className="text-sm font-black text-slate-850 font-mono">{prevTest.ping.toFixed(0)} ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jitter</span>
                  <span className="text-sm font-black text-slate-850 font-mono">{prevTest.jitter.toFixed(1)} ms</span>
                </div>
              </div>

              <Link href="/history" className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition mt-4 pt-3 border-t border-slate-100 w-full">
                View Full Archives <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">
              No historical tests recorded yet. Hit "GO" to start your first network test!
            </div>
          )}
        </div>

        {/* Why Speed Testing Matters info section */}
        <div className="glass-panel rounded-3xl p-6 text-slate-500 space-y-4">
          <h3 className="font-bold text-base text-slate-800">Understanding Speed Test Metrics</h3>
          
          <div className="space-y-3.5 text-xs leading-relaxed">
            <div>
              <strong className="text-slate-700 block mb-0.5">Download Speed</strong>
              How fast data travels from servers to your device. High values support 4K video streaming, file downloading, and browsing.
            </div>
            <div>
              <strong className="text-slate-700 block mb-0.5">Upload Speed</strong>
              How fast data is sent from your device to servers. Crucial for screen sharing, virtual meetings, smart-cams, and online backups.
            </div>
            <div>
              <strong className="text-slate-700 block mb-0.5">Ping (Latency)</strong>
              The time it takes for a request to reach a server and return. Lower ping is critical for lag-free multiplayer gaming and audio/video calls.
            </div>
            <div>
              <strong className="text-slate-700 block mb-0.5">Jitter</strong>
              The variation in latency measurements. High jitter values cause buffer blobs and unstable connection grades.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
