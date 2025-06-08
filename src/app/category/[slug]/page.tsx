
import AppLayout from '@/components/layout/app-layout';
import CategoryNewsList from '@/components/news/category-news-list';
import { getArticlesByCategory } from '@/lib/firebase-data'; // Updated import
import { CATEGORIES } from '@/lib/placeholder-data'; // Keep for category details
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find(cat => cat.slug === params.slug);
  if (!category) {
    return {
      title: 'श्रेणी नहीं मिली',
    };
  }
  return {
    title: `${category.name} समाचार | एनएनपी`,
    description: `${category.name} श्रेणी में नवीनतम समाचार और लेख।`,
  };
}

// Removing generateStaticParams as categories might have dynamic article lists
// export async function generateStaticParams() {
//   return CATEGORIES.map((category) => ({
//     slug: category.slug,
//   }));
// }

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = CATEGORIES.find(cat => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  return (
    <AppLayout>
      <CategoryNewsList articles={articles} categoryName={category.name} />
    </AppLayout>
  );
}
