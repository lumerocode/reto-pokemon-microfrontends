import type { PokemonListItem } from '@reto-pokemon/shared';
import { SafeImage } from './SafeImage';

interface PokemonCardProps {
  pokemon: Pick<PokemonListItem, 'id' | 'name' | 'image'>;
  onSelect: (pokemon: Pick<PokemonListItem, 'id' | 'name' | 'image'>) => void;
  variant?: 'category' | 'grid' | 'result';
}

const variantStyles = {
  category: {
    card: 'p-3 flex-col text-center',
    image: 'w-14 h-14',
    name: 'text-xs',
  },
  grid: {
    card: 'p-4 flex-col text-center',
    image: 'w-20 h-20 my-2',
    name: 'text-sm',
  },
  result: {
    card: 'p-4 items-center justify-between',
    image: 'w-16 h-16',
    name: 'text-xl',
  },
} as const;

export function PokemonCard({ pokemon, onSelect, variant = 'category' }: PokemonCardProps) {
  const styles = variantStyles[variant];
  const isResult = variant === 'result';

  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon)}
      aria-label={`Select ${pokemon.name}`}
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl cursor-pointer ${styles.card} flex text-left transition-all hover:-translate-y-1 hover:shadow-md group ${
        isResult ? 'dark:bg-indigo-950/40 dark:border-indigo-500/30 dark:hover:border-indigo-500' : ''
      }`}
    >
      <div className={isResult ? 'flex items-center space-x-4' : 'flex w-full flex-col items-center text-center'}>
        <span className="self-start text-xs font-mono text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          #{pokemon.id}
        </span>
        <SafeImage
          src={pokemon.image}
          alt={pokemon.name}
          className={`${styles.image} object-contain group-hover:scale-110 transition-transform`}
        />
        <span
          className={`${styles.name} font-semibold capitalize text-slate-700 dark:text-slate-200 group-hover:text-indigo-500 ${
            isResult ? '' : 'mt-1'
          }`}
        >
          {pokemon.name}
        </span>
      </div>
      {isResult && (
        <span className="text-xs bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-full font-medium">
          Select
        </span>
      )}
    </button>
  );
}
