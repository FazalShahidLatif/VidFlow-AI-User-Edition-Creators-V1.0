export type ProjectType = 'marketplace' | 'saas' | 'agency';

export type VideoType = 
  | 'education' 
  | 'storytelling' 
  | 'tutorial' 
  | 'listicle' 
  | 'news' 
  | 'gaming' 
  | 'vlog' 
  | 'review' 
  | 'comedy' 
  | 'tech' 
  | 'travel' 
  | 'fitness' 
  | 'music' 
  | 'sports' 
  | 'documentary' 
  | 'commentary';
export type ScriptMode = 'long-form' | 'short-form';
export type ScriptTone = 'informative' | 'storytelling' | 'viral';

export interface VideoIdea {
  title: string;
  hook: string;
  targetAudience: string;
  suggestedLength: string;
  engagementAngle: string;
  description: string;
}

export interface VideoScript {
  hook: string;
  intro: string;
  segments: { title: string; content: string }[];
  engagementPrompts: string[];
  cta: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
}

export interface ThumbnailPrompt {
  concept: string;
  textOverlay: string;
  visualStyle: string;
  fullPrompt: string;
}

export interface SocialCaptions {
  facebook: string;
  instagram: string;
  x: string;
  linkedin: string;
  hashtags: string[];
}

export interface VideoScene {
  sceneNumber: number;
  voiceover: string;
  visual: string;
  textOverlay: string;
}

export interface VideoBreakdown {
  scenes: VideoScene[];
  voiceoverFormatting: string;
  visualDirection: string;
  subtitleText: string;
}

export interface ServiceGig {
  platform: 'Fiverr' | 'Upwork';
  title: string;
  description: string;
  pricing: string;
  tags: string[];
}

export interface ProjectData {
  id: string;
  name: string;
  clientName?: string;
  niche: string;
  targetAudience: string;
  contentGoal?: string;
  videoType: VideoType;
  targetLanguage: string;
  selectedIdea?: VideoIdea;
  script?: VideoScript;
  videoBreakdown?: VideoBreakdown;
  seo?: SEOMetadata;
  seoTranslations?: { [language: string]: SEOMetadata };
  thumbnailPrompt?: ThumbnailPrompt;
  thumbnailUrl?: string;
  socialCaptions?: SocialCaptions;
  serviceGigs?: ServiceGig[];
  translations?: { [language: string]: VideoScript };
  currentStep: number;
  updatedAt: number;
}

export interface RoadmapItem {
  day: number;
  topic: string;
  type: string;
  strategy: string;
}

export interface RoadmapData {
  niche: string;
  audience: string;
  items: RoadmapItem[];
}
