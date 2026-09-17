export type VoiceToneId = 
  | 'dark-psychology'
  | 'storytelling'
  | 'motivational'
  | 'documentary'
  | 'deep-attractive';

export interface VoiceTone {
  id: VoiceToneId;
  name: string;
  hindiLabel: string;
  description: string;
  voiceId: 'hi-IN-Neural2-B' | 'hi-IN-Neural2-C' | 'hi-IN-Wavenet-B' | 'hi-IN-Wavenet-C';
  gender: 'MALE';
  basePitch: number;
  baseSpeed: number;
  badge: string;
  moodTag: string;
  samplePhrase: string;
}

export interface SynthesizeRequest {
  script: string;
  toneId: VoiceToneId;
  speed: number;
  pitch: number;
  format?: 'mp3' | 'wav';
}

export interface SynthesizeResponse {
  success: boolean;
  audioContent?: string; // base64 string
  mimeType?: string;
  format?: 'mp3' | 'wav';
  durationSec?: number;
  voiceUsed?: {
    toneId: VoiceToneId;
    toneName: string;
    voiceId: string;
    gender: 'MALE';
  };
  isFallbackDemo?: boolean;
  apiNotice?: string;
  enableApiUrl?: string;
  error?: string;
}
