
import type { Article } from '@/lib/types'; // Import Article type
import ArticleCard from './article-card';

interface HeadlineDisplayProps {
  articles: Article[]; // Expect articles to be passed as props
}

export default function HeadlineDisplay({ articles }: HeadlineDisplayProps) {
  // The parent component (e.g., HomePage) will fetch and pass the articles.
  // This component is now primarily for display.

  return (
    <section aria-labelledby="headlines-title" className="mb-12">
      <h2 id="headlines-title" className="text-3xl font-headline font-bold mb-6 pb-2">
        Latest Headlines
      </h2>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p>No headlines available at the moment. Please check back later.</p>
      )}
    </section>
  );
}
