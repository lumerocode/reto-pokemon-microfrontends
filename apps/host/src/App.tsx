import { useAppStore } from './store/useAppStore';
import { LoginView } from './components/LoginView';
import { Layout } from './components/Layout';
import { CategorySection } from './components/CategorySection';
import { PokemonDetailRemote } from './components/remotes/PokemonDetailRemote';
import { PokemonHistoryRemote } from './components/remotes/PokemonHistoryRemote';

const HOME_CATEGORIES = ['fire', 'water', 'grass', 'electric', 'dragon', 'psychic'] as const;

export function App() {
  const user = useAppStore((state) => state.user);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const selectedPokemonId = useAppStore((state) => state.selectedPokemonId);
  const setSelectedPokemonId = useAppStore((state) => state.setSelectedPokemonId);
  const history = useAppStore((state) => state.history);
  const addPokemonToHistory = useAppStore((state) => state.addPokemonToHistory);
  const isHistoryOpen = useAppStore((state) => state.isHistoryOpen);
  const closeHistory = useAppStore((state) => state.closeHistory);
  const clearHistory = useAppStore((state) => state.clearHistory);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Loading Pokedex...
      </div>
    );
  }

  // Render LoginView if user is not authenticated
  if (!user) {
    return <LoginView />;
  }

  return (
    <Layout>
      <section className="space-y-6">
        {isHistoryOpen && (
          <PokemonHistoryRemote
            history={history}
            onClose={closeHistory}
            onClearHistory={clearHistory}
            onSelectPokemon={(id) => {
              const pokemon = history.find((item) => item.id === id);
              if (pokemon) {
                addPokemonToHistory(pokemon);
              }
              setSelectedPokemonId(id);
              closeHistory();
            }}
          />
        )}
        {selectedPokemonId !== null && (
          <PokemonDetailRemote
            pokemonId={selectedPokemonId}
            onBack={() => setSelectedPokemonId(null)}
          />
        )}
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">CATEGORIES</h2>
        {HOME_CATEGORIES.map((category) => (
          <CategorySection key={category} categoryName={category} />
        ))}
      </section>
    </Layout>
  );
}

export default App;