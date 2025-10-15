export default defineNuxtPlugin(async (nuxtApp) => {
	const { fetchProfile, profileState, user, isAuthenticated, refreshProfile } =
		useProfiles();
	const { gameHistoryState, refreshGameHistory } = useGameHistory();

	// Fetch profile saat app initialize
	await fetchProfile();
	await refreshGameHistory();

	// Auto refresh pada route changes (optional)
	nuxtApp.hook("page:finish", async () => {
		await fetchProfile(true); // force refresh
		await refreshGameHistory();
		// Refresh pada navigasi tertentu
		// const route = useRoute();
		// if (route.path === "/dashboard" || route.path === "/wallet") {
		// 	await fetchProfile(true); // force refresh
		// }
	});
	return {
		provide: {
			// state
			user,
			profileState,
			isAuthenticated,
			gameHistoryState,
			// method
			refreshProfile,
			refreshGameHistory,
		},
	};
});
