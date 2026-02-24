/**
 * Example: SEO content prompt templates for the AI SaaS Starter.
 * Use in your API route or worker when job type is "seo_content".
 */

export type SeoOutputType = 'meta_title_description' | 'blog_outline' | 'full_article_intro';

const CREDITS: Record<SeoOutputType, number> = {
  meta_title_description: 5,
  blog_outline: 15,
  full_article_intro: 30,
};

export function getSeoSystemPrompt(outputType: SeoOutputType): string {
  const base = 'You are an expert SEO copywriter. Output only the requested format, no preamble.';
  switch (outputType) {
    case 'meta_title_description':
      return `${base} Return valid JSON: { "title": "...", "description": "..." }. Title ≤60 chars, description ≤155.`;
    case 'blog_outline':
      return `${base} Return a markdown list of H2/H3 headings for the topic.`;
    case 'full_article_intro':
      return `${base} Write a 2–3 paragraph intro that hooks the reader and includes the primary keyword naturally.`;
    default:
      return base;
  }
}

export function buildSeoUserPrompt(
  outputType: SeoOutputType,
  input: { keyword: string; targetUrl?: string; topic?: string }
): string {
  const { keyword, targetUrl, topic } = input;
  const context = targetUrl ? `Target URL: ${targetUrl}. ` : '';
  const subject = topic || keyword;
  switch (outputType) {
    case 'meta_title_description':
      return `${context}Generate meta title and description for: ${subject}. Primary keyword: ${keyword}.`;
    case 'blog_outline':
      return `${context}Create a blog outline for: ${subject}. Keyword to include: ${keyword}.`;
    case 'full_article_intro':
      return `${context}Write an article intro for: ${subject}. Primary keyword: ${keyword}.`;
    default:
      return `Topic: ${subject}. Keyword: ${keyword}.`;
  }
}

export function getCreditsForSeoType(outputType: SeoOutputType): number {
  return CREDITS[outputType];
}
