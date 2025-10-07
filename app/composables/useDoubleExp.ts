export const useDoubleExp = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();

	// Get current active claim
	const getCurrentClaim = async () => {
		if (!user.value) return null;

		// Gunakan limit(1) + maybeSingle()
		const { data, error } = await supabase
			.from("double_exp_claims")
			.select("*")
			.eq("user_id", user.value.id)
			.eq("is_active", true)
			.gte("expires_at", new Date().toISOString())
			.order("claimed_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error && error.code !== "PGRST116") {
			// PGRST116 = not found
			console.error("Error:", error);
			return null;
		}

		return data;
	};

	// Check if can claim
	const canClaim = async () => {
		if (!user.value) return false;

		// Get last claim
		const { data: lastClaim } = await supabase
			.from("double_exp_claims")
			.select("next_claim_at")
			.eq("user_id", user.value.id)
			.order("claimed_at", { ascending: false })
			.limit(1)
			.single();

		if (!lastClaim) return true; // No previous claim, can claim

		const nextClaimTime = new Date(lastClaim.next_claim_at);
		const now = new Date();

		return now >= nextClaimTime;
	};

	// Claim Double EXP
	const claimDoubleExp = async () => {
		if (!user.value) {
			throw new Error("User not authenticated");
		}

		// Check if can claim
		const allowed = await canClaim();
		if (!allowed) {
			throw new Error("You must wait before claiming again");
		}

		const now = new Date();
		const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
		const nextClaimAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

		const { data, error } = await supabase
			.from("double_exp_claims")
			.insert({
				user_id: user.value.id,
				claimed_at: now.toISOString(),
				expires_at: expiresAt.toISOString(),
				next_claim_at: nextClaimAt.toISOString(),
				is_active: true,
			})
			.select()
			.single();

		if (error) throw error;

		return data as DoubleExpClaim;
	};

	// Get next claim time
	const getNextClaimTime = async () => {
		if (!user.value) return null;

		const { data } = await supabase
			.from("double_exp_claims")
			.select("next_claim_at")
			.eq("user_id", user.value.id)
			.order("claimed_at", { ascending: false })
			.limit(1)
			.single();

		return data?.next_claim_at ? new Date(data.next_claim_at) : null;
	};

	// Deactivate expired claims (run this on mount or interval)
	const deactivateExpiredClaims = async () => {
		if (!user.value) return;

		const { error } = await supabase
			.from("double_exp_claims")
			.update({ is_active: false })
			.eq("user_id", user.value.id)
			.eq("is_active", true)
			.lt("expires_at", new Date().toISOString());

		if (error) console.error("Error deactivating claims:", error);
	};

	return {
		getCurrentClaim,
		canClaim,
		claimDoubleExp,
		getNextClaimTime,
		deactivateExpiredClaims,
	};
};
