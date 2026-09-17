import React from 'react';
import { Sliders, Gauge, Activity, RotateCcw } from 'lucide-react';

interface AudioControlsProps {
  speed: number;
  pitch: number;
  onSpeedChange: (speed: number) => void;
  onPitchChange: (pitch: number) => void;
  onReset: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  speed,
  pitch,
  onSpeedChange,
  onPitchChange,
  onReset,
}) => {
  // Descriptive label for pitch
  const getPitchLabel = (p: number) => {
    if (p <= -3) return 'Very Deep / Bass';
    if (p < 0) return 'Deep / Low';
    if (p === 0) return 'Default Pitch';
    if (p <= 3) return 'Warm / Normal';
    return 'Higher';
  };

  const isDefault = speed === 1.0 && pitch === 0;

  return (
    <section id="audio-controls-section" className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-zinc-200">
            Basic Controls
          </h3>
        </div>

        {!isDefault && (
          <button
            type="button"
            id="btn-reset-controls"
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:bg-zinc-900 py-1 px-2 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Speed Slider: 0.75x to 1.5x */}
        <div id="control-speed-container" className="bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
              <Gauge className="w-3.5 h-3.5 text-rose-400" />
              <span>Speed Slider</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/50">
              {speed.toFixed(2)}x
            </span>
          </div>

          <input
            id="slider-speed"
            type="range"
            min="0.75"
            max="1.50"
            step="0.05"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer accent-rose-500"
          />

          <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
            <span>0.75x (Slower)</span>
            <span>1.0x (Normal)</span>
            <span>1.50x (Faster)</span>
          </div>
        </div>

        {/* Pitch Slider: Low to High */}
        <div id="control-pitch-container" className="bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>Pitch Slider</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400">
                {getPitchLabel(pitch)}
              </span>
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/50">
                {pitch > 0 ? `+${pitch}` : pitch} st
              </span>
            </div>
          </div>

          <input
            id="slider-pitch"
            type="range"
            min="-6"
            max="4"
            step="1"
            value={pitch}
            onChange={(e) => onPitchChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer accent-rose-500"
          />

          <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
            <span>Low / Deep</span>
            <span>Default</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </section>
  );
};
