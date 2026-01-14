
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles, X, Headphones, Volume2 } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { theme } from '../styles/theme.ts';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const VoiceAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (msg) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
            const ctx = audioContextRef.current!;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            src.connect(ctx.destination);
            src.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(src);
            src.onended = () => sourcesRef.current.delete(src);
          }
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => prev + ' ' + msg.serverContent!.outputTranscription!.text);
          }
        },
        onerror: () => setIsActive(false),
        onclose: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: "You are the BaseTech AI Oracle. You guide users on the Base Layer 2 ecosystem. Be concise, expert, and encouraging. Focus on Base chain specifics like Aerodrome, Clanker, and Coinbase infrastructure.",
        outputAudioTranscription: {},
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="max-w-xl w-full flex flex-col items-center text-center space-y-12">
        <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10">
          <X className="w-8 h-8" />
        </button>

        <div className="relative">
          <div className={`absolute inset-0 bg-[#0052FF]/20 blur-[100px] rounded-full transition-all duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
          <div className={`w-48 h-48 rounded-[4rem] bg-[#0052FF] flex items-center justify-center shadow-[0_0_80px_rgba(0,82,255,0.4)] relative z-10 transition-transform duration-700 ${isActive ? 'scale-110' : ''}`}>
            {isConnecting ? (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            ) : isActive ? (
              <div className="flex items-center gap-1.5 h-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 bg-white rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : (
              <Headphones className="w-16 h-16 text-white" />
            )}
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter">BaseTech <span className="text-[#0052FF]">Oracle</span></h2>
          <p className="text-lg text-white/60 font-medium max-w-sm mx-auto">
            {isActive ? "I'm listening. Ask me about Base trends, swap routes, or deployment strategies." : "Connect to the real-time AI Oracle for live voice guidance through the Base ecosystem."}
          </p>
        </div>

        <div className="w-full h-24 overflow-y-auto px-8 py-4 bg-white/5 rounded-[2rem] border border-white/10 text-sm font-medium text-white/40 italic flex items-center justify-center">
          {transcription || "Transcription will appear here..."}
        </div>

        <div className="flex items-center gap-6 relative z-10">
          {!isActive && !isConnecting ? (
            <button 
              onClick={startSession}
              className="px-10 py-5 bg-[#0052FF] hover:bg-[#0042CC] text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
            >
              <Mic className="w-6 h-6" />
              Initialize Oracle
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] border border-white/20 transition-all flex items-center gap-4"
            >
              <MicOff className="w-6 h-6" />
              Terminate Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
