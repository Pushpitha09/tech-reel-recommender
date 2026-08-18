export interface ReelItem {
  id: string;
  title: string;
  caption: string;
  transcript: string;
  hashtags: string[];
  category: string;
  duration?: string;
  views?: string;
  likes?: string;
  author: string;
  authorHandle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Deep Dive';
  isHypeOrClickbait?: boolean;
  technicalConcepts: string[];
  thumbnailGradient: string;
}

export interface InterestDomain {
  key: string;
  label: string;
  score: number; // 0 to 100
  growth: number; // e.g. +12
  description: string;
  color: string;
}

export interface RecommendationResult {
  currentReel: {
    id: string;
    title: string;
    category: string;
    contentType: string; // e.g. "Debugging Incident", "Theoretical Explainer", "Surface Buzzword Hype", "Architecture Deep Dive"
    extractedTopic: string;
    underlyingInterest: string;
    hypeScore: number; // 0 to 100 (higher = more clickbait/shallow)
  };
  interestDetected: string;
  why: string;
  recommendedTechReel: {
    id: string;
    title: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Deep Dive';
    duration?: string;
    author: string;
    excerpt: string;
    hashtags: string[];
  };
  category: string;
  whyThisRecommendation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Deep Dive';
  confidence: number; // percentage, e.g. 92
  hypePenaltyApplied: boolean;
  hypePenaltyExplanation?: string;
  updatedInterestProfile: Array<{
    key: string;
    label: string;
    score: number;
    growth: number;
    description: string;
  }>;
  reasoningSteps: string[];
}

export interface SessionHistoryEntry {
  id: string;
  timestamp: number;
  reel: ReelItem;
  result: RecommendationResult;
  isCustomSubmission?: boolean;
}

export interface DemoTrail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  initialReelId: string;
  iconName: string;
  trailReelIds: string[];
}
