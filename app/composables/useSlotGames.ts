export type FilterType =
	| "Semua permainan"
	| "Top 20"
	| "New"
	| "Classic"
	| "Bonus Buy"
	| "Reel kingdom"
	| "Megaways"
	| "Jackpot Play Games"
	| "Video Slots";

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

export const useSlotGames = () => {
	const searchCache = new Map<string, Game[]>();

	const allGames = ref<Game[]>([
		...PrgamaticGames,
		...AdvatPlayGames,
		...FachaiGames,
		...FastSpinGames,
		...FatPandaGames,
		...FiveGgGames,
		...HabaneroGames,
		...HacksawGames,
		...JiliGames,
		...JokerGames,
		...KingMadasGames,
		...MicroGamingGames,
		...NagaGames,
		...NoLimitCityGames,
		...PgSoftGames,
		...PlayTechGames,
		...Slot88Games,
		...SlotManiaGames,
		...SmartSoftGames,
		...SpadeGamingGames,
		...PlayNGoGames,
		...YggdrasilGames,
		...SkyWIndGames,
		...RedTigerGames,
		...BigTimeGames,
		...NetentGames,
		...OnlyPlayGames,
		...CQ9Games,
		...JDBGames,
		...PlayStarGames,
		...SpinixGames,
		...CrowdPlayGames,
		...IonSlotGames,
		...BigSpotGames,
		...VPowerGames,
		...AMBGames,
		...WorldmatchGames,
		...OctoPlayGames,
		...MarioClubGames,
		...DragoonsoftGames,
		...FunGamingGames,
		...FunkyGames,
		...Live22Games,
		...PPCasinoGames,
		...AviatorGames,
		...CrashSmartsoft,
		...CrashMicroGaming,
		...CrashSpinixGames,
		...GeminiGames,
		...AdvantPlayMiniGames,
		...CrashSpadeGaming,
		...CrashOnlyPlayGames,
		...CrashJokerGames,
		...CrashDragoonsoftGames,
		...CrashFunkyGames,
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
		...RaceMarblexGames,
	]);

	const searchTerm = ref<string | undefined>(undefined);
	const selectedGameTypes = ref<GameType[]>([]);
	const selectedCategory = ref("");
	const selectedProvider = ref<Partner | undefined>(undefined);
	const selectedCategorySlug = ref("pp");
	const selectedFilter = ref<FilterType | undefined>(undefined);
	const favouritesOnly = ref(false);
	const sortBy = ref<"name" | "provider" | "category" | "favourites">("name");
	const sortOrder = ref<"asc" | "desc">("asc");

	const searchGames = (terms?: string, limit?: number): Game[] => {
		if (!terms || !terms.trim()) {
			return limit ? allGames.value.slice(0, limit) : allGames.value;
		}

		const cacheKey = `${terms.toLowerCase()}-${limit || "all"}`;
		if (searchCache.has(cacheKey)) {
			return searchCache.get(cacheKey)!;
		}

		const searchTerm = terms.toLowerCase().trim();
		const searchTerms = searchTerm.split(" ").filter((t) => t.length > 0);

		const results: Game[] = [];
		const targetLength = limit || allGames.value.length;

		for (
			let i = 0;
			i < allGames.value.length && results.length < targetLength;
			i++
		) {
			const game = allGames.value[i] as Game;

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

		searchCache.set(cacheKey, results);

		if (searchCache.size > 50) {
			const firstKey = searchCache.keys().next().value as string;
			searchCache.delete(firstKey);
		}

		return results;
	};

	const filterGames = (options?: FilterOptions): Game[] => {
		let filteredGames = [...allGames.value];

		if (options?.searchTerm || searchTerm.value) {
			const term = options?.searchTerm || searchTerm.value;
			return searchGames(term, options?.limit);
		}

		if (options?.gameTypes?.length || selectedGameTypes.value.length > 0) {
			const types = options?.gameTypes || selectedGameTypes.value;
			filteredGames = filteredGames.filter((game) => {
				return types.some((type) =>
					game.category
						.toLowerCase()
						.includes(type.toLowerCase().replace("Games", "")),
				);
			});
		}

		if (options?.category || selectedCategory.value) {
			const category = options?.category || selectedCategory.value;
			filteredGames = filteredGames.filter(
				(game) =>
					game.category === category ||
					game.categories?.some((cat) => cat.name === category),
			);
		}

		if (options?.provider !== undefined || selectedProvider.value !== null) {
			const provider =
				options?.provider !== undefined
					? options.provider
					: selectedProvider.value;

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

		if (options?.filter !== undefined || selectedFilter.value !== undefined) {
			const filter = options?.filter || selectedFilter.value;

			filteredGames = filteredGames
				.filter((game) =>
					game.categories?.some((val) =>
						val.name.toLowerCase().includes(filter?.toLowerCase() ?? ""),
					),
				)
				.slice(0, options?.limit);
		}

		if (options?.favouritesOnly || favouritesOnly.value) {
			filteredGames = filteredGames.filter((game) => game.isFavourite);
		}

		if (
			!options &&
			!searchTerm.value &&
			selectedGameTypes.value.length === 0 &&
			!selectedCategory.value &&
			!selectedProvider.value &&
			!favouritesOnly.value &&
			!selectedFilter.value
		) {
			filteredGames = filteredGames.slice(0, 12);
		}

		const currentSortBy = options?.sortBy || sortBy.value;
		const currentSortOrder = options?.sortOrder || sortOrder.value;

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

	const resetFilters = () => {
		searchTerm.value = "";
		selectedGameTypes.value = [];
		selectedCategory.value = "";
		selectedProvider.value = undefined;
		favouritesOnly.value = false;
		sortBy.value = "name";
		sortOrder.value = "asc";
		searchCache.clear();
	};

	const formatGameTypeName = (gameType: GameType): string => {
		return gameType
			.replace("Games", "")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
			.trim();
	};

	const getCategoryName = (gameType: GameType): string => {
		const nameMap: Record<GameType, string> = {
			PrgamaticGames: "Pragmatic Play",
			AdvatPlayGames: "Advant Play",
			FachaiGames: "Fachai",
			FastSpinGames: "Fast Spin",
			FatPandaGames: "Fat Panda",
			FiveGgGames: "Five GG",
			HabaneroGames: "Habanero",
			HacksawGames: "Hacksaw",
			JiliGames: "JILI",
			JokerGames: "Joker",
			KingMadasGames: "King Madas",
			MicroGamingGames: "Microgaming",
			NagaGames: "Naga Games",
			NoLimitCityGames: "No Limit City",
			PgSoftGames: "PG Soft",
			PlayTechGames: "Playtech",
			Slot88Games: "Slot88",
			SlotManiaGames: "Slot Mania",
			SmartSoftGames: "Smartsoft",
			SpadeGamingGames: "Spade Gaming",
			PlayNGoGames: "Play'n Go",
			YggdrasilGames: "Yggdrasil",
			SkyWIndGames: "Skywind",
			RedTigerGames: "Red Tiger",
			BigTimeGames: "Big Time Gaming",
			NetentGames: "Netent",
			OnlyPlayGames: "Only Play",
			CQ9Games: "CQ9",
			JDBGames: "JDB",
			PlayStarGames: "Playstar",
			SpinixGames: "Spinix",
			CrowdPlayGames: "Crowd Play",
			IonSlotGames: "ION Slot",
			BigSpotGames: "Bigspot",
			VPowerGames: "VPower",
			AMBGames: "AMB Slot",
			WorldmatchGames: "Worldmatch",
			OctoPlayGames: "OctoPlay",
			MarioClubGames: "Mario Club",
			DragoonsoftGames: "Dragoonsoft",
			FunGamingGames: "Fun Gaming",
			FunkyGames: "Funky Games",
			Live22Games: "Live22",
			PPCasinoGames: "PP Casino",
			AviatorGames: "Aviator",
			CrashMicroGaming: "Microgaming",
			CrashSmartsoft: "Smartsoft",
			CrashSpinixGames: "Spinix",
			GeminiGames: "Gemini",
			AdvantPlayMiniGames: "AdvantPlay Mini Game",
			CrashSpadeGaming: "Spade Gaming",
			CrashOnlyPlayGames: "Only Play",
			CrashJokerGames: "Joker",
			CrashDragoonsoftGames: "Dragoonsoft",
			CrashFunkyGames: "Funky Games",
			ArcadePPGames: "Pragmatic Play",
			ArcadeMigrogamingGames: "Migro Gaming",
			ArcadeHackSawGames: "Hacksaw",
			AracdeKingMidasGames: "King Midas",
			ArcadeJiliGames: "JILI",
			ArcadeGeminiGames: "Gemini",
			ArcadeAviatorGames: "Aviator",
			ArcadeFachaiGames: "Fachai",
			ArcadeSpinixGames: "Spinix",
			ArcadeJokerGames: "Joker",
			ArcadeBtGamingGames: "Bt Gaming",
			ArcadeAMBGames: "AMB Slot",
			ArcadeCrowdPlayGames: "Crowd Play",
			AraceVPowerGames: "VPower",
			ArcadeWorldmatchGames: "Worldmatch",
			ArcadeMarioClubGames: "Mario Club",
			ArcadeDragoonsoftGames: "Dragoonsoft",
			ArcadeCQ9Games: "CQ9",
			ArcadeFunGamingGames: "Fun Gaming",
			ArcadeMMTangkasGames: "MM Tangkas",
			ArcadeSkywindGames: "Skywind",
			ArcadeJDBGames: "JDB",
			ArcadeFungkyGames: "Funky Games",
			RaceMarblexGames: "Marblex",
		};

		return nameMap[gameType] || formatGameTypeName(gameType);
	};

	const uniqueCategories = computed(() => {
		const categories = new Set<string>();
		allGames.value.forEach((game) => {
			categories.add(game.category);
			game.categories?.forEach((cat) => categories.add(cat.name));
		});
		return Array.from(categories).sort();
	});

	const uniqueProviders = computed(() => {
		const providers = new Set<number>();
		allGames.value.forEach((game) => providers.add(game.provider));
		return Array.from(providers).sort((a, b) => a - b);
	});

	const baseImgUrl = computed(() => {
		return (link: string) => {
			return `https://d33egg70nrp50s.cloudfront.net/Images/providers-v2/${link.split("/")[3]}/`;
		};
	});

	const categoryName = computed(() => {
		return (link: string) => {
			const name: ShorcutGame = link.split("/")[3] as ShorcutGame;
			const nameMap: Record<ShorcutGame, GameType> = {
				PP: "PrgamaticGames",
				ADVANTPLAY: "AdvatPlayGames",
				FACHAI: "FachaiGames",
				FASTSPIN: "FastSpinGames",
				FATPANDA: "FatPandaGames",
				FIVEGG: "FiveGgGames",
				HABANERO: "HabaneroGames",
				HACKSAW: "HacksawGames",
				JILI: "JiliGames",
				JOKER: "JokerGames",
				KINGMIDAS: "KingMadasGames",
				MICROGAMING: "MicroGamingGames",
				NAGAGAMES: "NagaGames",
				NOLIMITCITY: "NoLimitCityGames",
				PGSOFT: "PgSoftGames",
				PLAYTECH: "PlayTechGames",
				SLOT88: "Slot88Games",
				SLOTMANIA: "SlotManiaGames",
				SMARTSOFT: "SmartSoftGames",
				SPADEGAMING: "SpadeGamingGames",
				PLAYNGO: "PlayNGoGames",
				YGGDRASIL: "YggdrasilGames",
				SKYWIND: "SkyWIndGames",
				REDTIGER: "RedTigerGames",
				BIGTIMEGAMING: "BigTimeGames",
				NETENT: "NagaGames",
				ONLYPLAY: "OnlyPlayGames",
				SBOCQ9: "CQ9Games",
				JDB: "JDBGames",
				PLAYSTAR: "PlayStarGames",
				SPINIX: "SpinixGames",
				CROWDPLAY: "CrowdPlayGames",
				PGS: "IonSlotGames",
				BIGPOT: "BigSpotGames",
				VPOWER: "VPowerGames",
				AMB: "AMBGames",
				WORLDMATCH: "WorldmatchGames",
				OCTOPLAY: "OctoPlayGames",
				MARIOCLUB: "MarioClubGames",
				DRAGOONSOFT: "DragoonsoftGames",
				FUNGAMING: "FunGamingGames",
				SBOFUNKYGAME: "FunkyGames",
				LIVE22: "Live22Games",
				PPLIVECASINO: "PPCasinoGames",
				SPRIBE: "AviatorGames",
				GEMINI: "GeminiGames",
				ADVANTPLAYMINIGAME: "AdvantPlayMiniGames",
				G8TANGKAS: "ArcadeMMTangkasGames",
				BTGAMING: "ArcadeBtGamingGames",
				MARBLEX: "RaceMarblexGames",
			};

			return formatGameTypeName(nameMap[name] || "PrgamaticGames");
		};
	});

	const gameByCategorySlug = computed(() => {
		return (categorySlug: string, limit: number) => {
			const slug = categorySlug.replaceAll("-", "").toLowerCase();
			return allGames.value
				.filter((val) => val.link.split("/")[3]?.toLocaleLowerCase() === slug)
				.slice(0, limit);
		};
	});

	return {
		// Data
		allGames,
		searchTerm,
		selectedGameTypes,
		selectedCategory,
		selectedProvider,
		selectedCategorySlug,
		selectedFilter,
		favouritesOnly,
		sortBy,
		sortOrder,
		// Computed
		uniqueCategories,
		uniqueProviders,
		baseImgUrl,
		categoryName,
		gameByCategorySlug,
		// Methods
		filterGames,
		searchGames,
		resetFilters,
		getCategoryName,
		formatGameTypeName,
		// Convenience computed
		filteredGames: computed(() => filterGames()),
	};
};
