export type AppState = 'start' | 'camera' | 'processing' | 'readout';

export interface AuraReading {
  auraColorInsight: string;
  futureGlimpse: string;
  angelNumber: number;
  spiritualGuidance: string;
  primaryColors: string[];
}
