
import type { Article, Category, NavItem } from './types';
import { Briefcase, Cpu, Landmark, Newspaper, Home, Trophy, Users, Shield, Globe, Film, HeartPulse, Atom, MessageSquare } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { name: 'राजनीति', slug: 'politics', icon: Landmark },
  { name: 'व्यापार', slug: 'business', icon: Briefcase },
  { name: 'प्रौद्योगिकी', slug: 'technology', icon: Cpu },
  { name: 'खेल', slug: 'sports', icon: Trophy },
  { name: 'विश्व', slug: 'world', icon: Globe },
  { name: 'मनोरंजन', slug: 'entertainment', icon: Film },
  { name: 'स्वास्थ्य', slug: 'health', icon: HeartPulse },
  { name: 'विज्ञान', slug: 'science', icon: Atom },
  { name: 'राय', slug: 'opinion', icon: MessageSquare },
];

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'होम', icon: Home },
  ...CATEGORIES.map(category => ({
    href: `/category/${category.slug}`,
    label: category.name,
    icon: category.icon,
  })),
  { href: '/admin', label: 'एडमिन पैनल', icon: Shield },
];

// PLACEHOLDER_ARTICLES and related data fetching functions (getArticleById, getArticlesByCategory, searchArticles, getHeadlines, getTrendingTopics)
// have been removed. Data is now fetched from Firebase using functions in `src/lib/firebase-data.ts`.

/**
 * Gets a list of deterministically selected related articles.
 * This function now expects allArticles to be provided, fetched from Firebase.
 * @param currentArticleId The ID of the current article.
 * @param allArticles An array of all articles (fetched from Firebase).
 * @param maxRelated The maximum number of related articles to return.
 * @returns An array of related articles.
 */
export function getDeterministicRelatedArticles(
  currentArticleId: string,
  allArticles: Article[], // Expecting all articles to be passed in
  maxRelated: number = 5
): Article[] {
  const currentArticle = allArticles.find(a => a.id === currentArticleId);
  if (!currentArticle) return [];

  const relatedArticlesMap = new Map<string, Article>();

  const getStartOfDay = (dateStr: string): Date => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const currentArticleDayStart = getStartOfDay(currentArticle.publishedAt);

  const potentialCandidates = [...allArticles]
    .filter(a => a.id !== currentArticleId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  let dayOffset = 0;
  const maxDaysToScan = 30; 

  while (relatedArticlesMap.size < maxRelated && dayOffset <= maxDaysToScan) {
    const targetDate = new Date(currentArticleDayStart);
    targetDate.setDate(currentArticleDayStart.getDate() - dayOffset);
    const targetDayStart = getStartOfDay(targetDate.toISOString());

    const articlesInWindow = potentialCandidates.filter(article => {
      const articleDayStart = getStartOfDay(article.publishedAt);
      return articleDayStart.getTime() === targetDayStart.getTime();
    });

    articlesInWindow
      .filter(a => a.categorySlug === currentArticle.categorySlug)
      .forEach(a => {
        if (relatedArticlesMap.size < maxRelated && !relatedArticlesMap.has(a.id)) {
          relatedArticlesMap.set(a.id, a);
        }
      });

    if (relatedArticlesMap.size < maxRelated) {
      articlesInWindow.forEach(a => {
        if (relatedArticlesMap.size < maxRelated && !relatedArticlesMap.has(a.id)) {
          relatedArticlesMap.set(a.id, a);
        }
      });
    }
    
    if (relatedArticlesMap.size >= maxRelated) break;
    dayOffset++;
  }

  if (relatedArticlesMap.size < maxRelated) {
    potentialCandidates.forEach(a => {
      if (relatedArticlesMap.size < maxRelated && !relatedArticlesMap.has(a.id)) {
        relatedArticlesMap.set(a.id, a);
      }
    });
  }
  
  return Array.from(relatedArticlesMap.values())
    .sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, maxRelated);
}
