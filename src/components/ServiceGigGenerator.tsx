import React, { useState } from 'react';
import { DollarSign, Loader2, Sparkles, Copy, Zap, ShoppingBag, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { toast } from 'sonner';
import { ProjectData, ServiceGig } from '../types';
import { GIG_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

interface ServiceGigGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

export default function ServiceGigGenerator({ project, onUpdate }: ServiceGigGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const generateGigs = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = GIG_PROMPT(project);
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                pricing: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['platform', 'title', 'description', 'pricing', 'tags'],
            }
          }
        }
      });
      
      const gigs = JSON.parse(result.text) as ServiceGig[];
      onUpdate({ serviceGigs: gigs });
      toast.success('Service gig descriptions generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate gig descriptions.');
    } finally {
      setLoading(false);
    }
  };

  const copyGig = (gig: ServiceGig) => {
    const text = `Platform: ${gig.platform}\nTitle: ${gig.title}\n\nDescription:\n${gig.description}\n\nPricing: ${gig.pricing}\n\nTags: ${gig.tags.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success(`${gig.platform} gig description copied!`);
  };

  const downloadGig = (gig: ServiceGig) => {
    const text = `Platform: ${gig.platform}\nTitle: ${gig.title}\n\nDescription:\n${gig.description}\n\nPricing: ${gig.pricing}\n\nTags: ${gig.tags.join(', ')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gig.platform.toLowerCase()}-gig-${project.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${gig.platform} gig description!`);
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex p-4 bg-orange-500/10 rounded-full mb-2">
          <ShoppingBag className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Service Package Generator</h2>
        <p className="text-zinc-500 text-lg">Turn your AI-powered workflow into a profitable freelance business. Generate ready-to-sell gig descriptions for top platforms.</p>
        
        <button 
          onClick={generateGigs}
          disabled={loading}
          className="mt-6 px-10 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20 mx-auto"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          Generate My Seller Profiles
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {project.serviceGigs?.map((gig, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-[#111111] border border-zinc-800/50 rounded-[2.5rem] p-10 flex flex-col shadow-2xl shadow-black/50 relative group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                gig.platform === 'Fiverr' ? "bg-[#1dbf73]/10 text-[#1dbf73]" : "bg-[#14a800]/10 text-[#14a800]"
              )}>
                {gig.platform} Seller Profile
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadGig(gig)}
                  className="p-3 bg-zinc-900 text-zinc-500 rounded-xl hover:text-white transition-all border border-zinc-800"
                  title="Download as TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => copyGig(gig)}
                  className="p-3 bg-zinc-900 text-zinc-500 rounded-xl hover:text-white transition-all border border-zinc-800"
                  title="Copy to Clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 leading-tight group-hover:text-orange-500 transition-colors">{gig.title}</h3>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Gig Description</span>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{gig.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Recommended Price</span>
                  <div className="text-xl font-bold text-white">{gig.pricing}</div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Search Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {gig.tags.map((tag, j) => (
                      <span key={j} className="text-[9px] font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!project.serviceGigs && !loading && (
        <div className="bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem] p-12 text-center max-w-2xl mx-auto">
          <DollarSign className="w-12 h-12 text-orange-500 mx-auto mb-6" />
          <h4 className="text-xl font-bold text-white mb-3">Ready to start your agency?</h4>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Use the "Generate My Seller Profiles" button above to create high-converting descriptions for your freelance services based on your current project niche.
          </p>
        </div>
      )}
    </div>
  );
}
