import React, { useState } from 'react';
import { ImageIcon, Loader2, Copy, RefreshCw, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { ThumbnailPrompt, ProjectData } from '../types';
import { THUMBNAIL_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ThumbnailGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function ThumbnailGenerator({ project, onUpdate, onNext }: ThumbnailGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateThumbnailPrompt = async () => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const prompt = THUMBNAIL_PROMPT(
        project.seo?.title || project.selectedIdea.title,
        project.niche || '',
        project.targetAudience || ''
      );
      
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedPrompt = JSON.parse(cleanedText);
      onUpdate({ thumbnailPrompt: parsedPrompt, currentStep: 4 });
      toast.success('Thumbnail prompt generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <ImageIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Thumbnail Prompt Lab</h3>
              <p className="text-sm text-zinc-500">Generate high-CTR visual concepts for your video.</p>
            </div>
          </div>
          <button 
            onClick={generateThumbnailPrompt}
            disabled={loading || !project.selectedIdea}
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {project.thumbnailPrompt ? 'Regenerate Prompt' : 'Generate Thumbnail Prompt'}
          </button>
        </div>
      </div>

      {project.thumbnailPrompt && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-8 shadow-2xl shadow-black/50"
          >
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Visual Concept
                </h4>
                <button onClick={() => copyToClipboard(project.thumbnailPrompt!.concept)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Concept</button>
              </div>
              <p className="text-zinc-300 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">{project.thumbnailPrompt.concept}</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Text Overlay Suggestion
                </h4>
                <button onClick={() => copyToClipboard(project.thumbnailPrompt!.textOverlay)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Text</button>
              </div>
              <p className="text-2xl font-black text-white leading-tight bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10 uppercase tracking-tighter italic">"{project.thumbnailPrompt.textOverlay}"</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Visual Style
                </h4>
                <button onClick={() => copyToClipboard(project.thumbnailPrompt!.visualStyle)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Style</button>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">{project.thumbnailPrompt.visualStyle}</p>
            </section>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-8 shadow-2xl shadow-black/50"
          >
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Full AI Generation Prompt
                </h4>
                <button onClick={() => copyToClipboard(project.thumbnailPrompt!.fullPrompt)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Prompt</button>
              </div>
              <div className="relative group">
                <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/30 font-mono min-h-[200px]">{project.thumbnailPrompt.fullPrompt}</p>
                <div className="absolute top-4 right-4 animate-pulse">
                  <Sparkles className="w-5 h-5 text-orange-500/30" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest text-center">Paste this into Midjourney, DALL-E, or Nano Banana</p>
            </section>

            <div className="pt-8">
              <button 
                onClick={onNext}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
