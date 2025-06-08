
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import SearchBar from '../search-bar'; // Import SearchBar

interface SidebarNavProps {
  onLinkClick?: () => void;
}

export function SidebarNav({ onLinkClick }: SidebarNavProps) {
  const pathname = usePathname();

  const adminItem = NAV_ITEMS.find(item => item.href === '/admin');
  const regularNavItems = NAV_ITEMS.filter(item => item.href !== '/admin');

  return (
    <nav className="flex flex-col flex-grow">
      <div className="p-4"> {/* Added wrapper for search bar */}
        <SearchBar />
      </div>
      <div className="p-4 space-y-1 flex-grow overflow-y-auto"> {/* Added wrapper for regular items with padding and spacing */}
        {regularNavItems.map((item: NavItem) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-[hsl(var(--sidebar-background))]"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-headline">{item.label}</span>
          </Link>
        ))}
      </div>
      {adminItem && (
        <div className="mt-auto p-4 border-t-2 border-sidebar-border/70 flex justify-center">
          <Link
            key={adminItem.href}
            href={adminItem.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center space-x-3 px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-md w-auto",
              pathname === adminItem.href
                ? "bg-blue-700 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700", 
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[hsl(var(--sidebar-background))]" 
            )}
          >
            <adminItem.icon className="h-6 w-6 text-white" /> 
            <span className="font-headline">{adminItem.label}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
