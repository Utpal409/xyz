
import type { Article } from '@/lib/types';
import Image from 'next/image';
import { CalendarDays, UserCircle } from 'lucide-react';
import RelatedArticles from './related-articles';

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[]; // Added to pass all articles for related content
}

export default function ArticleDetail({ article, allArticles }: ArticleDetailProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl">
      <header className="mb-6">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-card-foreground mb-3">
          {article.title}
        </h1>
        <p className="text-xl italic text-card-foreground mt-2 mb-4">{article.summary}</p>
        <div className="flex flex-wrap items-center text-sm text-card-foreground/80 space-x-4">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            <span>{publishedDate}</span>
          </div>
          {article.author && (
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>द्वारा {article.author}</span>
            </div>
          )}
        </div>
      </header>

      {article.imageUrl && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 mb-6 rounded-md overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.dataAiHint}
            priority
          />
        </div>
      )}
      
      <div className="prose prose-lg prose-invert max-w-none font-body leading-relaxed text-card-foreground">
        {(article.content || '').split('\\n\\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>

      <RelatedArticles currentArticleId={article.id} allArticles={allArticles} />
    </article>
  );
}
