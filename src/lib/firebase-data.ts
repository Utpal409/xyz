
// @ts-nocheck
// TODO: Remove ts-nocheck and fix type issues
'use server';

import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@/lib/firebase';
import type { Article } from '@/lib/types';
import { CATEGORIES } from '@/lib/placeholder-data'; // Keep for category name mapping

function mapFirebaseObjectToArticleArray(data: any): Article[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  return Object.keys(data).map(key => {
    const articleItem = data[key];
    if (!articleItem || typeof articleItem !== 'object') {
      return null; 
    }

    const categorySlugValue = (articleItem.categorySlug && typeof articleItem.categorySlug === 'string' && articleItem.categorySlug.trim() !== '') 
      ? articleItem.categorySlug.trim() 
      : 'unknown';
    
    const category = CATEGORIES.find(cat => cat.slug === categorySlugValue);
    
    const publishedAtValue = (articleItem.publishedAt && typeof articleItem.publishedAt === 'string' && !isNaN(new Date(articleItem.publishedAt).getTime()))
      ? articleItem.publishedAt
      : new Date(0).toISOString();

    const mappedArticle: Article = {
      id: key,
      title: (articleItem.title && typeof articleItem.title === 'string' && articleItem.title.trim() !== '') ? articleItem.title.trim() : 'शीर्षक उपलब्ध नहीं है',
      summary: (articleItem.summary && typeof articleItem.summary === 'string' && articleItem.summary.trim() !== '') ? articleItem.summary.trim() : 'सारांश उपलब्ध नहीं है।',
      content: (articleItem.content && typeof articleItem.content === 'string') ? articleItem.content : '', // Keep empty string if content is missing or not string
      imageUrl: (articleItem.imageUrl && typeof articleItem.imageUrl === 'string' && articleItem.imageUrl.trim() !== '') ? articleItem.imageUrl.trim() : 'https://placehold.co/600x400.png',
      dataAiHint: (articleItem.dataAiHint && typeof articleItem.dataAiHint === 'string' && articleItem.dataAiHint.trim() !== '') ? articleItem.dataAiHint.trim() : 'placeholder',
      categorySlug: categorySlugValue,
      categoryName: category ? category.name : (categorySlugValue !== 'unknown' ? categorySlugValue : 'अज्ञात श्रेणी'),
      publishedAt: publishedAtValue,
      author: (articleItem.author && typeof articleItem.author === 'string' && articleItem.author.trim() !== '') ? articleItem.author.trim() : 'अज्ञात लेखक',
    };
    return mappedArticle;
  }).filter(article => article !== null) as Article[];
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const articlesRef = ref(database, 'news'); // Changed 'articles' to 'news'
    const snapshot = await get(articlesRef);
    if (snapshot.exists()) {
      const articlesData = snapshot.val();
      if (!articlesData || typeof articlesData !== 'object') {
        // Data at /news is not an object or is null
        return [];
      }
      const mappedArticles = mapFirebaseObjectToArticleArray(articlesData);
      return mappedArticles.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime(); // Already guaranteed to be valid or epoch
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching all articles from Firebase:", error);
    return [];
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const articleRef = ref(database, `news/${id}`); // Changed 'articles' to 'news'
    const snapshot = await get(articleRef);
    if (snapshot.exists()) {
      const articleData = snapshot.val();
      if (typeof articleData !== 'object' || articleData === null) {
        return null;
      }

      const categorySlugValue = (articleData.categorySlug && typeof articleData.categorySlug === 'string' && articleData.categorySlug.trim() !== '')
        ? articleData.categorySlug.trim()
        : 'unknown';
      
      const category = CATEGORIES.find(cat => cat.slug === categorySlugValue);

      const publishedAtValue = (articleData.publishedAt && typeof articleData.publishedAt === 'string' && !isNaN(new Date(articleData.publishedAt).getTime()))
        ? articleData.publishedAt
        : new Date(0).toISOString();

      return {
        id,
        title: (articleData.title && typeof articleData.title === 'string' && articleData.title.trim() !== '') ? articleData.title.trim() : 'शीर्षक उपलब्ध नहीं है',
        summary: (articleData.summary && typeof articleData.summary === 'string' && articleData.summary.trim() !== '') ? articleData.summary.trim() : 'सारांश उपलब्ध नहीं है।',
        content: (articleData.content && typeof articleData.content === 'string') ? articleData.content : '',
        imageUrl: (articleData.imageUrl && typeof articleData.imageUrl === 'string' && articleData.imageUrl.trim() !== '') ? articleData.imageUrl.trim() : 'https://placehold.co/600x400.png',
        dataAiHint: (articleData.dataAiHint && typeof articleData.dataAiHint === 'string' && articleData.dataAiHint.trim() !== '') ? articleData.dataAiHint.trim() : 'placeholder',
        categorySlug: categorySlugValue,
        categoryName: category ? category.name : (categorySlugValue !== 'unknown' ? categorySlugValue : 'अज्ञात श्रेणी'),
        publishedAt: publishedAtValue,
        author: (articleData.author && typeof articleData.author === 'string' && articleData.author.trim() !== '') ? articleData.author.trim() : 'अज्ञात लेखक',
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching article by ID (${id}) from Firebase:`, error);
    return null;
  }
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  try {
    const allArticles = await getAllArticles(); // This now uses the more robust getAllArticles which fetches from /news
    return allArticles.filter(article => article.categorySlug === categorySlug);
  } catch (error) {
    console.error(`Error fetching articles by category (${categorySlug}) from Firebase:`, error);
    return [];
  }
}

export async function searchArticlesFirebase(searchTerm: string): Promise<Article[]> {
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) return [];
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  try {
    const allArticles = await getAllArticles(); // This now uses the more robust getAllArticles which fetches from /news
    return allArticles.filter(article =>
      (article.title || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (article.summary || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      (article.content || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  } catch (error) {
    console.error(`Error searching articles (${searchTerm}) from Firebase:`, error);
    return [];
  }
}

export async function getRecentArticles(count: number = 3): Promise<Article[]> {
  try {
    const allArticles = await getAllArticles(); 
    return allArticles.slice(0, count);
  } catch (error)
 {
    console.error("Error fetching recent articles from Firebase:", error);
    return [];
  }
}

export async function getFirebaseTrendingTopics(count: number = 4): Promise<Article[]> {
   try {
    const allArticles = await getAllArticles();
    // Simple random sort for trending for now.
    return allArticles.sort(() => 0.5 - Math.random()).slice(0, count);
  } catch (error) {
    console.error("Error fetching trending articles from Firebase:", error);
    return [];
  }
}

