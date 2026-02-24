/**
 * Example: astrology-specific prompt layer for the AI SaaS Starter.
 * Use in your API route or worker when job type is "astrology".
 */

export type AstrologyJobType = 'daily_horoscope' | 'birth_chart_insight' | 'compatibility';

const CREDITS: Record<AstrologyJobType, number> = {
  daily_horoscope: 5,
  birth_chart_insight: 15,
  compatibility: 20,
};

const SYSTEM_PROMPT = `You are a thoughtful astrology advisor. Use clear, engaging language.
Keep responses structured (short intro, 2–3 bullet points or short paragraphs, optional closing).
Do not make medical or legal claims.`;

export function getAstrologySystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(
  type: AstrologyJobType,
  input: { zodiacSign?: string; birthDate?: string; partnerSign?: string; question?: string }
): string {
  switch (type) {
    case 'daily_horoscope':
      return `Write a daily horoscope for ${input.zodiacSign || 'the user'}. Focus on today's energy and one practical tip.`;
    case 'birth_chart_insight':
      return `Give a brief birth chart insight for someone born ${input.birthDate || 'unknown'}. Focus on sun/moon/rising and one key theme.`;
    case 'compatibility':
      return `Describe compatibility between ${input.zodiacSign || 'sign A'} and ${input.partnerSign || 'sign B'}. Keep it to 3–4 sentences.`;
    default:
      return input.question || 'Share a general astrological insight.';
  }
}

export function getCreditsForType(type: AstrologyJobType): number {
  return CREDITS[type];
}
