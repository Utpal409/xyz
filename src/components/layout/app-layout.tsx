
import type React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { cn } from '@/lib/utils';

type AppLayoutProps = {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode; // New optional prop for the breadcrumb
};

export default function AppLayout({ children, breadcrumb }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      {breadcrumb} {/* Render breadcrumb here, if provided */}
      <main className={cn(
        "flex-grow container mx-auto px-2 sm:px-6 lg:px-8 pb-8",
        breadcrumb ? "pt-0" : "pt-8" // Conditional top padding
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
