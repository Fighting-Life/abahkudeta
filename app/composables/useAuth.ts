export const useAuthRegister = () => {
	const supabase = useSupabaseClient<Database>();
	const { upsertProfile } = useProfiles();

	const register = async (values: {
		email: string;
		username: string;
		password: string;
		name: string;
		phone: string;
		whatsapp: string;
		payment_type: "bank" | "e-money";
		payment_method: string;
		bank_account_number: string;
		bank_account_name: string;
		referral_code?: string;
	}) => {
		try {
			// 1. Sign up user - gunakan EMAIL, bukan username!
			const { data: authData, error: signUpError } = await supabase.auth.signUp(
				{
					email: values.email, // ← FIX: gunakan email field
					password: values.password,
					options: {
						data: {
							name: values.name,
							full_name: values.name,
							username: values.username, // simpan username di metadata
							phone: values.phone,
							whatsapp: values.whatsapp,
							payment_type: values.payment_type,
							payment_method: values.payment_method,
							bank_account_number: values.bank_account_number,
							bank_account_name: values.bank_account_name,
							referral_code: values.referral_code || null,
						},
						emailRedirectTo: `${window.location.origin}/confirm`,
					},
				},
			);

			if (signUpError) throw signUpError;
			if (!authData.user) throw new Error("User creation failed");

			// 2. Upsert profile (backup jika trigger gagal)
			try {
				await upsertProfile({
					id: authData.user.id,
					username: values.username, // username dari form
					full_name: values.name,
					phone: values.phone,
					whatsapp: values.whatsapp,
					payment_type: values.payment_type,
					bank_account_number: values.bank_account_number,
					bank_account_name: values.bank_account_name,
					referral_code: values.referral_code || null,
					balance: "0",
					role: "user",
					is_active: true,
					bonus_claimed: false,
				});
			} catch (profileError) {
				console.error("Profile upsert error:", profileError);
				// Don't throw, trigger might have handled it
			}

			return {
				success: true,
				user: authData.user,
			};
		} catch (error: any) {
			console.error("Registration error:", error);
			throw error;
		}
	};

	return {
		register,
	};
};
export const useAuthLogin = () => {
	const supabase = useSupabaseClient<Database>();

	const login = async (identifier: string, password: string) => {
		try {
			let email = identifier;

			// Check if identifier is email format
			const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

			if (!isEmail) {
				// Query profiles untuk ambil email berdasarkan username
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("email")
					.eq("username", identifier)
					.maybeSingle();

				if (profileError) {
					console.error("Profile error:", profileError);
					throw new Error("Terjadi kesalahan saat mencari username");
				}

				if (!profile || !profile.email) {
					throw new Error("Username tidak ditemukan");
				}

				email = profile.email;
			}

			// Login with email
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.error("Auth error:", error);

				if (error.message.includes("Invalid login credentials")) {
					throw new Error("Email/Username atau password salah!");
				} else if (error.message.includes("Email not confirmed")) {
					throw new Error("Email belum diverifikasi. Silakan cek inbox Anda.");
				} else if (error.message.includes("Database error")) {
					throw new Error("Terjadi kesalahan sistem. Silakan coba lagi.");
				}

				throw error;
			}

			// Update last login (optional - remove if causing issues)
			if (data.user) {
				try {
					await supabase
						.from("profiles")
						.update({ last_sign_in_at: new Date().toISOString() })
						.eq("id", data.user.id);
				} catch (updateError) {
					// Silently fail - login still successful
					console.warn("Could not update last_sign_in_at:", updateError);
				}
			}

			return {
				success: true,
				user: data.user,
				session: data.session,
			};
		} catch (error: any) {
			console.error("Login error:", error);
			throw error;
		}
	};

	return { login };
};
