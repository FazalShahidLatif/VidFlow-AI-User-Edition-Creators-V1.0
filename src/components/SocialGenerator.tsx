import React, { useState } from 'react';
import { Share2, Loader2, Copy, RefreshCw, ArrowRight, CheckCircle2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { SocialCaptions, ProjectData } from '../types';
import { SOCIAL_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

interface SocialGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function SocialGenerator({ project, onUpdate, onNext }: SocialGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<SocialCaptions[]>([]);

  const generateSocialCaptions = async (targetPlatform?: string) => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = targetPlatform 
        ? `Regenerate the ${targetPlatform} caption for a YouTube video titled: ${project.seo?.title || project.selectedIdea.title}. Niche: ${project.niche}. Audience: ${project.targetAudience}. Return ONLY the new caption text.`
        : SOCIAL_PROMPT(
            project.seo?.title || project.selectedIdea.title,
            project.niche || '',
            project.targetAudience || '',
            project.targetLanguage || 'English'
          );
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      
      if (targetPlatform) {
        const newCaptions = { ...project.socialCaptions!, [targetPlatform]: text.trim() };
        onUpdate({ socialCaptions: newCaptions as SocialCaptions });
        toast.success(`${targetPlatform} caption regenerated!`);
      } else {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsedVariations = JSON.parse(cleanedText) as SocialCaptions[];
        setVariations(parsedVariations);
        toast.success('3 Social caption variations generated!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate captions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectVariation = (variation: SocialCaptions) => {
    onUpdate({ socialCaptions: variation });
    toast.success('Social caption variation selected!');
  };

  const updateCaption = (platform: string, value: string) => {
    const newCaptions = { ...project.socialCaptions!, [platform]: value };
    onUpdate({ socialCaptions: newCaptions as SocialCaptions });
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
          <div className="flex gap-4">
            <button 
              onClick={() => generateSocialCaptions()}
              disabled={loading || !project.selectedIdea}
              className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              {variations.length > 0 ? 'Regenerate Variations' : 'Generate 3 Variations'}
            </button>
            {project.socialCaptions && (
              <button 
                onClick={onNext}
                className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95 shadow-lg"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {variations.length > 0 && !project.socialCaptions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variations.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => selectVariation(v)}
              className="bg-[#111111] border border-zinc-800/50 p-6 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full uppercase tracking-widest">Variation {i + 1}</span>
                <Share2 className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-white text-xs line-clamp-4 leading-relaxed italic mb-4">"{v.facebook}"</p>
              <button className="w-full py-3 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                Select This Set
              </button>
            </motion.div>
          ))}
        </div>
      )}

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
                <div className="flex gap-2">
                  <button 
                    onClick={() => generateSocialCaptions(platform.id)}
                    disabled={loading}
                    className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 active:scale-95 disabled:opacity-50"
                    title="Regenerate this caption"
                  >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(project.socialCaptions![platform.id as keyof SocialCaptions] as string)}
                    className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={project.socialCaptions[platform.id as keyof SocialCaptions] as string}
                onChange={(e) => updateCaption(platform.id, e.target.value)}
                className="w-full h-[150px] text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
              />
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
            <div className="pt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => setVariations([])}
                className="px-6 py-2 bg-zinc-900 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-zinc-300 transition-all border border-zinc-800"
              >
                Change Variation
              </button>
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
