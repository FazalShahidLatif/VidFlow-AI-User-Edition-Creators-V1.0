import React, { useState } from 'react';
import { FileText, Loader2, Copy, RefreshCw, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { VideoScript, ScriptMode, ScriptTone, ProjectData } from '../types';
import { SCRIPT_PROMPT } from '../prompts';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ScriptGeneratorProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function ScriptGenerator({ project, onUpdate, onNext }: ScriptGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ScriptMode>('long-form');
  const [tone, setTone] = useState<ScriptTone>('informative');

  const generateScript = async () => {
    if (!project.selectedIdea) return;
    setLoading(true);
    try {
      const prompt = SCRIPT_PROMPT(
        project.selectedIdea.title,
        project.niche || '',
        project.targetAudience || '',
        mode,
        tone
      );
      
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      
      const text = result.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsedScript = JSON.parse(cleanedText);
      onUpdate({ script: parsedScript, currentStep: 2 });
      toast.success('Script generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate script. Please try again.');
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
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Script Mode</label>
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(['long-form', 'short-form'] as ScriptMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                    mode === m ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {m.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Script Tone</label>
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(['informative', 'storytelling', 'viral'] as ScriptTone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                    tone === t ? "bg-orange-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={generateScript}
            disabled={loading || !project.selectedIdea}
            className="px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {project.script ? 'Regenerate Script' : 'Generate Script'}
          </button>
        </div>
      </div>

      {project.script && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50"
        >
          <div className="p-8 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Full Script Studio</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Topic: {project.selectedIdea?.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(project.script, null, 2))}
                className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors text-zinc-300 active:scale-95"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button 
                onClick={onNext}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-8 space-y-10 max-h-[700px] overflow-y-auto custom-scrollbar">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  The Hook (0:00 - 0:15)
                </h4>
                <button onClick={() => copyToClipboard(project.script!.hook)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Hook</button>
              </div>
              <p className="text-white text-lg leading-relaxed bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10 italic">"{project.script.hook}"</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Introduction
                </h4>
                <button onClick={() => copyToClipboard(project.script!.intro)} className="text-[10px] text-zinc-600 hover:text-orange-500 transition-colors">Copy Intro</button>
              </div>
              <p className="text-zinc-300 leading-relaxed text-base">{project.script.intro}</p>
            </section>

            <section className="space-y-8">
              <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Main Content Segments
              </h4>
              <div className="space-y-6">
                {project.script.segments.map((segment, i) => (
                  <div key={i} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/30">
                    <h5 className="text-white font-bold mb-3 flex items-center gap-3">
                      <span className="text-orange-500 font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                      {segment.title}
                    </h5>
                    <p className="text-zinc-400 leading-relaxed text-sm">{segment.content}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Engagement Prompts
                </h4>
                <div className="space-y-2">
                  {project.script.engagementPrompts.map((prompt, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-400 bg-zinc-900/30 p-3 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      {prompt}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Outro & CTA
                </h4>
                <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/30">{project.script.cta}</p>
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
