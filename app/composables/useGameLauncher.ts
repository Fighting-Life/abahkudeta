export const useGameLauncher = () => {
	const baeGameUrl = "https://kudetabet98mejackpot.net";
	const user = useSupabaseUser();
	const { $profileState, $event, $gameHistoryState } = useNuxtApp();
	const { addOrUpdateGameHystoryFromHistory, addOrUpdateGameHystory } =
		useGameHistory();

	const parseJavaScriptFunction = (jsFunction: string) => {
		if (!jsFunction.startsWith("javascript:")) {
			return null;
		}

		// Extract function call dan parameters
		const functionCall = jsFunction.replace("javascript:", "");

		// Match pattern: openNewTab('param1', 'param2')
		const match = functionCall.match(
			/openNewTab\(['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?\)/,
		);

		if (match) {
			return {
				url: match[1],
				title: match[2] || "Game",
			};
		}

		return null;
	};

	const openGameInNewTab = async (game: Game) => {
		const parsed = parseJavaScriptFunction(game.link);
		let finalTotalPlay = 0;
		const historyIndex = $gameHistoryState.value?.find(
			(item) => item.game_code === game.gameCode,
		);
		if (historyIndex?.total_play) {
			finalTotalPlay = historyIndex.total_play + 1;
		}

		if (parsed) {
			window.open(
				`${baeGameUrl}${parsed.url}`,
				"_blank",
				"noopener,noreferrer",
			);
			if (historyIndex) {
				await addOrUpdateGameHystory(
					historyIndex.id,
					game,
					finalTotalPlay,
					"update",
				);
			} else {
				await addOrUpdateGameHystory("", game, finalTotalPlay, "add");
			}
		} else {
			await navigateTo(game.link);
			if (historyIndex) {
				await addOrUpdateGameHystory(
					historyIndex.id,
					game,
					finalTotalPlay,
					"update",
				);
			} else {
				await addOrUpdateGameHystory("", game, finalTotalPlay, "add");
			}
		}
	};
	const launchGame = (game?: Game) => {
		if (!user.value) {
			$event("alert-login", true);
			return;
		}
		if ($profileState.value?.balance === "0") {
			$event("alert-deposit", true);
			return;
		}
		if (!game || !game.link) {
			console.error("Game link is missing");
			return;
		}

		try {
			openGameInNewTab(game);
		} catch (error) {
			console.error("Failed to launch game:", error);
		}
	};
	const openGameHistoryInNewTab = async (game: GameHistory) => {
		if (!game.game_link) {
			console.error("Game link is missing");
			return;
		}
		const parsed = parseJavaScriptFunction(game.game_link);
		let finalTotalPlay = 0;
		const historyIndex = $gameHistoryState.value?.find(
			(item) => item.game_code === game.game_code,
		);
		if (historyIndex?.total_play) {
			finalTotalPlay = historyIndex.total_play + 1;
		}

		if (parsed) {
			window.open(
				`${baeGameUrl}${parsed.url}`,
				"_blank",
				"noopener,noreferrer",
			);
			if (historyIndex) {
				await addOrUpdateGameHystoryFromHistory(
					historyIndex.id,
					game,
					finalTotalPlay,
					"update",
				);
			} else {
				await addOrUpdateGameHystoryFromHistory(
					"",
					game,
					finalTotalPlay,
					"add",
				);
			}
		} else {
			await navigateTo(game.game_link);
			if (historyIndex) {
				await addOrUpdateGameHystoryFromHistory(
					historyIndex.id,
					game,
					finalTotalPlay,
					"update",
				);
			} else {
				await addOrUpdateGameHystoryFromHistory(
					"",
					game,
					finalTotalPlay,
					"add",
				);
			}
		}
	};
	const launchGameHistory = (game?: GameHistory) => {
		if (!user.value) {
			$event("alert-login", true);
			return;
		}
		if ($profileState.value?.balance === "0") {
			$event("alert-deposit", true);
			return;
		}
		if (!game || !game.game_link) {
			console.error("Game link is missing");
			return;
		}

		try {
			openGameHistoryInNewTab(game);
		} catch (error) {
			console.error("Failed to launch game:", error);
		}
	};
	const openLinkInNewTab = async (link: string) => {
		const parsed = parseJavaScriptFunction(link);

		if (parsed) {
			window.open(
				`${baeGameUrl}${parsed.url}`,
				"_blank",
				"noopener,noreferrer",
			);
		} else {
			await navigateTo(link);
			// Fallback: langsung open link asli (tapi hati2 dengan XSS)
			// console.warn("Invalid game link format:", game.link);
		}
	};
	const launchLink = (link?: string) => {
		if (!user.value) {
			$event("alert-login", true);
			return;
		}
		if ($profileState.value?.balance === "0") {
			$event("alert-deposit", true);
			return;
		}
		if (!link) {
			console.error("Link is missing");
			return;
		}

		try {
			openLinkInNewTab(link);
		} catch (error) {
			console.error("Failed to launch game:", error);
		}
	};

	return {
		parseJavaScriptFunction,
		openGameInNewTab,
		openGameHistoryInNewTab,
		launchGame,
		launchGameHistory,
		openLinkInNewTab,
		launchLink,
	};
};
