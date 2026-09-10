import { useAppStore } from '../store/useAppStore';
import { X } from 'lucide-react';

export function ToastGlobal() {
  const history = useAppStore((state) => state.history);
  const setSelectedPokemonId = useAppStore((state) => state.setSelectedPokemonId);
  const dismissedToastVisitKey = useAppStore((state) => state.dismissedToastVisitKey);
  const dismissToast = useAppStore((state) => state.dismissToast);
  const lastVisited = history.reduce<typeof history[number] | null>((latest, item) => {
    if (!latest || item.lastVisited > latest.lastVisited) return item;
    return latest;
  }, null);
  const lastVisitedKey = lastVisited
    ? `${lastVisited.id}:${lastVisited.lastVisited}:${lastVisited.visitedCount}`
    : null;

  if (!lastVisited || lastVisitedKey === dismissedToastVisitKey) return null;

  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-sm animate-bounce-short">
      <img src={lastVisited.image} alt={lastVisited.name} className="w-12 h-12 object-contain" />
      <button
        type="button"
        className="flex-1 cursor-pointer text-left"
        onClick={() => setSelectedPokemonId(lastVisited.id)}
        aria-label={`Open ${lastVisited.name}`}
      >
        <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
          Last Visited Pokemon
        </p>
        <h4 className="text-sm font-bold capitalize text-slate-800 dark:text-slate-100">
          {lastVisited.name}
        </h4>
        <p className="text-xs text-slate-400">
          Visits: {lastVisited.visitedCount}
        </p>
      </button>
      <button
        type="button"
        onClick={() => dismissToast(lastVisitedKey!)}
        aria-label="Close toast"
        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
        title="Close Toast"
      >
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}