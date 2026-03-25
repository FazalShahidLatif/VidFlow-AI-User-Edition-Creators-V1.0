import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { VideoIdea, VideoType, ProjectData } from '../types';
import { IDEA_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

  const generateIdeas = async () => {
    if (!niche || !audience) return;
    setLoading(true);
    try {
      const prompt = IDEA_PROMPT(niche, audience, videoType);
      
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedIdeas = JSON.parse(cleanedText);
      setIdeas(parsedIdeas);
      onUpdate({ niche, targetAudience: audience, videoType });
      toast.success('Generated 10 viral video ideas!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectIdea = (idea: VideoIdea) => {
    onUpdate({ selectedIdea: idea, currentStep: 1 });
    toast.success(`Selected: ${idea.title}`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <option value="education">Education</option>
              <option value="storytelling">Storytelling</option>
              <option value="tutorial">Tutorial</option>
              <option value="listicle">Listicle</option>
              <option value="news">News & Politics</option>
              <option value="gaming">Gaming</option>
              <option value="vlog">Vlog / Personal</option>
              <option value="review">Product Review</option>
              <option value="comedy">Comedy / Entertainment</option>
              <option value="tech">Science & Tech</option>
              <option value="travel">Travel & Events</option>
              <option value="fitness">Health & Fitness</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="documentary">Documentary</option>
              <option value="commentary">Commentary</option>
            </select>
          </div>
        </div>
        <button 
          onClick={generateIdeas}
          disabled={loading || !niche || !audience}
          className="w-full mt-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generate 10 Viral Ideas
        </button>
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
