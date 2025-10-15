// composables/useGameHistory.ts
export const useGameHistory = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const toast = useToast();
	const gameHistoryState = useState<GameHistory[]>("gameHistory", () => []);

	// Get user's game history
	const getGameHistory = async (options?: {
		limit?: number;
		offset?: number;
		sortBy?: "created_at" | "updated_at" | "total_play";
		sortOrder?: "asc" | "desc";
		category?: string;
		provider?: number;
		isFavourite?: boolean;
	}) => {
		try {
			if (!user.value) {
				return [];
			}

			let query = supabase
				.from("history_games")
				.select("*")
				.eq("user_id", user.value.id);

			// Apply filters
			if (options?.category) {
				query = query.eq("game_category", options.category);
			}

			if (options?.provider) {
				query = query.eq("game_provider", options.provider);
			}

			if (options?.isFavourite !== undefined) {
				query = query.eq("is_favourite", options.isFavourite);
			}

			// Apply sorting
			const sortBy = options?.sortBy || "created_at";
			const sortOrder = options?.sortOrder || "desc";
			query = query.order(sortBy, { ascending: sortOrder === "asc" });

			// Apply pagination
			if (options?.limit) {
				query = query.limit(options.limit);
			}

			if (options?.offset) {
				query = query.range(
					options.offset,
					options.offset + (options.limit || 10) - 1,
				);
			}

			const { data, error } = await query;

			if (error) {
				console.error("Get game history error:", error);
				// toast.error("Gagal mengambil riwayat game");
				return [];
			}
			gameHistoryState.value = data as GameHistory[];

			return data as GameHistory[];
		} catch (error: any) {
			console.error("Get game history error:", error);
			// toast.error("Gagal mengambil riwayat game");
			return [];
		}
	};

	const refreshGameHistory = async () => {
		return await getGameHistory({
			limit: 20,
			sortBy: "created_at",
			sortOrder: "desc",
		});
	};

	watch(
		() => user.value?.id,
		(newUserId, oldUserId) => {
			if (newUserId && newUserId !== oldUserId) {
				refreshGameHistory();
			} else if (!newUserId) {
				gameHistoryState.value = [];
			}
		},
		{ immediate: true },
	);

	// Add game history entry
	const addGameHistory = async (input: CreateGameHistoryInput) => {
		try {
			if (!user.value) {
				throw new Error("User not authenticated");
			}

			const { data, error } = await supabase
				.from("history_games")
				.insert({
					user_id: user.value.id,
					game_name: input.game_name,
					game_slug: input.game_slug,
					game_category: input.game_category,
					game_provider: input.game_provider,
					game_code: input.game_code,
					game_image: input.game_image,
					game_link: input.game_link,
					bet_amount: input.bet_amount || 0,
					win_amount: input.win_amount || 0,
					is_win: input.is_win || false,
					is_favourite: input.is_favourite || false,
					rtp_value: input.rtp_value || 0,
					total_play: 1, // Increment play count
				})
				.select()
				.single();

			if (error) throw error;

			// toast.success("Riwayat game berhasil ditambahkan");
			return data as GameHistory;
		} catch (error: any) {
			console.error("Add game history error:", error);
			// toast.error("Gagal menambahkan riwayat game");
			throw error;
		}
	};

	// Update game history
	const updateGameHistory = async (
		id: string,
		input: UpdateGameHistoryInput,
	) => {
		try {
			if (!user.value) {
				throw new Error("User not authenticated");
			}

			const { data, error } = await supabase
				.from("history_games")
				.update({
					...input,
					updated_at: new Date().toISOString(),
				})
				.eq("id", id)
				.eq("user_id", user.value.id) // Security: ensure user owns the record
				.select()
				.single();

			if (error) throw error;

			// toast.success("Riwayat game berhasil diperbarui");
			return data as GameHistory;
		} catch (error: any) {
			console.error("Update game history error:", error);
			// toast.error("Gagal memperbarui riwayat game");
			throw error;
		}
	};

	const addOrUpdateGameHystory = async (
		historyId: string,
		game: Game,
		totalPlay?: number,
		type: "add" | "update" = "add",
	) => {
		if (!user.value) {
			return;
		}
		if (type === "add") {
			await addGameHistory({
				game_name: game.name,
				game_category: game.category,
				game_provider: game.provider,
				game_code: game.gameCode,
				game_image: game.gameImage,
				game_link: game.link,
				total_play: totalPlay || 0,
			});
			await refreshGameHistory();
		} else if (type === "update") {
			await updateGameHistory(historyId, {
				total_play: totalPlay || 0,
			});
			await refreshGameHistory();
		}
	};

	const addOrUpdateGameHystoryFromHistory = async (
		historyId: string,
		game: GameHistory,
		totalPlay?: number,
		type: "add" | "update" = "add",
	) => {
		if (!user.value) {
			return;
		}
		if (type === "add") {
			await addGameHistory({
				game_name: game.game_name || "",
				game_category: game.game_category || "",
				game_provider: game.game_provider || 0,
				game_code: game.game_code || "",
				game_image: game.game_image || "",
				game_link: game.game_link || "",
				total_play: totalPlay || 0,
			});
			await refreshGameHistory();
		} else if (type === "update") {
			await updateGameHistory(historyId, {
				total_play: totalPlay || 0,
			});
			await refreshGameHistory();
		}
	};

	// Toggle favourite status
	const toggleFavourite = async (id: string, isFavourite: boolean) => {
		return await updateGameHistory(id, { is_favourite: isFavourite });
	};

	// Record game play (increment play count)
	const recordGamePlay = async (
		id: string,
		betAmount?: number,
		winAmount?: number,
	) => {
		try {
			if (!user.value) {
				throw new Error("User not authenticated");
			}

			// First get current values
			const { data: current } = await supabase
				.from("history_games")
				.select("total_play, bet_amount, win_amount")
				.eq("id", id)
				.eq("user_id", user.value.id)
				.single();

			if (!current) {
				throw new Error("Game history not found");
			}

			const updates: any = {
				total_play: (current.total_play || 0) + 1,
				updated_at: new Date().toISOString(),
			};

			if (betAmount !== undefined) {
				updates.bet_amount = (current.bet_amount || 0) + betAmount;
			}

			if (winAmount !== undefined) {
				updates.win_amount = (current.win_amount || 0) + winAmount;
				updates.is_win = winAmount > 0;
			}

			const { data, error } = await supabase
				.from("history_games")
				.update(updates)
				.eq("id", id)
				.eq("user_id", user.value.id)
				.select()
				.single();

			if (error) throw error;

			return data as GameHistory;
		} catch (error: any) {
			console.error("Record game play error:", error);
			throw error;
		}
	};

	// Get game history statistics
	const getGameHistoryStats = async () => {
		try {
			if (!user.value) {
				throw new Error("User not authenticated");
			}

			const { data, error } = await supabase
				.from("history_games")
				.select("*")
				.eq("user_id", user.value.id);

			if (error) throw error;

			const history = data as GameHistory[];

			const stats: GameHistoryStats = {
				total_plays: history.reduce(
					(sum, game) => sum + (game.total_play || 0),
					0,
				),
				total_bet_amount: history.reduce(
					(sum, game) => sum + (game.bet_amount || 0),
					0,
				),
				total_win_amount: history.reduce(
					(sum, game) => sum + (game.win_amount || 0),
					0,
				),
				favourite_games: history.filter((game) => game.is_favourite).length,
				win_rate:
					history.length > 0
						? (history.filter((game) => game.is_win).length / history.length) *
							100
						: 0,
				most_played_game:
					history.length > 0
						? history.reduce((prev, current) =>
								(prev.total_play || 0) > (current.total_play || 0)
									? prev
									: current,
							).game_name
						: "Tidak ada data",
			};

			return stats;
		} catch (error: any) {
			console.error("Get game history stats error:", error);
			// toast.error("Gagal mengambil statistik game");
			throw error;
		}
	};

	// Get favourite games
	const getFavouriteGames = async (limit?: number) => {
		return await getGameHistory({
			isFavourite: true,
			sortBy: "updated_at",
			sortOrder: "desc",
			limit: limit || 10,
		});
	};

	// Search game history
	const searchGameHistory = async (searchTerm: string) => {
		try {
			if (!user.value) {
				throw new Error("User not authenticated");
			}

			const { data, error } = await supabase
				.from("history_games")
				.select("*")
				.eq("user_id", user.value.id)
				.or(
					`game_name.ilike.%${searchTerm}%,game_category.ilike.%${searchTerm}%,game_provider.ilike.%${searchTerm}%`,
				)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return data as GameHistory[];
		} catch (error: any) {
			console.error("Search game history error:", error);
			// toast.error("Gagal mencari riwayat game");
			throw error;
		}
	};

	return {
		gameHistoryState,
		getGameHistory,
		refreshGameHistory,
		addGameHistory,
		updateGameHistory,
		addOrUpdateGameHystory,
		addOrUpdateGameHystoryFromHistory,
		toggleFavourite,
		recordGamePlay,
		getGameHistoryStats,
		getFavouriteGames,
		searchGameHistory,
	};
};
