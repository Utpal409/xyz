
import AppLayout from '@/components/layout/app-layout';
import ArticleCard from '@/components/news/article-card';
import { getAllArticles } from '@/lib/firebase-data'; // Updated import
import type { Article } from '@/lib/types';
import HeadlineDisplay from '@/components/news/headline-display'; // For potential use
import TrendingTopics from '@/components/news/trending-topics';   // For potential use


export default async function HomePage() {
  const articles: Article[] = await getAllArticles();
  // For HeadlineDisplay and TrendingTopics, you might want specific fetches
  // For now, let's pass a subset of all articles or they can fetch their own
  // For simplicity, we'll sort all articles here. Headlines and Trending can use this sorted list too.
  
  // Articles are already sorted by publishedAt descending in getAllArticles()

  return (
    <AppLayout>
      {/* Example: If you want to show headlines/trending sections */}
      {/* <HeadlineDisplay articles={articles.slice(0, 3)} /> */}
      {/* <TrendingTopics articles={articles.slice(0, 4)} /> */}

      <section aria-labelledby="latest-articles-title" className="mb-12">
        {/* <h1 id="latest-articles-title" className="text-3xl md:text-4xl font-headline font-bold mb-8 pb-2 border-b-2 border-primary">
          नवीनतम लेख
        </h1> */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground py-10">फिलहाल कोई लेख उपलब्ध नहीं है। कृपया बाद में जांचें।</p>
        )}
      </section>
    </AppLayout>
  );
}
