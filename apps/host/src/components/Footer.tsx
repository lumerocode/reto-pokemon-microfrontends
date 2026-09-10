import { Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-6 px-6 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Mission */}
        <div className="flex items-center space-x-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Micro-Frontend Architecture with Vite & Module Federation
          </p>
        </div>

        {/* Tech Badges & Credits */}
        <div className="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Built by Luis Meléndez R.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}