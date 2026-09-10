declare module 'mfe_detail/PokemonDetail' {
  const PokemonDetail: React.ComponentType<{ pokemonId: string | number; onBack?: () => void }>;
  export default PokemonDetail;
}

declare module 'mfe_history/PokemonHistory' {
  const PokemonHistory: React.ComponentType<{ onSelectPokemon?: (id: string) => void }>;
  export default PokemonHistory;
}