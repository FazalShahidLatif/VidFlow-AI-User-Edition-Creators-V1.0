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

export interface ProjectData {
  id: string;
  name: string;
  niche: string;
  targetAudience: string;
  videoType: VideoType;
  selectedIdea?: VideoIdea;
  script?: VideoScript;
  seo?: SEOMetadata;
  thumbnailPrompt?: ThumbnailPrompt;
  socialCaptions?: SocialCaptions;
  currentStep: number;
  updatedAt: number;
}
