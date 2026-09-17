import React from 'react';
import { VoiceTone, VoiceToneId } from '../types';
import { Radio, Volume2, UserCheck, CheckCircle2 } from 'lucide-react';

interface ToneSelectorProps {
  tones: VoiceTone[];
  selectedToneId: VoiceToneId;
  onSelectTone: (toneId: VoiceToneId) => void;
  onLoadToneSample?: (phrase: string) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  tones,
  selectedToneId,
  onSelectTone,
  onLoadToneSample,
}) => {
  return (
    <section id="tone-selector-section" className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Voice Tone Selection
          </h2>
        </div>
        <span className="text-xs text-zinc-400">
          Strictly <strong className="text-rose-400 font-medium">MALE</strong> voices only (5 cinematic presets)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-label="Hindi Male Voice Tones">
        {tones.map((tone) => {
          const isSelected = tone.id === selectedToneId;

          return (
            <div
              key={tone.id}
              id={`tone-card-${tone.id}`}
              onClick={() => onSelectTone(tone.id)}
              className={`relative text-left p-3.5 sm:p-4 rounded-xl cursor-pointer border transition-all select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-950/25 border-rose-600/90 ring-1 ring-rose-500/40 shadow-lg shadow-rose-950/30'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base text-zinc-100">
                      {tone.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-normal">
                      ({tone.hindiLabel})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-800/90 text-emerald-400 border border-zinc-700/60 font-mono">
                      <UserCheck className="w-3 h-3" />
                      MALE
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  {tone.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-mono text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded border border-zinc-800">
                  {tone.voiceId}
                </span>

                {onLoadToneSample && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTone(tone.id);
                      onLoadToneSample(tone.samplePhrase);
                    }}
                    className="text-rose-400/90 hover:text-rose-300 inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    Load sample
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
