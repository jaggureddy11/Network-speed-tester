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

  const radius = 105;
  const strokeLength = 2 * Math.PI * radius;
  const arcLength = strokeLength * 0.75;
  const strokeDashoffset = arcLength - (clampedSpeed / maxSpeed) * arcLength;

  const needleAngle = 135 + (clampedSpeed / maxSpeed) * 270;

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(status);
  const isSaving = status === 'saving';

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="relative w-80 h-80 flex items-center justify-center rounded-full bg-slate-950 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_10px_30px_rgba(0,0,0,0.4)] border border-slate-800 p-3">
        
        {/* Gauge SVG */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 260 260">
          <defs>
            {/* Professional Radial Bezel Gradient */}
            <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.01)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.6)" />
            </radialGradient>

            {/* Glowing Active Ring Gradient */}
            <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Hub Metallic Gradient */}
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            
            {/* Soft Needle Glow Filter */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="0" result="offsetblur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.4" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Instrument Face Background Details */}
          <circle cx="130" cy="130" r="120" fill="#020617" />
          <circle cx="130" cy="130" r="120" fill="url(#glassGrad)" />
          
          {/* Inner Decorative Bezel Ring */}
          <circle
            cx="130"
            cy="130"
            r="118"
            fill="transparent"
            stroke="rgba(71, 85, 105, 0.2)"
            strokeWidth="1.5"
          />

          {/* Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
          />

          {/* Redline Warning Zone (Last 20% of gauge) */}
          <circle
            cx="130"
            cy="130"
            r={radius + 4}
            fill="transparent"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray={`${arcLength * 0.2} ${strokeLength}`}
            strokeDashoffset={-arcLength * 0.8}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
            opacity="0.4"
          />

          {/* Glowing Progress Ring */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="url(#activeGlow)"
            strokeWidth="6"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
            transition={{ type: 'spring', damping: 24, stiffness: 55 }}
          />

          {/* Minor Ticks */}
          {Array.from({ length: 51 }).map((_, idx) => {
            if (idx % 5 === 0) return null;
            const angle = 135 + idx * 5.4;
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 8) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 8) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 5) * Math.sin(rad)).toFixed(3));
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
            const angle = 135 + idx * 27;
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 12) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 12) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 5) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 5) * Math.sin(rad)).toFixed(3));
            
            // Speed label positions
            const xl = Number((130 + (radius - 24) * Math.cos(rad)).toFixed(3));
            const yl = Number((130 + (radius - 24) * Math.sin(rad)).toFixed(3));
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
                {/* Tick Speed Number */}
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
              transformOrigin: '130px 130px',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1.05)' 
            }}
          >
            {/* Needle Shaft - Bright Red with shadow/glow */}
            <line
              x1="130"
              y1="130"
              x2="130"
              y2="42"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            {/* Orange Needle overlay for realistic detail */}
            <line
              x1="130"
              y1="65"
              x2="130"
              y2="38"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Needle Cap (Center Hub) */}
          <circle
            cx="130"
            cy="130"
            r="15"
            fill="url(#hubGradient)"
            stroke="#020617"
            strokeWidth="2.5"
          />
          <circle
            cx="130"
            cy="130"
            r="5"
            fill="#475569"
          />
          <circle
            cx="130"
            cy="130"
            r="1.5"
            fill="#ef4444"
          />
        </svg>

        {/* Center Text UI Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="go"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onStart}
                className="pointer-events-auto w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-2xl tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer border border-blue-500/50"
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
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                    {speed.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1">
                  Mbps
                </span>
                
                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase mt-4 animate-pulse tracking-wider ${
                  status === 'download' ? 'text-blue-400 bg-blue-950/80 border-blue-800' :
                  status === 'upload' ? 'text-indigo-400 bg-indigo-950/80 border-indigo-800' :
                  status === 'ping' ? 'text-slate-300 bg-slate-800/80 border-slate-700' : 'text-slate-400 bg-slate-900 border-slate-800'
                }`}>
                  {status}ing
                </span>

                <button
                  onClick={onAbort}
                  className="pointer-events-auto text-[9px] text-rose-400 hover:text-rose-350 font-bold uppercase tracking-wider mt-4 underline cursor-pointer"
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
                <div className="w-7 h-7 border-3 border-blue-900 border-t-blue-500 rounded-full animate-spin mb-3" />
                <span className="text-[10px] font-semibold text-slate-400">Saving...</span>
              </motion.div>
            )}

            {status === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">
                    Quality Grade
                  </span>
                  <span className={`text-xl font-black tracking-tight ${
                    grade === 'Excellent' ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]' :
                    grade === 'Good' ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.3)]' :
                    grade === 'Fair' ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]' :
                    'text-rose-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.3)]'
                  }`}>
                    {grade}
                  </span>
                  {score && (
                    <span className="text-slate-400 text-[9px] mt-0.5 font-bold font-mono">
                      Score: {score}/100
                    </span>
                  )}
                </div>
                
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[9px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider mt-4 cursor-pointer border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg transition duration-150"
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
                <span className="text-rose-400 font-bold text-xs tracking-wider uppercase mb-1">
                  {status === 'aborted' ? 'Aborted' : 'Failed'}
                </span>
                <span className="text-[9px] text-slate-400 text-center max-w-[120px]">
                  {status === 'aborted' ? 'User cancelled.' : 'Unreachable.'}
                </span>
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[9px] text-blue-400 hover:text-blue-350 font-bold uppercase tracking-wider mt-4 cursor-pointer"
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
