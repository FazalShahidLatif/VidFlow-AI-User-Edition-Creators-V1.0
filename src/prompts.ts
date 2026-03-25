export const IDEA_PROMPT = (niche: string, audience: string, videoType: string) => `
Generate 10 viral YouTube video ideas for:
Niche: ${niche}
Target Audience: ${audience}
Video Type: ${videoType}

Return ONLY a JSON array of objects with fields: 
title (under 60 chars), hook, targetAudience, suggestedLength, engagementAngle, description.
`;

export const SCRIPT_PROMPT = (title: string, niche: string, audience: string, mode: string, tone: string) => `
Write a professional YouTube video script for the topic: ${title}. 
Niche: ${niche}
Target Audience: ${audience}
Script Mode: ${mode}
Script Tone: ${tone}

Return ONLY a JSON object with fields: 
hook (vibrant, attention-grabbing), 
intro (engaging, sets the stage), 
segments (array of objects with title and content), 
engagementPrompts (array of strings for viewer interaction), 
cta (strong call to action).
`;

export const SEO_PROMPT = (title: string, niche: string, audience: string) => `
Generate YouTube SEO metadata for a video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}

Return ONLY a JSON object with fields: 
title (STRICTLY under 60 characters, high CTR), 
description (optimized for search, includes keywords naturally), 
tags (array of 15-20 relevant tags), 
hashtags (array of 3-5 relevant hashtags).
`;

export const THUMBNAIL_PROMPT = (title: string, niche: string, audience: string) => `
Generate a high-CTR YouTube thumbnail concept for a video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}

Return ONLY a JSON object with fields: 
concept (detailed visual layout), 
textOverlay (bold, short text for the image), 
visualStyle (vibrant, high contrast, etc.), 
fullPrompt (detailed prompt for AI image generators like Midjourney or DALL-E).
`;

export const SOCIAL_PROMPT = (title: string, niche: string, audience: string) => `
Generate promotional social media captions for a YouTube video titled: ${title}. 
Niche: ${niche}
Target Audience: ${audience}

Return ONLY a JSON object with fields: 
facebook (engaging post for FB), 
instagram (visual-focused post for IG), 
x (short, viral-style post for X), 
linkedin (professional, value-driven post for LinkedIn), 
hashtags (array of 10 relevant hashtags).
`;
