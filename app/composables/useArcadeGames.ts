export type ArcadeFilterType =
	| "Semua permainan"
	| "Fishing"
	| "Instant Win"
	| "Arcade";

interface FilterOptions {
	searchTerm?: string;
	gameTypes?: GameType[];
	category?: string;
	categorySlug?: string;
	provider?: Partner;
	favouritesOnly?: boolean;
	sortBy?: "name" | "provider" | "category" | "favourites";
	sortOrder?: "asc" | "desc";
	filter?: ArcadeFilterType;
	limit?: number;
}
export const useArcadeGames = () => {
	const searchArcadeCache = new Map<string, Game[]>();
	const allArcadeGames = ref<Game[]>([
		...ArcadePPGames,
		...ArcadeMigrogamingGames,
		...ArcadeHackSawGames,
		...AracdeKingMidasGames,
		...ArcadeJiliGames,
		...ArcadeGeminiGames,
		...ArcadeAviatorGames,
		...ArcadeFachaiGames,
		...ArcadeSpinixGames,
		...ArcadeJokerGames,
		...ArcadeBtGamingGames,
		...ArcadeAMBGames,
		...ArcadeCrowdPlayGames,
		...AraceVPowerGames,
		...ArcadeWorldmatchGames,
		...ArcadeMarioClubGames,
		...ArcadeDragoonsoftGames,
		...ArcadeCQ9Games,
		...ArcadeFunGamingGames,
		...ArcadeMMTangkasGames,
		...ArcadeSkywindGames,
		...ArcadeJDBGames,
		...ArcadeFungkyGames,
	]);

	const searchArcadeTerm = ref<string | undefined>(undefined);
	const selectedArcadeGameTypes = ref<GameType[]>([]);
	const selectedArcadeCategory = ref("");
	const selectedArcadeProvider = ref<Partner | undefined>(undefined);
	const selectedArcadeCategorySlug = ref("pp");
	const selectedArcadeFilter = ref<ArcadeFilterType | undefined>(undefined);
	const favouritesArcadeOnly = ref(false);
	const sortArcadeBy = ref<"name" | "provider" | "category" | "favourites">(
		"name",
	);
	const sortArcadeOrder = ref<"asc" | "desc">("asc");

	const searchArcadeGames = (terms?: string, limit?: number): Game[] => {
		if (!terms || !terms.trim()) {
			return limit
				? allArcadeGames.value.slice(0, limit)
				: allArcadeGames.value;
		}

		const cacheKey = `${terms.toLowerCase()}-${limit || "all"}`;
		if (searchArcadeCache.has(cacheKey)) {
			return searchArcadeCache.get(cacheKey)!;
		}

		const searchTerm = terms.toLowerCase().trim();
		const searchTerms = searchTerm.split(" ").filter((t) => t.length > 0);

		const results: Game[] = [];
		const targetLength = limit || allArcadeGames.value.length;

		for (
			let i = 0;
			i < allArcadeGames.value.length && results.length < targetLength;
			i++
		) {
			const game = allArcadeGames.value[i] as Game;

			const gameName = game?.name.toLowerCase();
			const gameCode = game?.gameCode.toLowerCase();

			if (gameName?.includes(searchTerm) || gameCode?.includes(searchTerm)) {
				results.push(game);
				continue;
			}

			if (game?.category.toLowerCase().includes(searchTerm)) {
				results.push(game);
				continue;
			}

			if (searchTerms.length > 1) {
				const searchableText = `${gameName} ${gameCode} ${game?.category}`;
				if (searchTerms.every((term) => searchableText.includes(term))) {
					results.push(game);
				}
			}
		}

		searchArcadeCache.set(cacheKey, results);

		if (searchArcadeCache.size > 50) {
			const firstKey = searchArcadeCache.keys().next().value as string;
			searchArcadeCache.delete(firstKey);
		}

		return results;
	};

	const filterArcadeGames = (options?: FilterOptions): Game[] => {
		let filteredGames = [...allArcadeGames.value];

		if (options?.searchTerm || searchArcadeTerm.value) {
			const term = options?.searchTerm || searchArcadeTerm.value;
			return searchArcadeGames(term, options?.limit);
		}

		if (
			options?.gameTypes?.length ||
			selectedArcadeGameTypes.value.length > 0
		) {
			const types = options?.gameTypes || selectedArcadeGameTypes.value;
			filteredGames = filteredGames.filter((game) => {
				return types.some((type) =>
					game.category
						.toLowerCase()
						.includes(type.toLowerCase().replace("Games", "")),
				);
			});
		}

		if (options?.category || selectedArcadeCategory.value) {
			const category = options?.category || selectedArcadeCategory.value;
			filteredGames = filteredGames.filter(
				(game) =>
					game.category === category ||
					game.categories?.some((cat) => cat.name === category),
			);
		}

		if (
			options?.provider !== undefined ||
			selectedArcadeProvider.value !== null
		) {
			const provider =
				options?.provider !== undefined
					? options.provider
					: selectedArcadeProvider.value;

			const slug =
				provider?.slug.toLowerCase() === "pragmatic"
					? "pp"
					: provider?.slug.toLowerCase() === "ion-slot"
						? "pgs"
						: provider?.slug.toLowerCase() === "funky-games"
							? "sbofunkygame"
							: provider?.slug.toLowerCase() === "vplus"
								? "slotmania"
								: provider?.slug.toLowerCase();

			filteredGames = filteredGames
				.filter(
					(game) =>
						game.link.split("/")[3]?.toLowerCase() ===
						slug?.replaceAll("-", "").toLowerCase(),
				)
				.slice(0, options?.limit);
		}

		if (options?.categorySlug !== undefined) {
			const slug =
				options?.categorySlug.toLowerCase() === "pragmatic"
					? "pp"
					: options?.categorySlug.toLowerCase() === "ion-slot"
						? "pgs"
						: options?.categorySlug.toLowerCase() === "funky-games"
							? "sbofunkygame"
							: options?.categorySlug.toLowerCase() === "vplus"
								? "slotmania"
								: options?.categorySlug;

			filteredGames = filteredGames
				.filter(
					(game) =>
						game.link.split("/")[3]?.toLowerCase() ===
						slug?.replaceAll("-", "").toLowerCase(),
				)
				.slice(0, options?.limit);
		}

		if (
			options?.filter !== undefined ||
			selectedArcadeFilter.value !== undefined
		) {
			const filter = options?.filter || selectedArcadeFilter.value;

			filteredGames = filteredGames
				.filter((game) =>
					game.categories?.some((val) =>
						val.name.toLowerCase().includes(filter?.toLowerCase() ?? ""),
					),
				)
				.slice(0, options?.limit);
		}

		if (options?.favouritesOnly || favouritesArcadeOnly.value) {
			filteredGames = filteredGames.filter((game) => game.isFavourite);
		}

		if (
			!options &&
			!searchArcadeTerm.value &&
			selectedArcadeGameTypes.value.length === 0 &&
			!selectedArcadeCategory.value &&
			!selectedArcadeProvider.value &&
			!favouritesArcadeOnly.value &&
			!selectedArcadeFilter.value
		) {
			filteredGames = filteredGames.slice(0, 12);
		}

		const currentSortBy = options?.sortBy || sortArcadeBy.value;
		const currentSortOrder = options?.sortOrder || sortArcadeOrder.value;

		if (currentSortBy !== "name" || currentSortOrder !== "asc") {
			filteredGames.sort((a, b) => {
				let aValue: any, bValue: any;

				switch (currentSortBy) {
					case "name":
						aValue = a.name;
						bValue = b.name;
						break;
					case "provider":
						aValue = a.provider;
						bValue = b.provider;
						break;
					case "category":
						aValue = a.category;
						bValue = b.category;
						break;
					case "favourites":
						aValue = a.isFavourite ? 0 : 1;
						bValue = b.isFavourite ? 0 : 1;
						break;
					default:
						aValue = a.name;
						bValue = b.name;
				}

				if (currentSortOrder === "asc") {
					return aValue > bValue ? 1 : -1;
				} else {
					return aValue < bValue ? 1 : -1;
				}
			});
		}

		return filteredGames;
	};

	const resetArcadeFilters = () => {
		searchArcadeTerm.value = "";
		selectedArcadeGameTypes.value = [];
		selectedArcadeCategory.value = "";
		selectedArcadeProvider.value = undefined;
		favouritesArcadeOnly.value = false;
		sortArcadeBy.value = "name";
		sortArcadeOrder.value = "asc";
		searchArcadeCache.clear();
	};

	const formatArcadeGameTypeName = (gameType: GameType): string => {
		return gameType
			.replace("Games", "")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
			.trim();
	};

	const uniqueArcadeCategories = computed(() => {
		const categories = new Set<string>();
		allArcadeGames.value.forEach((game) => {
			categories.add(game.category);
			game.categories?.forEach((cat) => categories.add(cat.name));
		});
		return Array.from(categories).sort();
	});

	const uniqueArcadeProviders = computed(() => {
		const providers = new Set<number>();
		allArcadeGames.value.forEach((game) => providers.add(game.provider));
		return Array.from(providers).sort((a, b) => a - b);
	});

	const baseImgUrl = computed(() => {
		return (link: string) => {
			return `https://d33egg70nrp50s.cloudfront.net/Images/providers-v2/${link.split("/")[3]}/`;
		};
	});

	const gameByArcadeCategorySlug = computed(() => {
		return (categorySlug: string, limit: number) => {
			const slug = categorySlug.replaceAll("-", "").toLowerCase();
			return allArcadeGames.value
				.filter((val) => val.link.split("/")[3]?.toLocaleLowerCase() === slug)
				.slice(0, limit);
		};
	});

	return {
		// Data
		allArcadeGames,
		searchArcadeTerm,
		selectedArcadeGameTypes,
		selectedArcadeCategory,
		selectedArcadeProvider,
		selectedArcadeCategorySlug,
		selectedArcadeFilter,
		favouritesArcadeOnly,
		sortArcadeBy,
		sortArcadeOrder,
		// Computed
		uniqueArcadeCategories,
		uniqueArcadeProviders,
		baseImgUrl,
		gameByArcadeCategorySlug,
		// Methods
		filterArcadeGames,
		searchArcadeGames,
		resetArcadeFilters,
		formatArcadeGameTypeName,
		// Convenience computed
		filteredArcadeGames: computed(() => filterArcadeGames()),
	};
};
