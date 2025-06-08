
"use client";

import Link from 'next/link';
import HamburgerMenu from './hamburger-menu';
import { CATEGORIES } from '@/lib/placeholder-data';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Hamburger & Logo */}
          <div className="flex items-center">
            <HamburgerMenu />
            <Link
              href="/"
              className="flex items-center ml-2 px-2 py-1 rounded-md hover:bg-gray-700/50 transition-colors"
              aria-label="मुखपृष्ठ"
            >
              <h1
                className="text-xl md:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-cover bg-center bg-[url('https://placehold.co/300x75.png')]"
                data-ai-hint="abstract pattern"
              >
                NNP
              </h1>
            </Link>
          </div>

          {/* Center Section: Categories - Visible on lg screens and up */}
          <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1 xl:space-x-2 absolute left-1/2 transform -translate-x-1/2">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={cn(
                  "px-2 py-2 lg:px-3 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap",
                  pathname === `/category/${category.slug}`
                    ? "bg-gray-700 text-white shadow-sm font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                {category.name}
              </Link>
            ))}
          </nav>
          
          {/* Right Section Placeholder - to balance flex */}
          <div className="w-auto invisible flex items-center" aria-hidden="true"> 
            <HamburgerMenu />
             <Link
              href="/"
              className="flex items-center ml-2 px-2 py-1"
            >
              <h1 className="text-xl md:text-2xl font-bold tracking-wider">
                NNP
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
