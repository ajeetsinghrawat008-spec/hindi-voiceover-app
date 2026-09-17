import React from 'react';
import { FileText, Clock, Type, Sparkles, Trash2 } from 'lucide-react';

interface ScriptInputProps {
  script: string;
  onChange: (val: string) => void;
  speed: number;
  onSelectSample: (sample: string) => void;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({
  script,
  onChange,
  speed,
  onSelectSample,
}) => {
  // Metric calculations
  const trimmed = script.trim();
  const characterCount = script.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  
  // Audio duration estimation: Hindi speech average is ~2.3 words per second (138 WPM) at 1.0x speed
  const estimatedSeconds = wordCount > 0 ? Math.max(1, Math.round(wordCount / (2.3 * speed))) : 0;
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const durationFormatted = minutes > 0 
    ? `${minutes}m ${seconds}s` 
    : `${seconds}s`;

  return (
    <section id="script-input-section" className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-rose-500" />
          <label htmlFor="script-textarea" className="text-sm font-semibold text-zinc-200">
            Script (Hindi / Hinglish)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-sample-script"
            onClick={() => onSelectSample('सफलता सिर्फ सोचने से नहीं मिलती, बल्कि हर दिन लगातार अनुशासन और मेहनत से हासिल होती है। जब आप अपने डर का सामना करते हैं, तो कोई भी रुकावट आपको रोक नहीं सकती।')}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2 rounded-md hover:bg-rose-950/40 transition-colors border border-rose-900/40"
            title="Load sample Hindi script"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Script</span>
          </button>
          
          {script && (
            <button
              type="button"
              id="btn-clear-script"
              onClick={() => onChange('')}
              className="text-xs text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors"
              title="Clear script"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <textarea
        id="script-textarea"
        rows={5}
        value={script}
        onChange={(e) => onChange(e.target.value)}
        placeholder="यहाँ अपनी हिंदी या हिंग्लिश स्क्रिप्ट लिखें या पेस्ट करें... (e.g. सफलता उन्हीं को मिलती है जो हार नहीं मानते...)"
        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 sm:p-4 text-zinc-100 placeholder-zinc-500 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-y min-h-[140px]"
      />

      {/* Metrics Row: Word Count, Character Count, Estimated Audio Duration */}
      <div id="script-metrics-bar" className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div id="metric-words" className="flex items-center gap-1.5 font-medium">
            <span className="text-zinc-500 font-normal">Words:</span>
            <span className="text-zinc-200 font-mono">{wordCount}</span>
          </div>
          <div id="metric-characters" className="flex items-center gap-1.5 font-medium">
            <Type className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500 font-normal">Characters:</span>
            <span className="text-zinc-200 font-mono">{characterCount}</span>
          </div>
        </div>

        <div id="metric-duration" className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-zinc-400 font-normal">Est. Duration:</span>
          <span className="text-rose-300 font-semibold font-mono">
            {durationFormatted}
          </span>
          <span className="text-[10px] text-zinc-500">(@{speed}x)</span>
        </div>
      </div>
    </section>
  );
};
