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
  const arcLength = strokeLength * 0.5; // 180 degrees semicircle
  const strokeDashoffset = arcLength - (clampedSpeed / maxSpeed) * arcLength;

  const needleAngle = (clampedSpeed / maxSpeed) * 180;

  const isTesting = ['ping', 'download', 'upload', 'initializing'].includes(status);
  const isSaving = status === 'saving';

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full">
      
      {/* Gauge Semicircle Container */}
      <div className="w-full max-w-[280px] h-[150px] flex items-center justify-center relative overflow-hidden select-none">
        <svg className="w-full h-full overflow-visible" viewBox="0 10 260 138">
          <defs>
            {/* Simple Colorful Sweep Gradient */}
            <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" /> {/* Clean Blue */}
              <stop offset="50%" stopColor="#8b5cf6" /> {/* Indigo */}
              <stop offset="100%" stopColor="#ec4899" /> {/* Pink/Red */}
            </linearGradient>
          </defs>

          {/* Semicircle Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(180, 130, 130)"
          />

          {/* Semicircle Progress Ring */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="url(#activeGlow)"
            strokeWidth="8"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(180, 130, 130)"
            transition={{ type: 'spring', damping: 24, stiffness: 55 }}
          />

          {/* Minor Ticks (180 to 360 degrees) */}
          {Array.from({ length: 51 }).map((_, idx) => {
            if (idx % 5 === 0) return null;
            const angle = 180 + idx * 3.6;
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 8) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 8) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 4) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 4) * Math.sin(rad)).toFixed(3));
            const isActive = speed >= (idx / 50) * maxSpeed;

            return (
              <line
                key={`minor-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? '#3b82f6' : '#cbd5e1'}
                strokeWidth="1.2"
                className="transition-colors duration-200"
              />
            );
          })}

          {/* Major Ticks and Value Labels (180 to 360 degrees) */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = 180 + idx * 18;
            const rad = (angle * Math.PI) / 180;
            const x1 = Number((130 + (radius - 12) * Math.cos(rad)).toFixed(3));
            const y1 = Number((130 + (radius - 12) * Math.sin(rad)).toFixed(3));
            const x2 = Number((130 + (radius - 4) * Math.cos(rad)).toFixed(3));
            const y2 = Number((130 + (radius - 4) * Math.sin(rad)).toFixed(3));
            
            const xl = Number((130 + (radius - 24) * Math.cos(rad)).toFixed(3));
            const yl = Number((130 + (radius - 24) * Math.sin(rad)).toFixed(3));
            const val = Math.round((idx / 10) * maxSpeed);
            
            const isActive = speed >= (idx / 10) * maxSpeed;

            return (
              <g key={`major-${idx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isActive ? '#2563eb' : '#cbd5e1'}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  className="transition-colors duration-200"
                />
                <text
                  x={xl}
                  y={yl}
                  fill={isActive ? '#1e3a8a' : '#64748b'}
                  fontSize="9"
                  fontWeight="800"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-mono transition-colors duration-200 select-none"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Semicircle Needle */}
          <g 
            style={{ 
              transform: `rotate(${needleAngle}deg)`, 
              transformOrigin: '130px 130px',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' 
            }}
          >
            {/* Pointer Shaft pointing left initially */}
            <line
              x1="130"
              y1="130"
              x2="45"
              y2="130"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Pointer Tip */}
            <line
              x1="60"
              y1="130"
              x2="42"
              y2="130"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Center Hub */}
          <circle
            cx="130"
            cy="130"
            r="16"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
            className="shadow-sm"
          />
          <circle
            cx="130"
            cy="130"
            r="6"
            fill="#2563eb"
          />
        </svg>
      </div>

      {/* Control & Result Details (Placed in Normal HTML Flow below the gauge - Mobile Touch Friendly) */}
      <div className="w-full flex flex-col items-center mt-3 text-center min-h-[120px] justify-start">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center pt-2 w-full"
            >
              <button
                onClick={onStart}
                className="w-full max-w-[220px] px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-base tracking-wider shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border border-blue-700"
              >
                START TEST
              </button>
            </motion.div>
          )}

          {isTesting && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-black font-mono tracking-tight text-slate-800">
                  {speed.toFixed(1)}
                </span>
                <span className="text-slate-400 text-xs font-black tracking-wider uppercase ml-1.5 font-mono">
                  Mbps
                </span>
              </div>
              
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase mt-2 animate-pulse tracking-wider ${
                status === 'download' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                status === 'upload' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                status === 'ping' ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-50 border-slate-100'
              }`}>
                {status}ing
              </span>

              <button
                onClick={onAbort}
                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold uppercase tracking-wider mt-3 underline cursor-pointer"
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
              className="flex flex-col items-center pt-4"
            >
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2" />
              <span className="text-[10px] font-bold text-slate-500">Saving Results...</span>
            </motion.div>
          )}

          {status === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="flex flex-col items-center px-5 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[9px] text-slate-450 uppercase tracking-widest font-bold mb-0.5">
                  Quality Grade
                </span>
                <span className={`text-lg font-black tracking-tight ${
                  grade === 'Excellent' ? 'text-emerald-600' :
                  grade === 'Good' ? 'text-blue-600' :
                  grade === 'Fair' ? 'text-amber-600' : 'text-rose-600'
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
                className="text-[10px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider mt-3 cursor-pointer border border-slate-200 bg-white hover:bg-slate-50 px-4 py-1.5 rounded-lg transition duration-150"
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
              className="flex flex-col items-center pt-2"
            >
              <span className="text-rose-500 font-bold text-xs tracking-wider uppercase mb-1">
                {status === 'aborted' ? 'Aborted' : 'Failed'}
              </span>
              <button
                onClick={onStart}
                className="text-[10px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider mt-2.5 cursor-pointer"
              >
                Retry Test
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
