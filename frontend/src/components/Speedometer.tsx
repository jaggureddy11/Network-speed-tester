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

  // Semicircle calculations (180 degree sweep)
  const radius = 105;
  const strokeLength = 2 * Math.PI * radius;
  const arcLength = strokeLength * 0.5; // Half circle
  const strokeDashoffset = arcLength - (clampedSpeed / maxSpeed) * arcLength;

  // Needle starts at 180deg (left) and sweeps 180deg clockwise to 360deg (right)
  const needleAngle = 180 + (clampedSpeed / maxSpeed) * 180;

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(status);
  const isSaving = status === 'saving';

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      {/* Semicircular Automotive Dome Instrument Panel */}
      <div className="relative w-80 h-56 flex items-center justify-center rounded-t-full bg-slate-950 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_10px_35px_rgba(0,0,0,0.5)] border border-slate-800 border-b-2 border-b-slate-700 p-3 pt-6 overflow-hidden">
        
        {/* Gauge SVG */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 260 170">
          <defs>
            {/* Bezel Gloss Reflection */}
            <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.01)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.7)" />
            </radialGradient>

            {/* Glowing Semicircle Gauge Active Gradient */}
            <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Needle Hub Metallic Finish */}
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            
            {/* High-end Needle Glow Filter */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.45" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Instrument Face Background */}
          <path d="M 10 150 A 120 120 0 0 1 250 150 Z" fill="#020617" />
          <path d="M 10 150 A 120 120 0 0 1 250 150 Z" fill="url(#glassGrad)" />
          
          {/* Inner Trim Ring */}
          <path
            d="M 12 150 A 118 118 0 0 1 248 150"
            fill="transparent"
            stroke="rgba(71, 85, 105, 0.25)"
            strokeWidth="1.5"
          />

          {/* Track Circle (Base Gauge Line) */}
          <circle
            cx="130"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(180, 130, 150)"
          />

          {/* Redline Warning Zone (Last 20% of gauge) */}
          <circle
            cx="130"
            cy="150"
            r={radius + 4}
            fill="transparent"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray={`${arcLength * 0.2} ${strokeLength}`}
            strokeDashoffset={-arcLength * 0.8}
            strokeLinecap="round"
            transform="rotate(180, 130, 150)"
            opacity="0.5"
          />

          {/* Glowing Semicircle Progress Ring */}
          <motion.circle
            cx="130"
            cy="150"
            r={radius}
            fill="transparent"
            stroke="url(#activeGlow)"
            strokeWidth="6"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(180, 130, 150)"
            transition={{ type: 'spring', damping: 24, stiffness: 50 }}
          />

          {/* Minor Ticks */}
          {Array.from({ length: 51 }).map((_, idx) => {
            if (idx % 5 === 0) return null;
            const angle = 180 + idx * 3.6; // 180 degrees / 50 subdivisions = 3.6deg each
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 8) * Math.cos(rad)).toFixed(3));
            const y1 = Number((150 + (radius - 8) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((150 + (radius - 5) * Math.sin(rad)).toFixed(3));
            const isActive = speed >= (idx / 50) * maxSpeed;

            return (
              <line
                key={`minor-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth="1"
                className="transition-colors duration-200"
              />
            );
          })}

          {/* Major Ticks and Value Labels */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = 180 + idx * 18; // 180 degrees / 10 major ticks = 18deg each
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 12) * Math.cos(rad)).toFixed(3));
            const y1 = Number((150 + (radius - 12) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((150 + (radius - 5) * Math.sin(rad)).toFixed(3));
            
            // Value Label positions
            const xl = Number((130 + (radius - 23) * Math.cos(rad)).toFixed(3));
            const yl = Number((150 + (radius - 23) * Math.sin(rad)).toFixed(3));
            const val = Math.round((idx / 10) * maxSpeed);
            
            const isRedline = idx >= 9;
            const isActive = speed >= (idx / 10) * maxSpeed;

            return (
              <g key={`major-${idx}`}>
                {/* Major Tick line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isActive 
                      ? (isRedline ? '#ef4444' : '#3b82f6') 
                      : 'rgba(255, 255, 255, 0.18)'
                  }
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="transition-colors duration-200"
                />
                {/* Speed indicator value text */}
                <text
                  x={xl}
                  y={yl}
                  fill={
                    isActive 
                      ? (isRedline ? '#f87171' : '#60a5fa') 
                      : '#475569'
                  }
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-mono transition-colors duration-200 select-none"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Real Speedometer Needle */}
          <g 
            style={{ 
              transform: `rotate(${needleAngle - 270}deg)`, 
              transformOrigin: '130px 150px',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1.05)' 
            }}
          >
            {/* Needle Shaft - Bright Red with shadow/glow */}
            <line
              x1="130"
              y1="150"
              x2="130"
              y2="55"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            {/* Orange overlay for needle detailing */}
            <line
              x1="130"
              y1="85"
              x2="130"
              y2="51"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Needle Cap (Center Hub) */}
          <circle
            cx="130"
            cy="150"
            r="16"
            fill="url(#hubGradient)"
            stroke="#020617"
            strokeWidth="3"
          />
          <circle
            cx="130"
            cy="150"
            r="5.5"
            fill="#475569"
          />
          <circle
            cx="130"
            cy="150"
            r="1.5"
            fill="#ef4444"
          />
        </svg>

        {/* Center Digital Display Screen overlay */}
        <div className="absolute bottom-6 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="go"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onStart}
                className="pointer-events-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xl tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer border border-blue-500/50 mb-2"
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
                className="flex flex-col items-center mb-1"
              >
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                    {speed.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-[9px] font-bold tracking-wider uppercase">
                  Mbps
                </span>
                
                <span className={`text-[8px] font-black px-2.5 py-0.5 rounded-full border uppercase mt-2.5 animate-pulse tracking-wider ${
                  status === 'download' ? 'text-blue-400 bg-blue-950/80 border-blue-800' :
                  status === 'upload' ? 'text-indigo-400 bg-indigo-950/80 border-indigo-800' :
                  status === 'ping' ? 'text-slate-300 bg-slate-800/80 border-slate-700' : 'text-slate-400 bg-slate-900 border-slate-800'
                }`}>
                  {status}ing
                </span>

                <button
                  onClick={onAbort}
                  className="pointer-events-auto text-[8px] text-rose-450 hover:text-rose-400 font-bold uppercase tracking-wider mt-2.5 underline cursor-pointer"
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
                className="flex flex-col items-center mb-5"
              >
                <div className="w-6 h-6 border-3 border-blue-900 border-t-blue-500 rounded-full animate-spin mb-2" />
                <span className="text-[9px] font-semibold text-slate-400">Saving...</span>
              </motion.div>
            )}

            {status === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center mb-1"
              >
                <div className="flex flex-col items-center px-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">
                    Quality Grade
                  </span>
                  <span className={`text-lg font-black tracking-tight ${
                    grade === 'Excellent' ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]' :
                    grade === 'Good' ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.3)]' :
                    grade === 'Fair' ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]' :
                    'text-rose-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.3)]'
                  }`}>
                    {grade}
                  </span>
                  {score && (
                    <span className="text-slate-400 text-[8px] mt-0.5 font-bold font-mono">
                      Score: {score}/100
                    </span>
                  )}
                </div>
                
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[8px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider mt-3 cursor-pointer border border-slate-800 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-lg transition duration-150"
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
                className="flex flex-col items-center mb-1"
              >
                <span className="text-rose-400 font-bold text-xs tracking-wider uppercase mb-0.5">
                  {status === 'aborted' ? 'Aborted' : 'Failed'}
                </span>
                <span className="text-[8px] text-slate-400 text-center max-w-[120px]">
                  {status === 'aborted' ? 'Cancelled.' : 'Error.'}
                </span>
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[8px] text-blue-400 hover:text-blue-350 font-bold uppercase tracking-wider mt-2.5 cursor-pointer"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest mt-3">
        Scale: 0 - {maxSpeed} Mbps
      </div>
    </div>
  );
}
