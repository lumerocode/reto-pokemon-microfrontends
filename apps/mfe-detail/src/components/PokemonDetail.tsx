import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Loader2, Ruler, Weight } from 'lucide-react';
import { POKEAPI_BASE_URL } from '@reto-pokemon/shared';
import type { PokemonDetailResponse } from '@reto-pokemon/shared';
import { statLabels, typeColors } from '../constants/pokemonDetail';

interface PokemonDetailProps {
  pokemonId: string | number;
}

function PokemonArtwork({ image, name }: { image: string; name: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex min-h-64 w-full items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center" role="status" aria-label={`Loading ${name} artwork`}>
          <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        </div>
      )}
      <img
        src={image}
        alt={name}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        className={`max-h-64 w-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize text-white ${typeColors[type] ?? 'bg-indigo-500'}`}>
      {type}
    </span>
  );
}

function MeasurementCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
      {icon}
      <p className="mt-2 text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function StatRow({ name, value }: { name: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
        <span>{statLabels[name] ?? name}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export default function PokemonDetail({ pokemonId }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadPokemon = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${String(pokemonId).toLowerCase()}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Pokemon detail request failed');
        setPokemon((await response.json()) as PokemonDetailResponse);
      } catch {
        if (!controller.signal.aborted) setHasError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadPokemon();
    return () => controller.abort();
  }, [pokemonId]);

  if (isLoading) {
    return <div className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><Loader2 className="h-7 w-7 animate-spin text-indigo-500" aria-label="Loading Pokemon detail" /></div>;
  }

  if (hasError || !pokemon) {
    return <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300"><p>Unable to load this Pokemon detail.</p></div>;
  }

  const image = pokemon.sprites.other?.dream_world?.front_default ?? pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default;
  const sortedTypes = pokemon.types.slice().sort((firstType, secondType) => firstType.slot - secondType.slot);
  const measurements = [
    { icon: <Ruler className="h-4 w-4 text-indigo-500" />, label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
    { icon: <Weight className="h-4 w-4 text-indigo-500" />, label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
  ];

  return (
    <article className="relative min-h-[100dvh] overflow-hidden rounded-none border-0 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:min-h-0 sm:rounded-3xl sm:border">
      <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.8fr)_1.2fr] lg:items-center">
        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-50 p-6 dark:bg-slate-950">
          {image ? (
            <PokemonArtwork image={image} name={pokemon.name} />
          ) : (
            <span className="text-sm text-slate-500">No artwork available</span>
          )}
        </div>
        <div>
          <span className="font-mono text-sm text-indigo-500">#{String(pokemon.id).padStart(3, '0')}</span>
          <h2 className="mt-1 text-4xl font-black capitalize text-slate-900 dark:text-white">{pokemon.name}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {sortedTypes.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}
          </div>
          <div className="mt-6 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3">
            {measurements.map((measurement) => <MeasurementCard key={measurement.label} {...measurement} />)}
          </div>
        </div>
      </div>
      <section className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Base stats</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
          {pokemon.stats.map(({ base_stat, stat }) => <StatRow key={stat.name} name={stat.name} value={base_stat} />)}
        </div>
      </section>
    </article>
  );
}