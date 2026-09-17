import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Download, FileAudio, Check, AlertCircle } from 'lucide-react';
import { SynthesizeResponse } from '../types';

interface AudioPlayerProps {
  audioData: SynthesizeResponse | null;
  onDownloadWavNeeded?: () => Promise<string | null>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioData,
  onDownloadWavNeeded,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [downloadingFormat, setDownloadingFormat] = useState<'mp3' | 'wav' | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Audio source URL from Base64
  const audioSrc = React.useMemo(() => {
    if (!audioData?.audioContent) return '';
    const mime = audioData.mimeType || (audioData.format === 'wav' ? 'audio/wav' : 'audio/mp3');
    return `data:${mime};base64,${audioData.audioContent}`;
  }, [audioData]);

  // Sync with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);
    setCurrentTime(0);
    audio.currentTime = 0;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || audioData?.durationSec || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc, audioData]);

  if (!audioData || !audioData.audioContent) {
    return null;
  }

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio play error:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skipTime = (offset: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + offset));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Trigger file download helper
  const triggerDownload = (base64Data: string, targetFormat: 'mp3' | 'wav') => {
    try {
      // Match extension to actual audio content container to prevent corruption
      const isActuallyWav = audioData.format === 'wav' || audioData.mimeType === 'audio/wav';
      const effectiveFormat = isActuallyWav ? 'wav' : targetFormat;
      const mime = effectiveFormat === 'wav' ? 'audio/wav' : 'audio/mp3';

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });
      const url = URL.createObjectURL(blob);

      const toneSlug = audioData.voiceUsed?.toneId || 'voiceover';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `hindi-male-${toneSlug}-${timestamp}.${effectiveFormat}`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDownloadMp3 = () => {
    setDownloadingFormat('mp3');
    triggerDownload(audioData.audioContent!, 'mp3');
    setTimeout(() => setDownloadingFormat(null), 1000);
  };

  const handleDownloadWav = async () => {
    setDownloadingFormat('wav');
    if (audioData.format === 'wav') {
      triggerDownload(audioData.audioContent!, 'wav');
      setDownloadingFormat(null);
    } else if (onDownloadWavNeeded) {
      const wavBase64 = await onDownloadWavNeeded();
      if (wavBase64) {
        triggerDownload(wavBase64, 'wav');
      } else {
        // Fallback: download current audio with wav extension
        triggerDownload(audioData.audioContent!, 'wav');
      }
      setDownloadingFormat(null);
    } else {
      triggerDownload(audioData.audioContent!, 'wav');
      setDownloadingFormat(null);
    }
  };

  return (
    <section id="audio-player-section" className="rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-rose-900/60 p-4 sm:p-6 shadow-2xl shadow-rose-950/20">
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Notice if Google Cloud TTS needs enabling in user's GCP console */}
      {audioData.apiNotice && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Notice: </span>
            {audioData.apiNotice}
            {audioData.enableApiUrl && (
              <a
                href={audioData.enableApiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-1 text-rose-400 underline hover:text-rose-300 font-medium"
              >
                Click here to enable Cloud Text-to-Speech API in Google Cloud Console &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Voice and Tone Metadata Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 id="player-title" className="text-sm sm:text-base font-bold text-white">
              Generated Voiceover Ready
            </h4>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
              Verified Male Voice
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            Tone: <span className="text-rose-400 font-semibold">{audioData.voiceUsed?.toneName || 'Custom'}</span>
            {' • '}
            Voice ID: <span className="text-zinc-300">{audioData.voiceUsed?.voiceId || 'hi-IN-Neural2-B'}</span>
          </p>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
          Format: <span className="text-zinc-200 font-mono uppercase">{audioData.format || 'MP3'}</span>
        </div>
      </div>

      {/* Playback Controls & Seek Bar */}
      <div className="flex flex-col gap-3">
        {/* Seek Bar & Timers */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            id="audio-seek-slider"
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek audio"
            className="flex-1 h-2 bg-zinc-800 rounded-lg cursor-pointer accent-rose-500"
          />

          <span className="text-xs font-mono text-zinc-400 w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-center gap-4 py-2">
          {/* Skip -5s */}
          <button
            type="button"
            id="btn-skip-backward"
            onClick={() => skipTime(-5)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors cursor-pointer"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Big Play / Pause Button */}
          <button
            type="button"
            id="btn-play-pause"
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause voiceover' : 'Play voiceover'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Skip +5s */}
          <button
            type="button"
            id="btn-skip-forward"
            onClick={() => skipTime(5)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors cursor-pointer"
            title="Forward 5 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Download Options */}
      <div id="download-actions-bar" className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-zinc-400 font-medium">
          Export Voiceover Audio:
        </span>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Download as MP3 */}
          <button
            type="button"
            id="btn-download-mp3"
            onClick={handleDownloadMp3}
            disabled={downloadingFormat === 'mp3'}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs sm:text-sm font-semibold border border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {downloadingFormat === 'mp3' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4 text-rose-400" />
            )}
            <span>Download as MP3</span>
          </button>

          {/* Download as WAV */}
          <button
            type="button"
            id="btn-download-wav"
            onClick={handleDownloadWav}
            disabled={downloadingFormat === 'wav'}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/90 text-rose-100 text-xs sm:text-sm font-semibold border border-rose-700/80 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {downloadingFormat === 'wav' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <FileAudio className="w-4 h-4 text-rose-300" />
            )}
            <span>Download as WAV</span>
          </button>
        </div>
      </div>
    </section>
  );
};
