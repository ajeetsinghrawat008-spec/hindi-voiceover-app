import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptInput } from './components/ScriptInput';
import { ToneSelector } from './components/ToneSelector';
import { AudioControls } from './components/AudioControls';
import { AudioPlayer } from './components/AudioPlayer';
import { VoiceVerificationBadge } from './components/VoiceVerificationBadge';
import { VOICE_TONES, DEFAULT_SCRIPT } from './data/tones';
import { VoiceToneId, SynthesizeResponse } from './types';
import { Wand2, Loader2, PlayCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [selectedToneId, setSelectedToneId] = useState<VoiceToneId>('deep-attractive');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<SynthesizeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load a test sample on initial mount so player is immediately functional
  useEffect(() => {
    fetch('/api/test-sample')
      .then((res) => res.json())
      .then((data: SynthesizeResponse) => {
        if (data.success && data.audioContent) {
          setGeneratedAudio(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load initial test sample:', err);
      });
  }, []);

  const handleResetControls = () => {
    setSpeed(1.0);
    setPitch(0);
  };

  const handleGenerateVoiceover = async () => {
    if (!script.trim()) {
      setErrorMessage('कृपया वॉइसओवर के लिए स्क्रिप्ट दर्ज करें (Please enter a script).');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script.trim(),
          toneId: selectedToneId,
          speed,
          pitch,
          format: 'mp3',
        }),
      });

      const data: SynthesizeResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Voice synthesis request failed');
      }

      setGeneratedAudio(data);

      // Smooth scroll to player on mobile
      const playerEl = document.getElementById('audio-player-section');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err?.message || 'वॉइसओवर जनरेट करने में विफलता हुई (Failed to generate voiceover).');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper for downloading WAV if originally generated as MP3
  const handleFetchWavData = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: script.trim() || DEFAULT_SCRIPT,
          toneId: selectedToneId,
          speed,
          pitch,
          format: 'wav',
        }),
      });

      const data: SynthesizeResponse = await response.json();
      return data.audioContent || null;
    } catch (err) {
      console.error('Error retrieving WAV format:', err);
      return null;
    }
  };

  const handleLoadTestSample = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/test-sample');
      const data: SynthesizeResponse = await res.json();
      if (data.success && data.audioContent) {
        setGeneratedAudio(data);
      }
    } catch (err: any) {
      console.error('Error fetching test sample:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
        {/* Error Alert */}
        {errorMessage && (
          <div id="app-error-banner" className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">त्रुटि (Error):</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* 1. Script Box on top */}
        <ScriptInput
          script={script}
          onChange={setScript}
          speed={speed}
          onSelectSample={(sample) => setScript(sample)}
        />

        {/* 2. Voice Tone Selection below */}
        <ToneSelector
          tones={VOICE_TONES}
          selectedToneId={selectedToneId}
          onSelectTone={(id) => setSelectedToneId(id)}
          onLoadToneSample={(phrase) => setScript(phrase)}
        />

        {/* 3. Basic Controls: Speed & Pitch */}
        <AudioControls
          speed={speed}
          pitch={pitch}
          onSpeedChange={setSpeed}
          onPitchChange={setPitch}
          onReset={handleResetControls}
        />

        {/* 4. Generate Voiceover Button */}
        <div id="generate-action-container" className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-generate-voiceover"
            onClick={handleGenerateVoiceover}
            disabled={isGenerating || !script.trim()}
            className="w-full sm:flex-1 py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>वॉइसओवर जनरेट हो रहा है (Generating Voiceover)...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Voiceover (पुरुष आवाज)</span>
              </>
            )}
          </button>

          {/* Quick Male Voice Test Sample Action */}
          <button
            type="button"
            id="btn-quick-sample"
            onClick={handleLoadTestSample}
            disabled={isGenerating}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="Load and verify verified Hindi male voice sample"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>Test Male Voice Sample</span>
          </button>
        </div>

        {/* 5. Built-in Audio Player & 6. Download Options */}
        {generatedAudio && (
          <AudioPlayer
            audioData={generatedAudio}
            onDownloadWavNeeded={handleFetchWavData}
          />
        )}

        {/* Male Voice Tone Mapping Verification Box */}
        <VoiceVerificationBadge />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-400">
        <p>
          Hindi AI Voiceover Generator &bull; Powered by Google Cloud Text-to-Speech &bull; hi-IN Male Voices Only
        </p>
      </footer>
    </div>
  );
}
