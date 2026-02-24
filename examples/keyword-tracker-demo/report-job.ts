/**
 * Example: keyword report job for the AI SaaS Starter.
 * Enqueue this job type from POST /api/keywords/report; process in your worker.
 */

export type KeywordReportJobData = {
  userId: string;
  jobId: string;
  type: 'keyword_report';
  keywords: string[];      // or topic if you only have one field
  options?: {
    includeSuggestions?: boolean;
    maxSuggestions?: number;
  };
};

const REPORT_CREDITS = 20;

export function getCreditsForReport(): number {
  return REPORT_CREDITS;
}

/**
 * Build the prompt you send to OpenAI for the "summary" part of the report.
 * In the worker: fetch rankings (or mock), then call OpenAI with this prompt.
 */
export function buildReportSummaryPrompt(keywords: string[], placeholderRankData?: string): string {
  const list = keywords.join(', ');
  const rankContext = placeholderRankData
    ? `\nCurrent data (example):\n${placeholderRankData}`
    : '';
  return `Write a 2–3 sentence SEO summary for these keywords: ${list}.${rankContext} Focus on what the user should do next.`;
}
