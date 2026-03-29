import React from 'react';
import { Target, Zap, Play, Image as ImageIcon, Video, Share2, ArrowRight, Sparkles, CheckCircle2, Rocket, Clock, CameraOff, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function BlueprintsView({ onCreateFromBlueprint }: { onCreateFromBlueprint: (blueprint: any) => void }) {
  const blueprints = [
    {
      id: 'cinematic-product-ad',
      title: 'Cinematic Product Ads (30s)',
      description: 'Turn any basic product photo into a luxury cinematic advertisement using AI transformation.',
      difficulty: 'Easy',
      time: '30-35s',
      potential: 'High ($50-$150 per video)',
      hook: 'This $0 AI trick turns boring product photos into cinematic ads...',
      structure: 'Before → Transformation → Cinematic Result',
      scenes: [
        {
          title: 'Scene 1: The Hook',
          duration: '2-3s',
          visual: 'Ugly / basic product image (messy desk, bad lighting)',
          text: 'BORING PRODUCT PHOTO?',
          icon: CameraOff
        },
        {
          title: 'Scene 2: Transformation Setup',
          duration: '3-4s',
          visual: 'Show image being "uploaded" (screen style OR simulated)',
          text: 'ADD THIS PROMPT 👇',
          icon: Rocket
        },
        {
          title: 'Scene 3: AI Generation',
          duration: 'Prompt Copy',
          visual: 'Luxury product photography of a [product], placed on a white marble table, soft cinematic lighting, realistic reflections, premium commercial look, depth of field, 4k, high detail, studio quality',
          text: 'Clean, Premium, Instagram-ad level',
          icon: Sparkles,
          isPrompt: true
        },
        {
          title: 'Scene 4: Cinematic Motion',
          duration: '3-5s',
          visual: 'Slow cinematic camera orbit around product, soft lighting reflections, depth of field, smooth motion, high-end commercial style',
          text: 'ADD CINEMATIC MOTION',
          icon: Video
        },
        {
          title: 'Scene 5: Final Result',
          duration: '4-6s',
          visual: 'Final animated clip (this is your WOW moment)',
          text: '$0 → CINEMATIC AD',
          icon: Play
        },
        {
          title: 'Scene 6: CTA',
          duration: '3-4s',
          visual: 'Loop best shot OR zoom in',
          text: 'COMMENT "AI"',
          icon: MessageSquare
        }
      ],
      editing: [
        'Aspect ratio: 9:16',
        'Bold, fast popping captions',
        'Highlight words: "$0", "CINEMATIC", "AI"',
        'Quick cuts every 2-3 sec',
        'Subtle whoosh transitions'
      ],
      audio: 'Cinematic / tech / ambient build-up. Voice tone: fast, confident, slightly intense.'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-2xl">
            <Target className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Success Blueprints</h1>
            <p className="text-zinc-500 font-medium">Proven video concepts to create and sell in minutes.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {blueprints.map((blueprint) => (
          <motion.div 
            key={blueprint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-zinc-800/50 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="p-10 border-b border-zinc-800/50 bg-gradient-to-br from-orange-500/10 to-transparent">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Featured Blueprint</span>
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-full">{blueprint.difficulty}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{blueprint.title}</h2>
                  <p className="text-zinc-400 max-w-2xl">{blueprint.description}</p>
                </div>
                <div className="bg-zinc-900/80 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-800/50 space-y-2 min-w-[240px]">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest">Potential</span>
                    <span className="text-orange-500 font-black">{blueprint.potential}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-widest">Est. Time</span>
                    <span className="text-white font-black">{blueprint.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <section className="space-y-6">
                  <h3 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Scene-by-Scene Execution
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blueprint.scenes.map((scene, idx) => (
                      <div key={idx} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-3xl space-y-4 hover:border-orange-500/30 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-800 rounded-xl group-hover:bg-orange-500/10 transition-colors">
                              <scene.icon className="w-4 h-4 text-zinc-400 group-hover:text-orange-500" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{scene.title}</span>
                          </div>
                          <span className="text-[10px] font-black text-orange-500/50 uppercase tracking-widest">{scene.duration}</span>
                        </div>
                        <div className="space-y-2">
                          <p className={cn(
                            "text-sm leading-relaxed",
                            scene.isPrompt ? "font-mono text-zinc-400 bg-black/40 p-4 rounded-xl border border-zinc-800/50 italic" : "text-zinc-300"
                          )}>
                            {scene.visual}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Overlay:</span>
                            <span className="text-xs font-black text-white italic uppercase tracking-tighter">"{scene.text}"</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Editing Strategy
                  </h3>
                  <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2rem] space-y-4">
                    {blueprint.editing.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-zinc-400 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-orange-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Audio & Voice
                  </h3>
                  <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2rem]">
                    <p className="text-sm text-zinc-400 leading-relaxed italic">
                      "{blueprint.audio}"
                    </p>
                  </div>
                </section>

                <div className="pt-6">
                  <div className="bg-orange-500 p-8 rounded-[2rem] space-y-4 shadow-xl shadow-orange-500/20">
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">Ready to Sell?</h4>
                    <p className="text-orange-100 text-sm leading-relaxed">This concept is currently trending on TikTok and Reels. Freelancers are charging $100+ for these cinematic transformations.</p>
                    <button 
                      onClick={() => onCreateFromBlueprint(blueprint)}
                      className="w-full py-4 bg-white text-black font-black uppercase italic tracking-widest text-xs rounded-xl hover:bg-zinc-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Start Project <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
