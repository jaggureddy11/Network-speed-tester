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
  // Determine dynamic max speed range for gauge scaling (10, 100, or 1000 Mbps)
  const getSpeedMax = () => {
    if (speed <= 8) return 10;
    if (speed <= 90) return 100;
    return 1000;
  };

  const maxSpeed = getSpeedMax();
  const clampedSpeed = Math.min(speed, maxSpeed);

  // SVG Gauge calculations
  // Radius of the circle dial is 120. Stroke length = 2 * PI * r
  const radius = 110;
  const strokeLength = 2 * Math.PI * radius;
  
  // We use 3/4 circle (270 degrees) for the gauge starting at 135 deg to 45 deg
  const arcLength = strokeLength * 0.75;
  const strokeDashoffset = arcLength - (clampedSpeed / maxSpeed) * arcLength;

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(status);
  const isSaving = status === 'saving';

  // Rotation of needle (from -135deg to +135deg, total 270 degrees sweep)
  const needleRotation = -135 + (clampedSpeed / maxSpeed) * 270;

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Background glow when active */}
        <AnimatePresence>
          {isTesting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute inset-4 rounded-full filter blur-[40px] opacity-25 -z-10 ${
                status === 'upload' ? 'bg-purple-500' : 'bg-cyan-500'
              }`}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* Gauge SVG */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 260 260">
          <defs>
            {/* Gradients */}
            <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
          />

          {/* Progress track circle */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke={`url(#${status === 'upload' ? 'purpleGlow' : 'cyanGlow'})`}
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
            filter="url(#glowEffect)"
            transition={{ type: 'spring', damping: 15, stiffness: 60 }}
          />

          {/* Glowing ticks inside gauge */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = 135 + idx * 27; // 135 to 405
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 12) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 12) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 5) * Math.sin(rad)).toFixed(3));
            const isActive = speed >= (idx / 10) * maxSpeed;

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? (status === 'upload' ? '#a855f7' : '#06b6d4') : 'rgba(255,255,255,0.1)'}
                strokeWidth={isActive ? '2.5' : '1.5'}
                className="transition-colors duration-300"
              />
            );
          })}
        </svg>

        {/* Center UI Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="go"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onStart}
                className="pointer-events-auto w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-black text-2xl tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] border border-white/20 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
              >
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
                {/* Real-time speed numeric */}
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                    {speed.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase mt-1">
                  Mbps
                </span>
                
                {/* Active test mode status label */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase mt-4 animate-pulse ${
                  status === 'download' ? 'text-cyan-400 bg-cyan-500/5' :
                  status === 'upload' ? 'text-purple-400 bg-purple-500/5' :
                  status === 'ping' ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 bg-slate-500/5'
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
                {/* Network Quality Badge */}
                <div className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
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
      
      {/* Auto-ranging scale indicators */}
      <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-2">
        Scale: 0 - {maxSpeed} Mbps
      </div>
    </div>
  );
}
