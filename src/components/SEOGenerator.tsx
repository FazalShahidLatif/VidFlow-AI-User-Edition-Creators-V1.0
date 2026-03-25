import React, { useState } from 'react';
import { Search, Loader2, Copy, RefreshCw, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { SEOMetadata, ProjectData } from '../types';
import { SEO_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface SEOGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function SEOGenerator({ project, onUpdate, onNext }: SEOGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateSEO = async () => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const prompt = SEO_PROMPT(
        project.selectedIdea.title,
        project.niche || '',
        project.targetAudience || ''
      );
      
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedSEO = JSON.parse(cleanedText);
      onUpdate({ seo: parsedSEO, currentStep: 3 });
      toast.success('SEO metadata optimized!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to optimize SEO. Please try again.');
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
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">SEO Optimizer</h3>
              <p className="text-sm text-zinc-500">Maximize your search visibility and CTR.</p>
            </div>
          </div>
          <button 
            onClick={generateSEO}
            disabled={loading || !project.selectedIdea}
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {project.seo ? 'Regenerate SEO' : 'Generate SEO Metadata'}
          </button>
        </div>
      </div>

      {project.seo && (
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
                  Optimized Title
                </h4>
                <button onClick={() => copyToClipboard(project.seo!.title)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Title</button>
              </div>
              <p className="text-xl font-bold text-white leading-tight bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">{project.seo.title}</p>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {project.seo.title.length}/60 Characters
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Video Description
                </h4>
                <button onClick={() => copyToClipboard(project.seo!.description)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Description</button>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30 max-h-[300px] overflow-y-auto custom-scrollbar">{project.seo.description}</p>
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
                  High-Volume Tags
                </h4>
                <button onClick={() => copyToClipboard(project.seo!.tags.join(', '))} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Tags</button>
              </div>
              <div className="flex flex-wrap gap-2 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">
                {project.seo.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-800 border border-zinc-800/50 rounded-lg text-xs text-zinc-400 font-medium">#{tag}</span>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Hashtags
                </h4>
                <button onClick={() => copyToClipboard(project.seo!.hashtags.join(' '))} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Hashtags</button>
              </div>
              <div className="flex flex-wrap gap-3 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">
                {project.seo.hashtags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-500 font-bold uppercase tracking-widest">{tag}</span>
                ))}
              </div>
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
