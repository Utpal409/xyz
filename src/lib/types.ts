import type { LucideIcon } from 'lucide-react';

export type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  categorySlug: string;
  categoryName: string;
  publishedAt: string; 
  author?: string;
  dataAiHint?: string; 
};

export type Category = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
