
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Newspaper, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getDeterministicRelatedArticles } from '@/lib/placeholder-data'; // Still using this logic, but with Firebase data

interface RelatedArticlesProps {
  currentArticleId: string;
  allArticles: Article[]; // Receives all articles from the parent page (fetched from Firebase)
}

const MAX_RELATED_ARTICLES_DISPLAY = 5;

export default function RelatedArticles({ currentArticleId, allArticles }: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the passed-in allArticles (from Firebase) to determine related articles
      const articles = getDeterministicRelatedArticles(currentArticleId, allArticles, MAX_RELATED_ARTICLES_DISPLAY);
      setRelatedArticles(articles);
    } catch (err: any) {
      console.error("Error determining related articles:", err);
      setError("संबंधित लेख लोड करने में त्रुटि हुई।");
    } finally {
      setIsLoading(false);
    }
  }, [currentArticleId, allArticles]);


  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl flex items-center text-card-foreground">
            <Lightbulb className="h-7 w-7 mr-3 text-primary" />
            संबंधित लेख लोड हो रहे हैं...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <li 
              key={index}
              className="border border-border rounded-lg p-4 bg-muted/30 shadow-sm animate-pulse"
            >
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </li>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-destructive flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            त्रुटि
            </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (relatedArticles.length === 0) {
     return (
        <Card className="mt-8 shadow-lg rounded-xl border">
            <CardHeader className="pb-4">
                <CardTitle className="font-headline text-2xl flex items-center text-card-foreground">
                    <Newspaper className="h-7 w-7 mr-3 text-primary" />
                    संबंधित लेख
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">कोई संबंधित लेख नहीं मिला।</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-lg rounded-xl border">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl flex items-center text-card-foreground">
          <Newspaper className="h-7 w-7 mr-3 text-primary" />
          संबंधित लेख
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {relatedArticles.map((article) => (
            <li 
              key={article.id}
              className="border border-border bg-card hover:border-primary transition-all duration-300 ease-in-out shadow-md hover:shadow-lg rounded-lg group"
            >
              <Link href={`/article/${article.id}`} className="block p-4 transition-colors hover:bg-muted/30 rounded-lg">
                <h3 className="text-md font-semibold text-card-foreground group-hover:text-primary mb-1.5 flex items-center">
                  {article.title}
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                </h3>
                <p className="text-xs text-muted line-clamp-2">{article.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

