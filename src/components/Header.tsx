import React from 'react';
import { Mic, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="app-header" className="border-b border-zinc-800/80 bg-black/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-rose-950/40 text-white">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Hindi AI Voiceover
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/60 text-rose-300">
                PRO TTS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Studio-quality speech generator for Hindi creators & storytellers
            </p>
          </div>
        </div>

        {/* Strict Male Voice Guarantee Badge */}
        <div id="male-voice-guarantee-badge" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Male Voice Guaranteed</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 font-mono text-[11px]">hi-IN Male Only</span>
        </div>
      </div>
    </header>
  );
};
