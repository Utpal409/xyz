
import type { Article } from '@/lib/types';
import ArticleCard from './article-card';

interface SearchResultsListProps {
  articles: Article[];
  query: string;
}

export default function SearchResultsList({ articles, query }: SearchResultsListProps) {
  return (
    <section aria-labelledby="search-results-title">
      <h1 id="search-results-title" className="text-3xl md:text-4xl font-headline font-bold mb-8">
        "<span className="text-primary">{query}</span>" के लिए खोज परिणाम
      </h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          आपके खोज शब्द "<span className="font-semibold text-foreground">{query}</span>" से मेल खाने वाले कोई लेख नहीं मिले।
          भिन्न कीवर्ड आज़माएँ या अपनी वर्तनी जांचें।
        </p>
      )}
    </section>
  );
}
