export const useDoubleExp = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const toast = useToast();

	// ==================== GET CURRENT CLAIM ====================
	const getCurrentClaim = async () => {
		if (!user.value) return null;

		try {
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
				console.error("Get current claim error:", error);
				return null;
			}

			return data;
		} catch (error: any) {
			console.error("Get current claim error:", error);
			return null;
		}
	};

	// ==================== CHECK IF CAN CLAIM ====================
	const canClaim = async (): Promise<boolean> => {
		if (!user.value) return false;

		try {
			// Get last claim
			const { data: lastClaim, error } = await supabase
				.from("double_exp_claims")
				.select("next_claim_at")
				.eq("user_id", user.value.id)
				.order("claimed_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (error && error.code !== "PGRST116") {
				console.error("Check can claim error:", error);
				return false;
			}

			if (!lastClaim) return true; // No previous claim

			const nextClaimTime = new Date(lastClaim.next_claim_at);
			const now = new Date();

			return now >= nextClaimTime;
		} catch (error: any) {
			console.error("Check can claim error:", error);
			return false;
		}
	};

	// ==================== CLAIM DOUBLE EXP ====================
	const claimDoubleExp = async () => {
		if (!user.value) {
			throw new Error("User not authenticated");
		}

		try {
			// Check if can claim
			const allowed = await canClaim();
			if (!allowed) {
				throw new Error("Anda harus menunggu 24 jam sebelum claim lagi");
			}

			const now = new Date();
			const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
			const nextClaimAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

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

			toast.success("Double EXP berhasil di-claim! Aktif selama 1 jam.");

			return data as DoubleExpClaim;
		} catch (error: any) {
			console.error("Claim double exp error:", error);
			toast.error(error.message || "Gagal claim Double EXP");
			throw error;
		}
	};

	// ==================== GET NEXT CLAIM TIME ====================
	const getNextClaimTime = async (): Promise<Date | null> => {
		if (!user.value) return null;

		try {
			const { data, error } = await supabase
				.from("double_exp_claims")
				.select("next_claim_at")
				.eq("user_id", user.value.id)
				.order("claimed_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			if (error && error.code !== "PGRST116") {
				console.error("Get next claim time error:", error);
				return null;
			}

			return data?.next_claim_at ? new Date(data.next_claim_at) : null;
		} catch (error: any) {
			console.error("Get next claim time error:", error);
			return null;
		}
	};

	// ==================== DEACTIVATE EXPIRED CLAIMS ====================
	const deactivateExpiredClaims = async () => {
		if (!user.value) return;

		try {
			const { error } = await supabase
				.from("double_exp_claims")
				.update({ is_active: false })
				.eq("user_id", user.value.id)
				.eq("is_active", true)
				.lt("expires_at", new Date().toISOString());

			if (error) {
				console.error("Deactivate expired claims error:", error);
			}
		} catch (error: any) {
			console.error("Deactivate expired claims error:", error);
		}
	};

	// ==================== GET TIME REMAINING ====================
	const getTimeRemaining = (expiresAt: string): number => {
		const now = new Date().getTime();
		const expiry = new Date(expiresAt).getTime();
		return Math.max(0, expiry - now);
	};

	// ==================== GET COUNTDOWN ====================
	const getCountdown = (
		milliseconds: number,
	): {
		hours: number;
		minutes: number;
		seconds: number;
	} => {
		const hours = Math.floor(milliseconds / (1000 * 60 * 60));
		const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

		return { hours, minutes, seconds };
	};

	return {
		getCurrentClaim,
		canClaim,
		claimDoubleExp,
		getNextClaimTime,
		deactivateExpiredClaims,
		getTimeRemaining,
		getCountdown,
	};
};
