export default defineNuxtPlugin(async (nuxtApp) => {
	const { fetchProfile } = useProfiles();

	// Fetch profile saat app initialize
	await fetchProfile();

	// Auto refresh pada route changes (optional)
	nuxtApp.hook("page:finish", async () => {
		await fetchProfile(true); // force refresh
		// Refresh pada navigasi tertentu
		// const route = useRoute();
		// if (route.path === "/dashboard" || route.path === "/wallet") {
		// 	await fetchProfile(true); // force refresh
		// }
	});
});
