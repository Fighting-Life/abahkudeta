export const useProfiles = () => {
	const supabase = useSupabaseClient<Database>();
	const userBase = useSupabaseUser();

	const profileState = useState<Profile | null | undefined>(
		"user-profile-global",
		() => undefined, // undefined untuk initial state (belum di-fetch)
	);
	const loadingState = useState<boolean>("user-profile-loading", () => false);
	const errorState = useState<string | null>("user-profile-error", () => null);
	const fetchProfile = async (forceRefresh: boolean = false) => {
		const userId = userBase.value?.id;

		if (!userId) {
			profileState.value = null;
			return null;
		}

		// Skip jika sudah loading dan bukan force refresh
		if (loadingState.value && !forceRefresh) {
			return profileState.value;
		}

		loadingState.value = true;
		errorState.value = null;

		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				throw error;
			}

			profileState.value = data;
			return data;
		} catch (error: any) {
			console.error("Failed to fetch user profile:", error);
			errorState.value = error.message;
			profileState.value = null;
			return null;
		} finally {
			loadingState.value = false;
		}
	};

	watch(
		() => userBase.value?.id,
		(newUserId, oldUserId) => {
			if (newUserId && newUserId !== oldUserId) {
				fetchProfile();
			} else if (!newUserId) {
				// Clear profile ketika user logout
				profileState.value = null;
			}
		},
		{ immediate: true },
	);

	// Refresh function untuk manual refresh
	const refreshProfile = async () => {
		return await fetchProfile(true);
	};

	// Computed properties untuk easy access
	const profileBase = computed(() => profileState.value);
	const loading = computed(() => loadingState.value);
	const error = computed(() => errorState.value);
	const isAuthenticated = computed(
		() => !!userBase.value && !!profileState.value,
	);

	// Create Profile
	const createProfile = async (profile: ProfileInsert) => {
		const { data, error } = await supabase
			.from("profiles")
			.insert(profile)
			.select()
			.single();

		if (error) throw error;
		return data;
	};

	// Upsert Profile (Insert or Update)
	const upsertProfile = async (profile: ProfileInsert) => {
		const { data, error } = await supabase
			.from("profiles")
			.upsert(profile, { onConflict: "id" })
			.select()
			.single();

		if (error) throw error;
		return data;
	};

	// Get Profile by ID
	const getProfile = async (userId: string): Promise<Profile | null> => {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();

		if (error) return null;
		return data;
	};

	// Update Profile
	const updateProfile = async (userId: string, updates: ProfileUpdate) => {
		const { data, error } = await supabase
			.from("profiles")
			.update(updates)
			.eq("id", userId)
			.select()
			.single();

		if (error) throw error;
		return data;
	};

	// Check Email Availability (untuk auth.users)
	const checkEmail = async (email: string) => {
		try {
			// Check di auth.users via RPC atau manual check
			const { data: authData } = await supabase.auth.admin.listUsers();
			const emailExists = authData?.users?.some((user) => user.email === email);

			// Jika tidak ada admin access, check di profiles
			if (!authData) {
				const { data, error } = await supabase
					.from("profiles")
					.select("username")
					.eq("username", email)
					.maybeSingle();

				return !data; // true jika available
			}

			return !emailExists; // true jika available
		} catch (error) {
			// Fallback: check di profiles table
			const { data } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", email)
				.maybeSingle();

			return !data; // true jika available
		}
	};

	// Check Username Availability
	const checkUsername = async (username: string) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("username")
			.eq("username", username)
			.maybeSingle();

		return !data; // true jika available
	};

	// Check Referral Code
	const checkReferralCode = async (code: string) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("referral_code")
			.eq("referral_code", code)
			.maybeSingle();

		return !!data; // true jika valid
	};

	return {
		userBase,
		profileBase,
		loading,
		error,
		isAuthenticated,
		profileState,
		loadingState,
		errorState,
		fetchProfile,
		refreshProfile,
		createProfile,
		upsertProfile,
		getProfile,
		updateProfile,
		checkEmail, // ← NEW: check email availability
		checkUsername, // ← check username availability
		checkReferralCode,
	};
};
