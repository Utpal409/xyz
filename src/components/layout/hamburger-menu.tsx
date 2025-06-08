
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarNav } from './sidebar-nav';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-gray-700 h-7 w-7 md:h-8 md:w-8" 
          aria-label="नेविगेशन और खोज मेनू खोलें"
        >
          <Menu className="h-full w-full" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <SheetHeader className="p-4 border-b border-sidebar-border">
          <SheetTitle className="font-headline text-xl text-primary">मेनू</SheetTitle>
        </SheetHeader>
        <SidebarNav onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
