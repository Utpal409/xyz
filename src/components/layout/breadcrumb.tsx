
"use client";

import Link from 'next/link';
import type { Article } from '@/lib/types';
import { ChevronRight } from 'lucide-react'; 

interface BreadcrumbProps {
  article: Article;
}

export default function Breadcrumb({ article }: BreadcrumbProps) {
  const truncatedTitle = article.title.length > 50 ? `${article.title.substring(0, 47)}...` : article.title;

  return (
    <nav className="bg-background text-sm shadow-md sticky top-16 z-40 w-full" aria-label="breadcrumb">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="list-none p-0 inline-flex items-center h-10 space-x-1.5">
          <li>
            <Link href="/" className="text-foreground hover:text-white transition-colors">
              होम
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-muted" />
          </li>
          <li>
            <Link href={`/category/${article.categorySlug}`} className="text-foreground hover:text-white transition-colors">
              {article.categoryName}
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-muted" />
          </li>
          <li className="text-white truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]" aria-current="page" title={article.title}>
            {truncatedTitle}
          </li>
        </ol>
      </div>
    </nav>
  );
}

