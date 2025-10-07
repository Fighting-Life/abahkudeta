interface FilterOptions {
	searchTerm?: string;
	gameTypes?: GameType[];
	category?: string;
	categorySlug?: string;
	provider?: Partner;
	favouritesOnly?: boolean;
	sortBy?: "name" | "provider" | "category" | "favourites";
	sortOrder?: "asc" | "desc";
	filter?: FilterType;
	limit?: number;
}
export const useArcadeGames = () => {
	const searchCache = new Map<string, Game[]>();

	return {
		searchCache,
	};
};
