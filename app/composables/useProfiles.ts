export const useProfiles = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	// Global state for profile
	const profileState = useState<Profile | null | undefined>(
		"user-profile-global",
		() => undefined,
	);
	const loadingState = useState<boolean>("user-profile-loading", () => false);
	const errorState = useState<string | null>("user-profile-error", () => null);

	const fetchProfile = async (forceRefresh: boolean = false) => {
		const userId = user.value?.id;

		if (!userId) {
			profileState.value = null;
			return null;
		}

		// Skip if already loading and not force refresh
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

			if (error) throw error;

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
		() => user.value?.id,
		(newUserId, oldUserId) => {
			if (newUserId && newUserId !== oldUserId) {
				fetchProfile();
			} else if (!newUserId) {
				profileState.value = null;
			}
		},
		{ immediate: true },
	);

	const profile = computed(() => profileState.value);
	const loading = computed(() => loadingState.value);
	const error = computed(() => errorState.value);
	const isAuthenticated = computed(() => !!user.value && !!profileState.value);

	const refreshProfile = async () => {
		return await fetchProfile(true);
	};
	const createProfile = async (profileData: ProfileInsert) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.insert(profileData)
				.select()
				.single();

			if (error) throw error;

			// Update state if it's current user's profile
			if (data.id === user.value?.id) {
				profileState.value = data;
			}

			return data;
		} catch (error: any) {
			console.error("Create profile error:", error);
			throw error;
		}
	};
	const updateProfile = async (userId: string, updates: ProfileUpdate) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.update(updates)
				.eq("id", userId)
				.select()
				.single();

			if (error) throw error;

			// Update state if it's current user's profile
			if (data.id === user.value?.id) {
				profileState.value = data;
			}

			return data;
		} catch (error: any) {
			console.error("Update profile error:", error);
			throw error;
		}
	};
	const upsertProfile = async (profileData: ProfileInsert) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.upsert(profileData, { onConflict: "id" })
				.select()
				.single();

			if (error) throw error;

			// Update state if it's current user's profile
			if (data.id === user.value?.id) {
				profileState.value = data;
			}

			return data;
		} catch (error: any) {
			console.error("Upsert profile error:", error);
			throw error;
		}
	};
	const getProfile = async (userId: string): Promise<Profile | null> => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) throw error;
			return data;
		} catch (error: any) {
			console.error("Get profile error:", error);
			return null;
		}
	};
	const checkUsername = async (username: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", username)
				.maybeSingle();

			if (error && error.code !== "PGRST116") throw error;

			return !data; // true if available
		} catch (error: any) {
			console.error("Check username error:", error);
			return false;
		}
	};
	const checkEmail = async (email: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("email")
				.eq("email", email)
				.maybeSingle();

			if (error && error.code !== "PGRST116") throw error;

			return !data; // true if available
		} catch (error: any) {
			console.error("Check email error:", error);
			return false;
		}
	};
	const checkReferralCode = async (code: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("referral_code")
				.eq("referral_code", code)
				.maybeSingle();

			if (error && error.code !== "PGRST116") throw error;

			return !!data; // true if valid
		} catch (error: any) {
			console.error("Check referral code error:", error);
			return false;
		}
	};
	const updateBalance = async (userId: string, newBalance: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.update({ balance: newBalance })
				.eq("id", userId)
				.select()
				.single();

			if (error) throw error;

			// Update state if it's current user
			if (data.id === user.value?.id) {
				profileState.value = data;
			}

			return data;
		} catch (error: any) {
			console.error("Update balance error:", error);
			throw error;
		}
	};

	return {
		// State
		user,
		profile,
		profileState,
		loading,
		loadingState,
		error,
		errorState,
		isAuthenticated,

		// Methods
		fetchProfile,
		refreshProfile,
		createProfile,
		updateProfile,
		upsertProfile,
		getProfile,
		updateBalance,

		// Validation
		checkUsername,
		checkEmail,
		checkReferralCode,
	};
};
