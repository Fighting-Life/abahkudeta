export default defineNuxtPlugin(() => {
	const user = useSupabaseUser();
	const timerTenMinute = 10 * 60 * 1000;
	const timerFiveMinute = 5 * 60 * 1000;
	const timerTwoMinute = 2 * 60 * 1000;
	const timerOneMinute = 60 * 1000;

	const { init, cleanup } = useAutoLogout(timerTenMinute);

	// Watch user state
	watch(
		user,
		(newUser) => {
			if (newUser) {
				// User logged in, start auto logout timer
				init();
			} else {
				// User logged out, cleanup timers
				cleanup();
			}
		},
		{ immediate: true },
	);

	// Cleanup on unmount
	if (import.meta.client) {
		window.addEventListener("beforeunload", () => {
			cleanup();
		});
	}
});
