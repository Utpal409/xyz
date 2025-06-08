
import type { Article } from '@/lib/types';
import ArticleCard from './article-card';

interface CategoryNewsListProps {
  articles: Article[];
  categoryName: string;
}

export default function CategoryNewsList({ articles, categoryName }: CategoryNewsListProps) {
  return (
    <section aria-labelledby={`category-${categoryName}-title`}>
      <h1 id={`category-${categoryName}-title`} className="text-3xl md:text-4xl font-headline font-bold mb-8 pb-2 border-b-2 border-primary">
        {categoryName}
      </h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p>इस श्रेणी में कोई लेख नहीं मिला। कृपया बाद में जांचें।</p>
      )}
    </section>
  );
}
