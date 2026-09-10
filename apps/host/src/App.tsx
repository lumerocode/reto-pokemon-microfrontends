import { useAppStore } from './store/useAppStore';
import { LoginView } from './components/LoginView';
import { Layout } from './components/Layout';
import { CategorySection } from './components/CategorySection';

const HOME_CATEGORIES = ['fire', 'water', 'grass', 'electric', 'dragon', 'psychic'] as const;

export function App() {
  const user = useAppStore((state) => state.user);
  const hasHydrated = useAppStore((state) => state.hasHydrated);

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
      {/* Home Categories */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">CATEGORIES</h2>
        {HOME_CATEGORIES.map((category) => (
          <CategorySection key={category} categoryName={category} />
        ))}
      </section>
    </Layout>
  );
}

export default App;