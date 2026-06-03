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

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* Gauge SVG */}
        <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 260 260">
          <defs>
            {/* Professional Blue Gradient */}
            <linearGradient id="corporateBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" /> {/* Deep Navy */}
              <stop offset="100%" stopColor="#2563eb" /> {/* Professional Blue */}
            </linearGradient>
          </defs>

          {/* Track Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="rgba(0, 0, 0, 0.04)"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
          />

          {/* Progress Ring */}
          <motion.circle
            cx="130"
            cy="130"
            r={radius}
            fill="transparent"
            stroke="url(#corporateBlue)"
            strokeWidth="10"
            strokeDasharray={`${arcLength} ${strokeLength}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135, 130, 130)"
            transition={{ type: 'spring', damping: 20, stiffness: 60 }}
          />

          {/* Clean Slate Ticks */}
          {Array.from({ length: 11 }).map((_, idx) => {
            const angle = 135 + idx * 27;
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
                stroke={isActive ? '#2563eb' : 'rgba(0,0,0,0.08)'}
                strokeWidth={isActive ? '2.5' : '1.5'}
                className="transition-colors duration-200"
              />
            );
          })}
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
                className="pointer-events-auto w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl tracking-widest shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer border border-blue-700"
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
                  <span className="text-6xl font-black font-mono tracking-tight text-slate-800">
                    {speed.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-bold tracking-wider uppercase mt-1">
                  Mbps
                </span>
                
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase mt-4 animate-pulse ${
                  status === 'download' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                  status === 'upload' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                  status === 'ping' ? 'text-slate-600 bg-slate-100 border-slate-200' : 'text-slate-400 bg-slate-50 border-slate-100'
                }`}>
                  {status}ing
                </span>

                <button
                  onClick={onAbort}
                  className="pointer-events-auto text-xs text-rose-500 hover:text-rose-600 font-semibold uppercase tracking-wider mt-4 underline cursor-pointer"
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
                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
                <span className="text-xs font-semibold text-slate-500">Saving Results...</span>
              </motion.div>
            )}

            {status === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">
                    Quality Grade
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${
                    grade === 'Excellent' ? 'text-emerald-600' :
                    grade === 'Good' ? 'text-blue-600' :
                    grade === 'Fair' ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {grade}
                  </span>
                  {score && (
                    <span className="text-slate-400 text-[10px] mt-0.5 font-bold">
                      Score: {score}/100
                    </span>
                  )}
                </div>
                
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[10px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider mt-5 cursor-pointer border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-lg transition duration-150"
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
                <span className="text-rose-500 font-bold text-xs tracking-wider uppercase mb-1">
                  {status === 'aborted' ? 'Test Aborted' : 'Test Failed'}
                </span>
                <span className="text-[10px] text-slate-400 text-center max-w-[130px]">
                  {status === 'aborted' ? 'User cancelled test.' : 'Server unreachable.'}
                </span>
                <button
                  onClick={onStart}
                  className="pointer-events-auto text-[10px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider mt-4 cursor-pointer"
                >
                  Retry Test
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-1">
        Scale: 0 - {maxSpeed} Mbps
      </div>
    </div>
  );
}
