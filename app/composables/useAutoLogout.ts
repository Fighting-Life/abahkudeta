export const useAutoLogout = (inactivityTime: number = 5 * 60 * 1000) => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const router = useRouter();
	const toast = useToast();
	const { refreshProfile } = useProfiles();

	let inactivityTimer: NodeJS.Timeout | null = null;
	let warningTimer: NodeJS.Timeout | null = null;
	let countdownInterval: NodeJS.Timeout | null = null;

	const showWarning = ref(false);
	const countdown = ref(60); // 60 detik warning sebelum logout
	const warningTime = 60 * 1000; // 1 menit sebelum logout, show warning

	// Reset timer saat ada aktivitas
	const resetTimer = () => {
		// Clear existing timers
		if (inactivityTimer) clearTimeout(inactivityTimer);
		if (warningTimer) clearTimeout(warningTimer);
		if (countdownInterval) clearInterval(countdownInterval);

		showWarning.value = false;
		countdown.value = 60;

		// Hanya set timer jika user logged in
		if (!user.value) return;

		// Set warning timer (1 menit sebelum logout)
		warningTimer = setTimeout(() => {
			showWarning.value = true;
			countdown.value = 60;

			// Countdown timer
			countdownInterval = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					clearInterval(countdownInterval!);
				}
			}, 1000);

			// toast.warning(
			// 	"Anda akan logout otomatis dalam 1 menit karena tidak ada aktivitas",
			// );
		}, inactivityTime - warningTime);

		// Set logout timer
		inactivityTimer = setTimeout(async () => {
			await handleAutoLogout();
		}, inactivityTime);
	};

	// Handle auto logout
	const handleAutoLogout = async () => {
		try {
			// Clear all timers
			if (inactivityTimer) clearTimeout(inactivityTimer);
			if (warningTimer) clearTimeout(warningTimer);
			if (countdownInterval) clearInterval(countdownInterval);

			showWarning.value = false;

			// Logout from Supabase
			await supabase.auth.signOut({ scope: "global" });
			await refreshProfile();
			// Redirect to home
			await router.push("/");

			// Show notification
			// toast.info(
			// 	"Anda telah logout otomatis karena tidak ada aktivitas selama 5 menit",
			// );
		} catch (error) {
			console.error("Auto logout error:", error);
		}
	};

	// Activity events to track
	const activityEvents = [
		"mousedown",
		"mousemove",
		"keypress",
		"scroll",
		"touchstart",
		"click",
	];

	// Setup event listeners
	const setupListeners = () => {
		activityEvents.forEach((event) => {
			window.addEventListener(event, resetTimer, true);
		});
	};

	// Remove event listeners
	const removeListeners = () => {
		activityEvents.forEach((event) => {
			window.removeEventListener(event, resetTimer, true);
		});
	};

	// Initialize
	const init = () => {
		if (!user.value) return;

		setupListeners();
		resetTimer();
	};

	// Cleanup
	const cleanup = () => {
		removeListeners();
		if (inactivityTimer) clearTimeout(inactivityTimer);
		if (warningTimer) clearTimeout(warningTimer);
		if (countdownInterval) clearInterval(countdownInterval);
	};

	// Cancel auto logout (user stays active)
	const cancelAutoLogout = () => {
		showWarning.value = false;
		resetTimer();
		// toast.success("Logout otomatis dibatalkan");
	};

	return {
		init,
		cleanup,
		resetTimer,
		cancelAutoLogout,
		showWarning,
		countdown,
	};
};
