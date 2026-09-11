declare module 'mfe_detail/PokemonDetail' {
  const PokemonDetail: React.ComponentType<{ pokemonId: string | number }>;
  export default PokemonDetail;
}

declare module 'mfe_history/PokemonHistory' {
  const PokemonHistory: React.ComponentType<{
    history: import('@reto-pokemon/shared').PokemonHistoryItem[];
    onSelectPokemon?: (id: number) => void;
    onClose?: () => void;
    onClearHistory?: () => void;
  }>;
  export default PokemonHistory;
}