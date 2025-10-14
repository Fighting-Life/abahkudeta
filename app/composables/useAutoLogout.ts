export const useAutoLogout = (inactivityTime: number = 5 * 60 * 1000) => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const router = useRouter();
	const { refreshProfile } = useProfiles();

	let inactivityTimer: NodeJS.Timeout | null = null;
	let warningTimer: NodeJS.Timeout | null = null;
	let countdownInterval: NodeJS.Timeout | null = null;

	const showWarning = ref(false);
	const countdown = ref(60); // 60 seconds warning before logout
	const warningTime = 60 * 1000; // 1 minute before logout, show warning

	// ==================== RESET TIMER ====================
	const resetTimer = () => {
		// Clear existing timers
		if (inactivityTimer) clearTimeout(inactivityTimer);
		if (warningTimer) clearTimeout(warningTimer);
		if (countdownInterval) clearInterval(countdownInterval);

		showWarning.value = false;
		countdown.value = 60;

		// Only set timer if user is logged in
		if (!user.value) return;

		// Set warning timer (1 minute before logout)
		warningTimer = setTimeout(() => {
			showWarning.value = true;
			countdown.value = 60;

			// Countdown timer
			countdownInterval = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					if (countdownInterval) clearInterval(countdownInterval);
				}
			}, 1000);
		}, inactivityTime - warningTime);

		// Set logout timer
		inactivityTimer = setTimeout(async () => {
			await handleAutoLogout();
		}, inactivityTime);
	};

	// ==================== HANDLE AUTO LOGOUT ====================
	const handleAutoLogout = async () => {
		try {
			// Clear all timers
			if (inactivityTimer) clearTimeout(inactivityTimer);
			if (warningTimer) clearTimeout(warningTimer);
			if (countdownInterval) clearInterval(countdownInterval);

			showWarning.value = false;

			// Logout from Supabase
			await supabase.auth.signOut({ scope: "global" });

			// Refresh profile (will set to null)
			await refreshProfile();

			// Redirect to home
			await router.push("/");
		} catch (error) {
			console.error("Auto logout error:", error);
		}
	};

	// ==================== ACTIVITY EVENTS ====================
	const activityEvents = [
		"mousedown",
		"mousemove",
		"keypress",
		"scroll",
		"touchstart",
		"click",
	];

	// ==================== SETUP LISTENERS ====================
	const setupListeners = () => {
		activityEvents.forEach((event) => {
			window.addEventListener(event, resetTimer, true);
		});
	};

	// ==================== REMOVE LISTENERS ====================
	const removeListeners = () => {
		activityEvents.forEach((event) => {
			window.removeEventListener(event, resetTimer, true);
		});
	};

	// ==================== INITIALIZE ====================
	const init = () => {
		if (!user.value) return;

		setupListeners();
		resetTimer();
	};

	// ==================== CLEANUP ====================
	const cleanup = () => {
		removeListeners();
		if (inactivityTimer) clearTimeout(inactivityTimer);
		if (warningTimer) clearTimeout(warningTimer);
		if (countdownInterval) clearInterval(countdownInterval);
	};

	// ==================== CANCEL AUTO LOGOUT ====================
	const cancelAutoLogout = () => {
		showWarning.value = false;
		resetTimer();
	};

	// ==================== FORCE LOGOUT ====================
	const forceLogout = async () => {
		await handleAutoLogout();
	};

	return {
		// State
		showWarning,
		countdown,

		// Methods
		init,
		cleanup,
		resetTimer,
		cancelAutoLogout,
		forceLogout,
	};
};
