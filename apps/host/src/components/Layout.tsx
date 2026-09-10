import React from 'react';
import { Navbar } from './Navbar';
import { SearchModal } from './SearchModal';
import { ToastGlobal } from './ToastGlobal';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <SearchModal />
      <ToastGlobal />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">{children}</main>
      <Footer />
    </div>
  );
}