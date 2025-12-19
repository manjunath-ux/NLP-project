
export enum ErrorCategory {
  GRAMMAR = 'GRAMMAR',
  SPELLING = 'SPELLING',
  PUNCTUATION = 'PUNCTUATION',
  STYLE = 'STYLE'
}

export interface GrammarIssue {
  original: string;
  replacement: string;
  explanation: string;
  category: ErrorCategory;
  context: string; // Surrounding text to help locate it
}

export interface AnalysisResult {
  originalText: string;
  correctedFullText: string;
  issues: GrammarIssue[];
  statistics: {
    wordCount: number;
    characterCount: number;
    readabilityScore: string;
    tone: string;
  };
}

export interface AppState {
  inputText: string;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
