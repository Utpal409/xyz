
import { Newspaper } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Newspaper className="h-7 w-7 text-gray-400" />
          <p className="ml-2 text-lg font-headline text-zinc-200">एनएनपी</p>
        </div>
        <p className="text-sm">
          &copy; {currentYear} एनएनपी. सर्वाधिकार सुरक्षित।
        </p>
        <p className="text-xs mt-2">
          सूचित रहें। जुड़े रहें।
        </p>
      </div>
    </footer>
  );
}
