export interface Trend {
  rank: number;
  topic: string;
  tweetVolume: string;
  generatedTweet: string;
  characterCount?: number;
}

export interface StrategyDraft {
  id: number;
  text: string;
  mediaType: string;
  postingTime: string;
  strategy: string;
  reasoning: string;
  category: 'Football' | 'Tech' | 'Pop Culture' | 'Humor';
}

export interface BangersResponse {
  success: boolean;
  timestamp: string;
  trends: Trend[];
}

export interface BangersRequest {
  groqApiKey: string;
}
