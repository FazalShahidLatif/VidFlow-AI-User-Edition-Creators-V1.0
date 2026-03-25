import React, { useState } from 'react';
import { Share2, Loader2, Copy, RefreshCw, ArrowRight, CheckCircle2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { SocialCaptions, ProjectData } from '../types';
import { SOCIAL_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface SocialGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function SocialGenerator({ project, onUpdate, onNext }: SocialGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateSocialCaptions = async () => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const prompt = SOCIAL_PROMPT(
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
      const parsedCaptions = JSON.parse(cleanedText);
      onUpdate({ socialCaptions: parsedCaptions, currentStep: 5 });
      toast.success('Social captions generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate captions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'x', name: 'X (Twitter)', icon: Twitter, color: 'text-zinc-300' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-2xl">
              <Share2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Social Caption Generator</h3>
              <p className="text-sm text-zinc-500">Promote your video across all major social platforms.</p>
            </div>
          </div>
          <button 
            onClick={generateSocialCaptions}
            disabled={loading || !project.selectedIdea}
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {project.socialCaptions ? 'Regenerate Captions' : 'Generate Social Captions'}
          </button>
        </div>
      </div>

      {project.socialCaptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {platforms.map((platform, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={platform.id} 
              className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6 shadow-2xl shadow-black/50 group hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 bg-zinc-900 rounded-xl", platform.color)}>
                    <platform.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{platform.name}</h4>
                </div>
                <button 
                  onClick={() => copyToClipboard(project.socialCaptions![platform.id as keyof SocialCaptions] as string)}
                  className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30 min-h-[150px]">
                {project.socialCaptions[platform.id as keyof SocialCaptions] as string}
              </p>
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Recommended Hashtags
              </h4>
              <button onClick={() => copyToClipboard(project.socialCaptions!.hashtags.join(' '))} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy All</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.socialCaptions.hashtags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-zinc-900 border border-zinc-800/50 rounded-xl text-xs text-zinc-400 font-bold uppercase tracking-widest">#{tag}</span>
              ))}
            </div>
            <div className="pt-8 flex justify-center">
              <button 
                onClick={onNext}
                className="px-12 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95"
              >
                Final Review & Export <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
