import React, { useState } from 'react';
import { Play, Loader2, Sparkles, RefreshCw, Copy, CheckCircle2, Layout, Video, Type as TypeIcon, Mic2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from 'sonner';
import { ProjectData, VideoBreakdown, VideoScene } from '../types';
import { VIDEO_BREAKDOWN_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

interface VideoBuilderProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function VideoBuilder({ project, onUpdate, onNext }: VideoBuilderProps) {
  const [loading, setLoading] = useState(false);

  const generateBreakdown = async () => {
    if (!project.script) {
      toast.error('Please generate a script first.');
      return;
    }
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = VIDEO_BREAKDOWN_PROMPT(project);
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sceneNumber: { type: Type.NUMBER },
                    voiceover: { type: Type.STRING },
                    visual: { type: Type.STRING },
                    textOverlay: { type: Type.STRING },
                  },
                  required: ['sceneNumber', 'voiceover', 'visual', 'textOverlay'],
                }
              },
              voiceoverFormatting: { type: Type.STRING },
              visualDirection: { type: Type.STRING },
              subtitleText: { type: Type.STRING },
            },
            required: ['scenes', 'voiceoverFormatting', 'visualDirection', 'subtitleText'],
          }
        }
      });
      
      const breakdown = JSON.parse(result.text) as VideoBreakdown;
      onUpdate({ videoBreakdown: breakdown });
      toast.success('Video breakdown generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate video breakdown.');
    } finally {
      setLoading(false);
    }
  };

  const copyBreakdown = () => {
    if (!project.videoBreakdown) return;
    const text = project.videoBreakdown.scenes.map(s => 
      `Scene ${s.sceneNumber}:\nVoiceover: ${s.voiceover}\nVisual: ${s.visual}\nText: ${s.textOverlay}\n`
    ).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Breakdown copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Video Builder 🎬</h2>
              <p className="text-sm text-zinc-500">Transform your script into a professional scene-by-scene production plan.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {project.videoBreakdown && (
              <button 
                onClick={copyBreakdown}
                className="p-4 bg-zinc-900 text-zinc-400 rounded-2xl hover:text-white transition-all border border-zinc-800"
              >
                <Copy className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={generateBreakdown}
              disabled={loading || !project.script}
              className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {project.videoBreakdown ? 'Regenerate Breakdown' : 'Generate Full Breakdown'}
            </button>
          </div>
        </div>
      </div>

      {project.videoBreakdown && (
        <div className="grid grid-cols-1 gap-6">
          {project.videoBreakdown.scenes.map((scene, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-[#111111] border border-zinc-800/50 rounded-[2.5rem] overflow-hidden group hover:border-orange-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-20 bg-zinc-900/50 border-r border-zinc-800/50 flex items-center justify-center p-4">
                  <span className="text-2xl font-black text-zinc-700 group-hover:text-orange-500 transition-colors">#{scene.sceneNumber}</span>
                </div>
                <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Mic2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Voiceover</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{scene.voiceover}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <Layout className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Visual Direction</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed italic">"{scene.visual}"</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500">
                      <TypeIcon className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Text Overlay</span>
                    </div>
                    <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 flex items-center justify-center min-h-[60px]">
                      <span className="text-white font-bold text-center uppercase tracking-tighter text-xs">{scene.textOverlay || 'No Text'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {project.videoBreakdown && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={onNext}
            className="px-12 py-5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
          >
            Continue to Thumbnail Lab
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
