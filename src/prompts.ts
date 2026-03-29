export const IDEA_PROMPT = (niche: string, audience: string, videoType: string, language: string = 'English') => `
Generate 10 viral YouTube video ideas for:
Niche: ${niche}
Target Audience: ${audience}
Video Type: ${videoType}
Target Language: ${language}

Return ONLY a JSON array of objects with fields: 
title (under 60 chars), hook, targetAudience, suggestedLength, engagementAngle, description.
All text MUST be in ${language}.
`;

export const SCRIPT_PROMPT = (title: string, niche: string, audience: string, mode: string, tone: string, language: string = 'English') => `
Write 3 professional YouTube video script variations for the topic: ${title}. 
Niche: ${niche}
Target Audience: ${audience}
Script Mode: ${mode}
Script Tone: ${tone}
Target Language: ${language}

Return ONLY a JSON array of 3 objects, each with fields: 
hook (vibrant, attention-grabbing), 
intro (engaging, sets the stage), 
segments (array of objects with title and content), 
engagementPrompts (array of strings for viewer interaction), 
cta (strong call to action).
All text MUST be in ${language}.
`;

export const SEO_PROMPT = (title: string, niche: string, audience: string, language: string = 'English') => `
Generate YouTube SEO metadata for a video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}
Target Language: ${language}

Return ONLY a JSON object with fields: 
title (STRICTLY under 60 characters, high CTR), 
description (optimized for search, includes keywords naturally), 
tags (array of 15-20 relevant tags), 
hashtags (array of 3-5 relevant hashtags).
All text MUST be in ${language}.
`;

export const THUMBNAIL_PROMPT = (title: string, niche: string, audience: string) => `
Generate 3 high-CTR YouTube thumbnail concept variations for a video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}

Return ONLY a JSON array of 3 objects, each with fields: 
concept (detailed visual layout), 
textOverlay (bold, short text for the image), 
visualStyle (vibrant, high contrast, etc.), 
fullPrompt (detailed prompt for AI image generators like Midjourney or DALL-E).
`;

export const SOCIAL_PROMPT = (title: string, niche: string, audience: string, language: string = 'English') => `
Generate 3 sets of promotional social media caption variations for a YouTube video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}
Target Language: ${language}

Return ONLY a JSON array of 3 objects, each with fields: 
facebook (engaging post for FB), 
instagram (visual-focused post for IG), 
x (short, viral-style post for X), 
linkedin (professional, value-driven post for LinkedIn), 
hashtags (array of 10 relevant hashtags).
All text MUST be in ${language}.
`;

export const VIDEO_BREAKDOWN_PROMPT = (project: any) => `
Create a professional scene-by-scene video breakdown for a YouTube video.
Project: ${project.name}
Client: ${project.clientName || 'N/A'}
Niche: ${project.niche}
Audience: ${project.targetAudience}
Goal: ${project.contentGoal || 'Viral Engagement'}
Script: ${JSON.stringify(project.script)}

Return ONLY a JSON object with:
scenes: array of objects { sceneNumber, voiceover, visual, textOverlay }
voiceoverFormatting: string (instructions for voice actors/AI)
visualDirection: string (overall aesthetic)
subtitleText: string (clean subtitle version)

Scene-by-scene breakdown should be detailed. 
Visuals should be descriptive (e.g., "Futuristic AI robot + office workers disappearing").
Text overlay should be bold and short (e.g., "AI is Taking Over").
`;

export const GIG_PROMPT = (project: any) => `
Generate high-converting freelance service gig descriptions for Fiverr and Upwork.
The freelancer is selling YouTube Automation services in the niche: "${project.niche}".
The service is powered by advanced AI workflows (VidFlow V3).

Return ONLY a JSON array of 2 objects (one for Fiverr, one for Upwork) with:
platform: "Fiverr" or "Upwork"
title: Catchy, SEO-optimized title
description: Persuasive, professional description highlighting AI automation, speed, and quality.
pricing: Suggested pricing tier (e.g., $150 - $450)
tags: Array of 5 relevant search tags.

Focus on the "Faceless YouTube Channel Automation" and "Viral Content Creation" angles.
`;

export const TRANSLATE_PROMPT = (text: string, targetLanguage: string) => `
Translate the following text to ${targetLanguage}. 
Maintain the original tone, structure, and formatting. 
If it's a JSON object, translate ONLY the values, NOT the keys.
Return ONLY the translated text.

Text:
${text}
`;
