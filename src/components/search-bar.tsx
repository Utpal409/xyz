
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
      <Input
        type="search"
        placeholder="लेख खोजें..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-background text-foreground placeholder:text-muted-foreground border-border focus:border-primary flex-grow"
        aria-label="लेख खोजें"
      />
      <Button type="submit" variant="ghost" size="icon" className="text-primary hover:bg-primary/10" aria-label="खोज सबमिट करें">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
