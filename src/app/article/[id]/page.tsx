
import AppLayout from '@/components/layout/app-layout';
import ArticleDetail from '@/components/news/article-detail';
import { getArticleById, getAllArticles } from '@/lib/firebase-data'; // Updated import
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreadcrumbComponent from '@/components/layout/breadcrumb';
import type { Article } from '@/lib/types';

type ArticlePageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleById(params.id);
  if (!article) {
    return {
      title: 'लेख नहीं मिला',
    };
  }
  return {
    title: `${article.title} | एनएनपी`,
    description: article.summary,
  };
}

// Removing generateStaticParams as articles are now dynamic from Firebase
// export async function generateStaticParams() {
//   // This would need to fetch all article IDs from Firebase at build time
//   // For dynamic content, it's often better to render on demand or ISR
//   return []; 
// }

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  // For RelatedArticles, we need a list of all articles.
  // This might be inefficient for very large datasets on every article page load.
  // Consider optimizing this with more targeted queries or caching if performance becomes an issue.
  const allArticles = await getAllArticles();


  const breadcrumbElement = <BreadcrumbComponent article={article} />;

  return (
    <AppLayout breadcrumb={breadcrumbElement}>
      <ArticleDetail article={article} allArticles={allArticles} />
    </AppLayout>
  );
}
