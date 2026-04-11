export interface Trend {
  rank: number;
  topic: string;
  tweetVolume: string;
  generatedTweet: string;
  characterCount?: number;
}

export interface BangersResponse {
  success: boolean;
  timestamp: string;
  trends: Trend[];
}

export interface BangersRequest {
  groqApiKey: string;
}
