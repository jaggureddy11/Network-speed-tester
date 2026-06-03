'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeedometerProps {
  speed: number;
  status: 'idle' | 'initializing' | 'ping' | 'download' | 'upload' | 'saving' | 'completed' | 'aborted' | 'failed';
  progress: number;
  onStart: () => void;
  onAbort: () => void;
  grade?: string;
  score?: number;
}

export default function Speedometer({
  speed,
  status,
  progress,
  onStart,
  onAbort,
  grade,
  score,
}: SpeedometerProps) {
  const getSpeedMax = () => {
    if (speed <= 8) return 10;
    if (speed <= 90) return 100;
    return 1000;
  };

  const maxSpeed = getSpeedMax();
  const clampedSpeed = Math.min(speed, maxSpeed);

  const radius = 110;
  const strokeLength = 2 * Math.PI * radius;
  const arcLength = strokeLength * 0.75;
  const strokeDashoffset = arcLength - (clampedSpeed / maxSpeed) * arcLength;

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(status);
  const isSaving = status === 'saving';

  // Tick color evaluator based on index and speed
  const getTickColor = (idx: number, isActive: boolean) => {
    if (!isActive) return 'rgba(255, 255, 255, 0.08)';
    
    // Dynamic color gradient for active ticks
    if (idx <= 3) return '#06b6d4'; // Cyan
    if (idx <= 6) return '#3b82f6'; // Royal Blue
    if (idx <= 8) return '#a855f7'; // Purple
    return '#ec4899'; // Hot Pink / Fuchsia
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Dynamic Colorful Glow Ring */}
        <AnimatePresence>
          {isTesting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-6 rounded-full filter blur-[50px] opacity-30 -z-10 transition-colors duration-500 ${
                status === 'download' ? 'bg-cyan-500' :
                status === 'upload' ? 'bg-fuchsia-500' :
                'bg-indigo-500'
              }`}
            />
          )}
        </AnimatePresence>

        {/* Gauge SVG */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 260 260">
          <defs>
            {/* Premium Multi-Stop Gradient (Cyan -> Blue -> Purple -> Fuchsia) */}
            <linearGradient id="premiumRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            {/* Glowing effect filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer rotating sci-fi dotted halo */}
          {isTesting && (
            <motion.circle
              cx="130"
              cy="130"
              r={radius + 14}
              fill="transparent"
              stroke={status === 'upload' ? 'rgba(236,72,153,0.15)' : 'rgba(6,182,212,0.15)'}
              strokeWidth="1.5"
              strokeDasharray="4 20"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              transform="rotate(0, 130, 130)"
            />
          )}

          {/* Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
          />

          {/* Progress Ring with colorful premium gradient */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="url(#premiumRainbow)"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
            filter="url(#neonGlow)"
            transition={{ type: 'spring', damping: 18, stiffness: 50 }}
          />

          {/* Glowing ticks inside dial */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = 135 + idx * 27;
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 12) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 12) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 5) * Math.sin(rad)).toFixed(3));
            const isActive = speed >= (idx / 10) * maxSpeed;
            const tickColor = getTickColor(idx, isActive);

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tickColor}
                strokeWidth={isActive ? '2.5' : '1.5'}
                className="transition-colors duration-200"
              />
            );
          })}
        </svg>

        {/* Center UI Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="go"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onStart}
                className="pointer-events-auto w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-600 to-rose-500 hover:from-cyan-400 hover:via-purple-500 hover:to-rose-400 text-white font-black text-2xl tracking-widest shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] border border-white/20 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                GO
              </motion.button>
            )}

            {isTesting && (
              <motion.div
                key="testing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-md">
                    {speed.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase mt-1">
                  Mbps
                </span>
                
                <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase mt-4 animate-pulse ${
                  status === 'download' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' :
                  status === 'upload' ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30' :
                  status === 'ping' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-slate-400 bg-slate-500/10 border-slate-500/30'
                }`}>
                  {status}ing
                </span>

                <button
                  onClick={onAbort}
                  className="pointer-events-auto text-xs text-rose-400 hover:text-rose-300 font-semibold uppercase tracking-widest mt-4 underline cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            )}

            {isSaving && (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-3" />
                <span className="text-sm font-medium text-slate-400">Saving Results...</span>
              </motion.div>
            )}

            {status === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
                    Quality Grade
                  </span>
                  <span className={`text-3xl font-black tracking-tight ${
                    grade === 'Excellent' ? 'text-emerald-400' :
                    grade === 'Good' ? 'text-cyan-400' :
                    grade === 'Fair' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {grade}
                  </span>
                  {score && (
                    <span className="text-slate-500 text-xs mt-1 font-semibold">
                      Quality Score: {score}/100
                    </span>
                  )}
                </div>
                
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest mt-6 cursor-pointer border border-cyan-400/25 bg-cyan-400/5 px-4 py-2 rounded-xl transition duration-200"
                >
                  Test Again
                </button>
              </motion.div>
            )}

            {['aborted', 'failed'].includes(status) && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-rose-400 font-bold text-sm tracking-wider uppercase mb-1">
                  {status === 'aborted' ? 'Test Aborted' : 'Test Failed'}
                </span>
                <span className="text-xs text-slate-500 text-center max-w-[150px]">
                  {status === 'aborted' ? 'The user cancelled the test.' : 'Could not reach testing server.'}
                </span>
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-xs text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest mt-4 cursor-pointer"
                >
                  Retry Test
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-2">
        Scale: 0 - {maxSpeed} Mbps
      </div>
    </div>
  );
}
