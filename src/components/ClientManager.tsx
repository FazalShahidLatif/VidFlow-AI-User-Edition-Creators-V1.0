import React, { useState } from 'react';
import { Users, Save, Briefcase, Target, Flag } from 'lucide-react';
import { ProjectData, VideoType } from '../types';
import { VIDEO_TYPES } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface ClientManagerProps {
  project: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
  onNext: () => void;
}

export default function ClientManager({ project, onUpdate, onNext }: ClientManagerProps) {
  const [clientName, setClientName] = useState(project.clientName || '');
  const [projectName, setProjectName] = useState(project.name || '');
  const [niche, setNiche] = useState(project.niche || '');
  const [audience, setAudience] = useState(project.targetAudience || '');
  const [goal, setGoal] = useState(project.contentGoal || '');
  const [videoType, setVideoType] = useState<VideoType>(project.videoType || 'education');

  const handleSave = () => {
    onUpdate({
      clientName,
      name: projectName,
      niche,
      targetAudience: audience,
      contentGoal: goal,
      videoType
    });
    toast.success('Client project details saved!');
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[2.5rem] shadow-2xl shadow-black/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Client Setup</h2>
            <p className="text-sm text-zinc-500">Define your client's project parameters for tailored AI generation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Client Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. TechFlow Media"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Flag className="w-3 h-3" /> Project Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Q1 Growth Series"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Target className="w-3 h-3" /> Niche
            </label>
            <input 
              type="text" 
              placeholder="e.g. SaaS Marketing"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Target Audience
            </label>
            <input 
              type="text" 
              placeholder="e.g. Startup Founders"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Content Goal</label>
            <textarea 
              placeholder="What is the primary objective of this content? (e.g. Drive newsletter signups, explain a new feature)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700 min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Video Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VIDEO_TYPES.slice(0, 4).map(type => (
                <button
                  key={type.id}
                  onClick={() => setVideoType(type.id as VideoType)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                    videoType === type.id 
                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  )}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={!clientName || !projectName || !niche || !audience}
          className="w-full mt-10 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/20"
        >
          <Save className="w-5 h-5" />
          Save & Continue to Idea Lab
        </button>
      </div>
    </div>
  );
}
