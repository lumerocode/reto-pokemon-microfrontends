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
    <div role="status" aria-live="polite" className="toast-snake fixed bottom-6 right-6 z-40 max-w-sm animate-bounce-short">
      <div className="toast-snake__surface flex items-center space-x-4 rounded-[15px] bg-white p-4 shadow-2xl dark:bg-slate-900">
        <img src={lastVisited.image} alt={lastVisited.name} className="h-12 w-12 object-contain" />
        <button
          type="button"
          className="flex-1 cursor-pointer text-left"
          onClick={() => setSelectedPokemonId(lastVisited.id)}
          aria-label={`Open ${lastVisited.name}`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
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
          className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Close Toast"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}