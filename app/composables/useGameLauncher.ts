export const useGameLauncher = () => {
	const baeGameUrl = "https://kudetabet98mejackpot.net";
	const user = useSupabaseUser();
	const { profileBase } = useProfiles();
	const { $event } = useNuxtApp();

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

	// Function untuk open new tab
	const openGameInNewTab = async (gameLink: string) => {
		const parsed = parseJavaScriptFunction(gameLink);

		if (parsed) {
			window.open(
				`${baeGameUrl}${parsed.url}`,
				"_blank",
				"noopener,noreferrer",
			);
		} else {
			await navigateTo(gameLink);
			// Fallback: langsung open link asli (tapi hati2 dengan XSS)
			// console.warn("Invalid game link format:", gameLink);
		}
	};

	// Function untuk open game dengan safety check
	const launchGame = (link?: string) => {
		if (!user.value) {
			$event("alert-login", true);
			return;
		}
		if (profileBase.value?.balance === "0") {
			$event("alert-deposit", true);
			return;
		}
		if (!link) {
			console.error("Game link is missing");
			return;
		}

		try {
			openGameInNewTab(link);
		} catch (error) {
			console.error("Failed to launch game:", error);
		}
	};

	return {
		parseJavaScriptFunction,
		openGameInNewTab,
		launchGame,
	};
};
