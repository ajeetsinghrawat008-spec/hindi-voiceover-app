import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { VOICE_TONES } from '../data/tones';

export const VoiceVerificationBadge: React.FC = () => {
  return (
    <div id="male-voices-verification-card" className="rounded-xl bg-zinc-950/60 border border-zinc-800/80 p-3.5 sm:p-4 text-xs">
      <div className="flex items-center gap-2 mb-2.5 text-zinc-200 font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Strict Male Voice Verification Table</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-zinc-400">
        {VOICE_TONES.map((t) => (
          <div key={t.id} className="p-2 rounded-lg bg-zinc-900/70 border border-zinc-800/60 flex items-center justify-between gap-1.5">
            <div>
              <span className="font-medium text-zinc-200 block truncate">{t.name}</span>
              <span className="font-mono text-[11px] text-rose-400">{t.voiceId}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shrink-0">
              <Check className="w-3 h-3" /> MALE
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-400 mt-2">
        Notice: All female voices (such as hi-IN-Neural2-A, hi-IN-Wavenet-A, hi-IN-Standard-A, hi-IN-Neural2-D, hi-IN-Wavenet-D) are strictly excluded from this application.
      </p>
    </div>
  );
};
