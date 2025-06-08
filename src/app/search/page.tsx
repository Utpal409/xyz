
import AppLayout from '@/components/layout/app-layout';
import SearchResultsList from '@/components/news/search-results-list';
import { searchArticlesFirebase } from '@/lib/firebase-data'; // Updated import
import type { Article } from '@/lib/types';
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  if (query) {
    return {
      title: `"${query}" के लिए खोज परिणाम | एनएनपी`,
      description: `"${query}" के लिए समाचार लेख खोजें।`,
    };
  }
  return {
    title: 'खोज | एनएनपी',
    description: 'समाचार लेखों के लिए खोजें।',
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const articles: Article[] = await searchArticlesFirebase(query); 

  return (
    <AppLayout>
      <SearchResultsList articles={articles} query={query} />
    </AppLayout>
  );
}
