
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No date';

  const displayTitle = article.title || 'शीर्षक उपलब्ध नहीं है';
  const displayImageUrl = article.imageUrl || 'https://placehold.co/600x400.png';
  const displayDataAiHint = article.dataAiHint || 'placeholder';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border">
      <Link
        href={`/article/${article.id}`}
        aria-label={`${displayTitle} के बारे में और पढ़ें`}
        className="flex flex-col h-full group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={displayImageUrl}
              alt={displayTitle}
              fill
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              data-ai-hint={displayDataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-primary/20 hidden">{article.categoryName}</Badge>
          <CardTitle className="font-headline text-lg md:text-xl leading-tight mb-2 text-white group-hover:text-primary transition-colors">
            {displayTitle}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row justify-start items-start sm:items-center">
          <div className="text-xs text-card-foreground flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            {publishedDate}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
