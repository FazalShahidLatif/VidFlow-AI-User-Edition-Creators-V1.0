import React, { useState } from 'react';
import { ImageIcon, Loader2, Copy, RefreshCw, ArrowRight, CheckCircle2, Sparkles, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { ThumbnailPrompt, ProjectData } from '../types';
import { THUMBNAIL_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

interface ThumbnailGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function ThumbnailGenerator({ project, onUpdate, onNext }: ThumbnailGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<ThumbnailPrompt[]>([]);

  const generateThumbnailPrompt = async () => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = THUMBNAIL_PROMPT(
        project.seo?.title || project.selectedIdea.title,
        project.niche || '',
        project.targetAudience || ''
      );
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedVariations = JSON.parse(cleanedText) as ThumbnailPrompt[];
      setVariations(parsedVariations);
      toast.success('3 Thumbnail concept variations generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate thumbnail concepts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectVariation = async (variation: ThumbnailPrompt) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      // Now generate the actual image for the selected variation
      toast.info('Generating thumbnail image for selected concept...');
      const imageResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `High-quality YouTube thumbnail for: ${variation.fullPrompt}. Vibrant colors, high contrast, professional design.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      let imageUrl = '';
      for (const part of imageResult.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      onUpdate({ 
        thumbnailPrompt: variation, 
        thumbnailUrl: imageUrl
      });
      toast.success('Thumbnail concept selected and image generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate thumbnail image.');
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
            {variations.length > 0 ? 'Regenerate Variations' : 'Generate 3 Variations'}
          </button>
        </div>
      </div>

      {variations.length > 0 && !project.thumbnailPrompt && (
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
                <ImageIcon className="w-4 h-4 text-zinc-600 group-hover:text-orange-500 transition-colors" />
              </div>
              <h4 className="text-white font-bold mb-2 line-clamp-1 italic">"{v.textOverlay}"</h4>
              <p className="text-zinc-500 text-[10px] line-clamp-3 leading-relaxed">{v.concept}</p>
              <button className="w-full mt-6 py-3 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Select & Generate Image'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

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
                  Generated Thumbnail Preview
                </h4>
              </div>
              {project.thumbnailUrl ? (
                <div className="relative group overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl">
                  <img 
                    src={project.thumbnailUrl} 
                    alt="Generated Thumbnail" 
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button 
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = project.thumbnailUrl!;
                        a.download = 'thumbnail.png';
                        a.click();
                      }}
                      className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-8 h-8 text-zinc-700" />
                  <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Image Preview Unavailable</p>
                </div>
              )}
            </section>

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

            <div className="pt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => setVariations([])}
                className="px-6 py-2 bg-zinc-900 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-zinc-300 transition-all border border-zinc-800"
              >
                Change Variation
              </button>
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
