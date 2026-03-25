import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Settings, 
  ChevronRight, 
  Play, 
  Plus, 
  Users, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Zap,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Map,
  Rocket,
  Target,
  Share2,
  Download,
  ArrowLeft,
  Trash2,
  History,
  Edit2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { ProjectType, ProjectData, VideoIdea, VideoScript, SEOMetadata, ThumbnailPrompt, SocialCaptions } from './types';

// Components
import IdeaGenerator from './components/IdeaGenerator';
import ScriptGenerator from './components/ScriptGenerator';
import SEOGenerator from './components/SEOGenerator';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import SocialGenerator from './components/SocialGenerator';
import ExportModule from './components/ExportModule';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const STORAGE_KEY = 'vidflow_projects_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
  }, []);

  // Save projects to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const createNewProject = () => {
    const newProject: ProjectData = {
      id: Math.random().toString(36).substring(7),
      name: `Project ${projects.length + 1}`,
      niche: '',
      targetAudience: '',
      videoType: 'education',
      currentStep: 0,
      updatedAt: Date.now(),
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setActiveTab('editor');
  };

  const updateProject = (data: Partial<ProjectData>) => {
    setCurrentProject(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data, updatedAt: Date.now() };
      setProjects(prevProjects => prevProjects.map(p => p.id === updated.id ? updated : p));
      return updated;
    });
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      if (currentProject?.id === id) {
        setCurrentProject(null);
        setActiveTab('dashboard');
      }
      toast.success('Project deleted');
    }
  };

  const clearAllProjects = () => {
    if (confirm('Are you sure you want to clear all projects? This cannot be undone.')) {
      setProjects([]);
      localStorage.removeItem('vidflow_projects');
      setCurrentProject(null);
      setActiveTab('dashboard');
      toast.success('Cleared all projects');
    }
  };

  const steps = [
    { id: 'selectedIdea', name: 'Idea Lab', icon: Lightbulb },
    { id: 'script', name: 'Script Studio', icon: FileText },
    { id: 'seo', name: 'SEO Optimizer', icon: Search },
    { id: 'thumbnailPrompt', name: 'Thumbnail Lab', icon: ImageIcon },
    { id: 'socialCaptions', name: 'Social Captions', icon: Share2 },
    { id: 'export', name: 'Final Review', icon: Rocket },
  ];

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', name: 'Content Editor', icon: Play, disabled: !currentProject },
    { id: 'history', name: 'Project History', icon: History },
    { id: 'monetization', name: 'Monetization', icon: DollarSign },
    { id: 'channels', name: 'Channel Settings', icon: Globe },
    { id: 'documentation', name: 'Documentation', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-400 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      <Toaster position="top-right" theme="dark" />
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-[#0F0F0F] border-r border-zinc-800/50 transition-all duration-300 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">VidFlow <span className="text-orange-500">AI</span></span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">User Edition (Creators) V1.0</span>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                activeTab === item.id 
                  ? "bg-orange-500/10 text-orange-500" 
                  : item.disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeTab === item.id ? "text-orange-500" : "text-zinc-500 group-hover:text-white"
              )} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-3">
          <div className={cn(
            "p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/20",
            !isSidebarOpen && "flex justify-center"
          )}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">User Edition V1.0</span>
                </div>
                <p className="text-[10px] text-zinc-500 mb-3">AI-powered YouTube content automation for creators.</p>
                <button 
                  onClick={() => setActiveTab('monetization')}
                  className="w-full py-2 bg-orange-500 text-white text-[10px] font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Upgrade to Pro
                </button>
              </>
            ) : (
              <button 
                onClick={() => setActiveTab('monetization')}
                className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
              >
                <Zap className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        {/* Header */}
        <header className="h-20 border-b border-zinc-800/30 flex items-center justify-between px-8 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
            {activeTab === 'editor' && currentProject ? (
              <div className="flex items-center gap-2 group">
                <input 
                  type="text" 
                  value={currentProject.name}
                  onChange={(e) => updateProject({ name: e.target.value })}
                  className="bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 w-48"
                />
                <Edit2 className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <h1 className="text-sm font-medium text-zinc-500 capitalize">
                {activeTab}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-6">
            {activeTab === 'editor' && currentProject && (
              <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800">
                <div className="flex -space-x-1">
                  {steps.map((step, i) => (
                    <div 
                      key={step.id}
                      className={cn(
                        "w-2 h-2 rounded-full border border-[#0A0A0A]",
                        i <= currentProject.currentStep ? "bg-orange-500" : "bg-zinc-700"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Step {currentProject.currentStep + 1}/6
                </span>
              </div>
            )}
            
            <button 
              onClick={createNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (currentProject?.id || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  projects={projects} 
                  onSelect={(p) => { setCurrentProject(p); setActiveTab('editor'); }}
                  onCreate={createNewProject}
                  onDelete={deleteProject}
                  onClearAll={clearAllProjects}
                />
              )}
              
              {activeTab === 'editor' && currentProject && (
                <div className="space-y-8">
                  {/* Step Progress Bar */}
                  <div className="flex items-center justify-between bg-[#111111] border border-zinc-800/50 p-2 rounded-2xl">
                    {steps.map((step, i) => (
                      <button
                        key={step.id}
                        onClick={() => updateProject({ currentStep: i })}
                        disabled={i > currentProject.currentStep && !projects.find(p => p.id === currentProject.id)?.[step.id as keyof ProjectData]}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                          currentProject.currentStep === i 
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                            : i < currentProject.currentStep 
                              ? "text-orange-500 hover:bg-orange-500/5" 
                              : "text-zinc-600 hover:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        )}
                      >
                        <step.icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{step.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Step Content */}
                  <div className="min-h-[600px]">
                    {currentProject.currentStep === 0 && (
                      <IdeaGenerator 
                        project={currentProject} 
                        onUpdate={updateProject} 
                        onNext={() => updateProject({ currentStep: 1 })} 
                      />
                    )}
                    {currentProject.currentStep === 1 && (
                      <ScriptGenerator 
                        project={currentProject} 
                        onUpdate={updateProject} 
                        onNext={() => updateProject({ currentStep: 2 })} 
                      />
                    )}
                    {currentProject.currentStep === 2 && (
                      <SEOGenerator 
                        project={currentProject} 
                        onUpdate={updateProject} 
                        onNext={() => updateProject({ currentStep: 3 })} 
                      />
                    )}
                    {currentProject.currentStep === 3 && (
                      <ThumbnailGenerator 
                        project={currentProject} 
                        onUpdate={updateProject} 
                        onNext={() => updateProject({ currentStep: 4 })} 
                      />
                    )}
                    {currentProject.currentStep === 4 && (
                      <SocialGenerator 
                        project={currentProject} 
                        onUpdate={updateProject} 
                        onNext={() => updateProject({ currentStep: 5 })} 
                      />
                    )}
                    {currentProject.currentStep === 5 && (
                      <ExportModule 
                        project={currentProject} 
                        onBack={() => updateProject({ currentStep: 4 })} 
                        onReset={() => { setCurrentProject(null); setActiveTab('dashboard'); }} 
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <HistoryView 
                  projects={projects} 
                  onSelect={(p) => { setCurrentProject(p); setActiveTab('editor'); }}
                  onDelete={deleteProject}
                />
              )}

              {activeTab === 'monetization' && <MonetizationView />}
              {activeTab === 'channels' && <ChannelSettingsView />}
              {activeTab === 'documentation' && <DocumentationView />}
            </motion.div>
          </AnimatePresence>

          {/* Global Footer */}
          <footer className="mt-20 pt-8 border-t border-zinc-800/50 text-center pb-12">
            <p className="text-zinc-500 text-sm mb-2">
              © 2026 VidFlow AI. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest">
              <a href="https://saasskul.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-orange-500 transition-colors">
                Powered by SaaS Skul
              </a>
              <span className="text-zinc-800">|</span>
              <a href="mailto:support@saasskul.com" className="text-zinc-400 hover:text-orange-500 transition-colors">
                support@saasskul.com
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function DashboardView({ projects, onSelect, onCreate, onDelete, onClearAll }: { 
  projects: ProjectData[], 
  onSelect: (p: ProjectData) => void,
  onCreate: () => void,
  onDelete: (id: string, e: React.MouseEvent) => void,
  onClearAll: () => void
}) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Creator <span className="text-orange-500">Dashboard</span></h2>
          <p className="text-zinc-500 mt-2">Your YouTube automation command center. Idea to assets in minutes.</p>
        </div>
        <div className="flex gap-4">
          {projects.length > 0 && (
            <button 
              onClick={onClearAll}
              className="flex items-center gap-3 px-6 py-4 bg-zinc-900 text-zinc-400 font-bold rounded-[2rem] border border-zinc-800 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          )}
          <button 
            onClick={onCreate}
            className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white font-bold rounded-[2rem] hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-6 h-6" />
            Start New Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Recent Workflows</h3>
              <button className="text-sm font-bold text-orange-500 hover:text-orange-400">View All</button>
            </div>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => onSelect(project)}
                    className="flex items-center justify-between p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800/30 hover:border-orange-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                        <Play className="w-6 h-6 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white group-hover:text-orange-500 transition-colors">
                          {project.selectedIdea?.title || project.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Step {project.currentStep + 1}/6
                          </span>
                          <div className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => onDelete(project.id, e)}
                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-zinc-700" />
                </div>
                <p className="text-zinc-500 font-medium">No projects yet. Start your first video automation!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-10 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-orange-500/20">
            <Sparkles className="absolute top-6 right-6 w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-3">AI Strategy Lab</h3>
            <p className="text-sm text-white/80 mb-8 leading-relaxed">Let VidFlow analyze your niche and suggest a 30-day content roadmap for explosive growth.</p>
            <button className="w-full py-4 bg-white text-orange-600 font-bold rounded-2xl hover:bg-zinc-100 transition-all shadow-xl active:scale-95">
              Generate Roadmap
            </button>
          </div>

          <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl shadow-black/50">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onCreate} className="p-5 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-orange-500/50 transition-all group text-center active:scale-95">
                <Lightbulb className="w-6 h-6 text-zinc-500 group-hover:text-orange-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase tracking-widest">New Idea</span>
              </button>
              <button onClick={onCreate} className="p-5 bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-orange-500/50 transition-all group text-center active:scale-95">
                <Search className="w-6 h-6 text-zinc-500 group-hover:text-orange-500 mx-auto mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase tracking-widest">SEO Check</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ projects, onSelect, onDelete }: { 
  projects: ProjectData[], 
  onSelect: (p: ProjectData) => void,
  onDelete: (id: string, e: React.MouseEvent) => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Project <span className="text-orange-500">History</span></h2>
        <p className="text-zinc-500 mt-2">Access all your previous content automations and assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={project.id} 
            onClick={() => onSelect(project)}
            className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] group hover:border-orange-500/30 transition-all cursor-pointer relative shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                <FileText className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
              </div>
              <button 
                onClick={(e) => onDelete(project.id, e)}
                className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
              {project.selectedIdea?.title || project.name}
            </h3>
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-500">Progress</span>
                <span className="text-orange-500">{Math.round(((project.currentStep + 1) / 6) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500" 
                  style={{ width: `${((project.currentStep + 1) / 6) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/50">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChannelSettingsView() {
  const [channels, setChannels] = useState([
    { id: 1, name: 'Main Channel', niche: 'Tech & AI', enabled: true },
    { id: 2, name: 'Shorts Channel', niche: 'Entertainment', enabled: false },
    { id: 3, name: 'Vlog Channel', niche: 'Lifestyle', enabled: false },
  ]);

  const toggleChannel = (id: number) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    ));
    toast.success('Channel settings updated');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Channel Settings</h2>
        <p className="text-zinc-400">Manage your YouTube profiles and API usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div 
            key={channel.id}
            className={cn(
              "p-6 rounded-[2rem] border transition-all",
              channel.enabled 
                ? "bg-orange-500/5 border-orange-500/20" 
                : "bg-zinc-900/50 border-zinc-800/50 opacity-60"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                channel.enabled ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-500"
              )}>
                <Globe className="w-5 h-5" />
              </div>
              <button 
                onClick={() => toggleChannel(channel.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                  channel.enabled 
                    ? "bg-orange-500 text-white" 
                    : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                )}
              >
                {channel.enabled ? 'Enabled' : 'Enable'}
              </button>
            </div>
            <h3 className="font-bold text-white mb-1">{channel.name}</h3>
            <p className="text-xs text-zinc-500 mb-4">{channel.niche}</p>
            <div className="space-y-2">
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-1/3" />
              </div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Usage: 32%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[3rem] space-y-8">
        <div className="flex items-center gap-4 mb-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <h3 className="text-2xl font-bold text-white">API & Generation Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Daily Generation Limit</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors">
                <option>10 Generations / day</option>
                <option>25 Generations / day</option>
                <option>Unlimited (Pro)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Model Preference</label>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-orange-500 text-white text-xs font-bold rounded-xl">Gemini 1.5 Flash</button>
                <button className="flex-1 py-3 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl hover:bg-zinc-700">Gemini 1.5 Pro</button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              Usage Statistics
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Ideas Generated', value: '142', total: '500' },
                { label: 'Scripts Written', value: '28', total: '100' },
                { label: 'SEO Packages', value: '45', total: '200' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-zinc-500">{stat.label}</span>
                    <span className="text-white">{stat.value} / {stat.total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${(parseInt(stat.value) / parseInt(stat.total)) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentationView() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="hidden print-only text-center border-b pb-8 mb-8">
        <h1 className="text-3xl font-bold">VidFlow AI – User Edition (Creators) V1.0</h1>
        <p className="text-sm">Official Documentation & User Guide</p>
        <p className="text-xs mt-2">Powered by saasskul.com | support@saasskul.com</p>
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Documentation</h2>
        <p className="text-zinc-400">Everything you need to know about VidFlow AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Quick Start</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>1. Set up your Gemini API Key.</li>
            <li>2. Create a new project from the Dashboard.</li>
            <li>3. Define your niche and target audience.</li>
            <li>4. Follow the 6-step workflow.</li>
          </ul>
        </div>

        <div className="bg-[#111111] border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Troubleshooting</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li>• AI failing? Check your API Key.</li>
            <li>• No ideas? Check niche/audience inputs.</li>
            <li>• Script missing? Select an idea first.</li>
            <li>• UI issues? Refresh your browser.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[3rem] space-y-8">
        <h3 className="text-2xl font-bold text-white">How to Use VidFlow AI</h3>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Idea Lab', desc: 'Generate 10 viral ideas based on your niche. Select one to proceed.' },
            { step: '2', title: 'Script Studio', desc: 'Generate a structured script with custom modes and tones.' },
            { step: '3', title: 'SEO Optimizer', desc: 'Get optimized titles, descriptions, and tags for YouTube.' },
            { step: '4', title: 'Thumbnail Lab', desc: 'Receive a detailed visual prompt for AI image generators.' },
            { step: '5', title: 'Social Captions', desc: 'Get promotional content for all major social platforms.' },
            { step: '6', title: 'Final Review', desc: 'Review and export your entire content package.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-zinc-800/50 p-10 rounded-[3rem] space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-orange-500" />
          Single User License Agreement (SULA)
        </h3>
        <div className="prose prose-invert max-w-none text-sm text-zinc-400 space-y-4">
          <p>This Single User License Agreement ("Agreement") is a legal agreement between you (the "User") and VidFlow AI / SaaS Skul for the use of VidFlow AI User Edition.</p>
          <div className="space-y-2">
            <p className="font-bold text-white">1. Grant of License</p>
            <p>Subject to the terms of this Agreement, VidFlow AI grants you a non-exclusive, non-transferable, limited license to use the Software on a single device for personal or professional content creation.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-white">2. Restrictions</p>
            <p>You may not: (a) modify, translate, or create derivative works of the Software; (b) decompile, reverse engineer, or otherwise attempt to derive the source code; (c) redistribute, encumber, sell, rent, lease, or sublicense the Software.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-white">3. Ownership</p>
            <p>The Software is licensed, not sold. VidFlow AI retains all right, title, and interest in and to the Software, including all intellectual property rights.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-white">4. Termination</p>
            <p>This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice if you fail to comply with any term(s) of this Agreement.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-zinc-500 text-sm mb-6">Need more help? Contact our support team.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => window.print()} 
            className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Save as PDF
          </button>
          <a 
            href="/DOCUMENTATION.txt" 
            download 
            className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Download TXT
          </a>
          <a 
            href="mailto:support@saasskul.com" 
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

function MonetizationView() {
  const plans = [
    {
      name: 'V1 – Basic',
      subtitle: 'Single Language',
      price: '$29',
      period: 'one-time',
      features: [
        'Idea Generator',
        'Script Generator',
        'SEO Generator',
        'Manual Video Workflow',
        'Frontend Architecture'
      ],
      cta: 'Get Basic',
      target: 'Beginner Creators'
    },
    {
      name: 'V2 – Dual',
      subtitle: 'Dual Language',
      price: '$59',
      period: 'one-time',
      features: [
        'English + 1 Language',
        'Multilingual Script Gen',
        'Multilingual SEO Metadata',
        'All V1 Features',
        'Frontend Architecture'
      ],
      cta: 'Get Dual',
      popular: true,
      target: 'International Creators'
    },
    {
      name: 'V3 – Multi',
      subtitle: 'Multi-Language',
      price: '$129',
      period: 'one-time',
      features: [
        '10–50 Languages',
        'Global SEO Tags',
        'Translated Captions',
        'Multilingual Scripts',
        'Frontend Architecture'
      ],
      cta: 'Get Global',
      target: 'Global Creators'
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4">User Edition <span className="text-orange-500">(Creators)</span></h2>
        <p className="text-zinc-400">Targeting beginners and solo creators with a powerful frontend-only architecture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={plan.name} 
            className={cn(
              "relative bg-[#111111] border p-10 rounded-[3rem] flex flex-col shadow-2xl shadow-black/50",
              plan.popular ? "border-orange-500 ring-1 ring-orange-500" : "border-zinc-800/50"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-orange-500/20">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-1">{plan.subtitle}</p>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-bold text-white">{plan.price}</span>
              <span className="text-zinc-500 font-medium text-sm">/{plan.period}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-8 font-medium italic">Good for: {plan.target}</p>
            <ul className="space-y-5 mb-12 flex-1">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center gap-4 text-sm text-zinc-400">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => toast.success(`Redirecting to ${plan.name} checkout...`)}
              className={cn(
                "w-full py-5 rounded-[1.5rem] font-bold transition-all active:scale-95 shadow-xl",
                plan.popular ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20" : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
