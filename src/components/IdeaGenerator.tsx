import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { VideoIdea, VideoType, ProjectData } from '../types';
import { IDEA_PROMPT } from '../prompts';
import { cn } from '../lib/utils';
import { LANGUAGES, VIDEO_TYPES } from '../constants';

interface IdeaGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function IdeaGenerator({ project, onUpdate, onNext }: IdeaGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [niche, setNiche] = useState(project.niche || '');
  const [audience, setAudience] = useState(project.targetAudience || '');
  const [videoType, setVideoType] = useState<VideoType>(project.videoType || 'education');
  const [targetLanguage, setTargetLanguage] = useState(project.targetLanguage || 'English');

  const generateIdeas = async () => {
    if (!niche || !audience) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = IDEA_PROMPT(niche, audience, videoType, targetLanguage);
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedIdeas = JSON.parse(cleanedText);
      setIdeas(parsedIdeas);
      onUpdate({ niche, targetAudience: audience, videoType, targetLanguage });
      toast.success(`Generated 10 viral video ideas in ${targetLanguage}!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectIdea = (idea: VideoIdea) => {
    onUpdate({ selectedIdea: idea });
    toast.success(`Selected: ${idea.title}`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Niche</label>
            <input 
              type="text" 
              placeholder="e.g. Personal Finance"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Target Audience</label>
            <input 
              type="text" 
              placeholder="e.g. Gen Z Investors"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Video Type</label>
            <select 
              value={videoType}
              onChange={(e) => setVideoType(e.target.value as VideoType)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
            >
              {VIDEO_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Target Language</label>
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button 
            onClick={generateIdeas}
            disabled={loading || !niche || !audience}
            className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate 10 Viral Ideas
          </button>
          
          {project.selectedIdea && (
            <button 
              onClick={onNext}
              className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className={cn(
              "bg-[#111111] border p-8 rounded-[2.5rem] group hover:border-orange-500/50 transition-all cursor-pointer relative overflow-hidden",
              project.selectedIdea?.title === idea.title ? "border-orange-500 ring-1 ring-orange-500 bg-orange-500/5" : "border-zinc-800/50"
            )}
            onClick={() => selectIdea(idea)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase tracking-widest">
                {idea.suggestedLength}
              </span>
              {project.selectedIdea?.title === idea.title && (
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors leading-tight">
              {idea.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6 line-clamp-3">
              {idea.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Angle: <span className="text-zinc-300">{idea.engagementAngle}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
