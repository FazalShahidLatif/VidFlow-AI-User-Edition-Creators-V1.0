import React from 'react';
import { Download, FileText, CheckCircle2, ArrowLeft, Copy, Share2, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ProjectData } from '../types';
import { cn } from '../lib/utils';

interface ExportModuleProps {
  project: ProjectData;
  onBack: () => void;
  onReset: () => void;
}

export default function ExportModule({ project, onBack, onReset }: ExportModuleProps) {
  const generateMarkdown = () => {
    const watermark = `\n\n---\nGenerated with VidFlow AI – User Edition (Creators) V1.0\nhttps://vidflow.ai`;
    let content = `# ${project.seo?.title || project.selectedIdea?.title || 'Untitled Video'}\n\n`;
    
    if (project.selectedIdea) {
      content += `## Video Idea\n- **Title:** ${project.selectedIdea.title}\n- **Hook:** ${project.selectedIdea.hook}\n- **Target Audience:** ${project.selectedIdea.targetAudience}\n- **Suggested Length:** ${project.selectedIdea.suggestedLength}\n- **Engagement Angle:** ${project.selectedIdea.engagementAngle}\n- **Description:** ${project.selectedIdea.description}\n\n`;
    }

    if (project.script) {
      content += `## Video Script\n### Hook\n${project.script.hook}\n\n### Intro\n${project.script.intro}\n\n### Segments\n`;
      project.script.segments.forEach((s, i) => {
        content += `#### ${i + 1}. ${s.title}\n${s.content}\n\n`;
      });
      content += `### Engagement Prompts\n- ${project.script.engagementPrompts.join('\n- ')}\n\n### CTA\n${project.script.cta}\n\n`;
    }

    if (project.seo) {
      content += `## SEO Metadata\n- **Optimized Title:** ${project.seo.title}\n- **Description:** ${project.seo.description}\n- **Tags:** ${project.seo.tags.join(', ')}\n- **Hashtags:** ${project.seo.hashtags.join(' ')}\n\n`;
    }

    if (project.thumbnailPrompt) {
      content += `## Thumbnail Prompt\n- **Concept:** ${project.thumbnailPrompt.concept}\n- **Text Overlay:** ${project.thumbnailPrompt.textOverlay}\n- **Visual Style:** ${project.thumbnailPrompt.visualStyle}\n- **Full Prompt:** ${project.thumbnailPrompt.fullPrompt}\n\n`;
    }

    if (project.socialCaptions) {
      content += `## Social Media Captions\n### Facebook\n${project.socialCaptions.facebook}\n\n### Instagram\n${project.socialCaptions.instagram}\n\n### X (Twitter)\n${project.socialCaptions.x}\n\n### LinkedIn\n${project.socialCaptions.linkedin}\n\n### Social Hashtags\n${project.socialCaptions.hashtags.join(' ')}\n`;
    }

    return content + watermark;
  };

  const downloadFile = (format: 'txt' | 'md') => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vidflow-${project.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded .${format.toUpperCase()} package!`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast.success('Copied full content package!');
  };

  const sections = [
    { id: 'idea', name: 'Video Idea', status: !!project.selectedIdea },
    { id: 'script', name: 'Full Script', status: !!project.script },
    { id: 'seo', name: 'SEO Metadata', status: !!project.seo },
    { id: 'thumbnail', name: 'Thumbnail Prompt', status: !!project.thumbnailPrompt },
    { id: 'social', name: 'Social Captions', status: !!project.socialCaptions },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex p-4 bg-orange-500/10 rounded-full mb-6">
          <Rocket className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Your Content Package is <span className="text-orange-500">Ready</span></h2>
        <p className="text-zinc-400">Review your generated assets and export them for publishing. Your YouTube automation starts here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={section.id} 
            className={cn(
              "bg-[#111111] border p-8 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl shadow-black/50",
              section.status ? "border-orange-500/30" : "border-zinc-800/50 opacity-50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
              section.status ? "bg-orange-500/20 text-orange-500" : "bg-zinc-900 text-zinc-700"
            )}>
              {section.status ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{section.name}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
              {section.status ? 'Completed' : 'Missing'}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">Export Content Package</h3>
          <p className="text-zinc-500">Download all assets in a single Markdown or TXT file, ready for your production workflow.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={copyToClipboard}
            className="px-6 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <Copy className="w-5 h-5" />
            Copy All
          </button>
          <button 
            onClick={() => downloadFile('md')}
            className="px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <Download className="w-5 h-5" />
            Download .MD
          </button>
          <button 
            onClick={() => downloadFile('txt')}
            className="px-6 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95"
          >
            <FileText className="w-5 h-5" />
            Download .TXT
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <button 
          onClick={onBack}
          className="px-8 py-3 text-zinc-500 font-bold hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </button>
        <button 
          onClick={onReset}
          className="px-8 py-3 text-orange-500 font-bold hover:text-orange-400 transition-colors flex items-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          Start New Project
        </button>
      </div>
    </div>
  );
}
