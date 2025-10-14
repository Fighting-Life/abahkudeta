export const useAuth = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const router = useRouter();
	const toast = useToast();
	const { refreshProfile } = useProfiles();

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
			// Sign up with email
			const { data: authData, error: signUpError } = await supabase.auth.signUp(
				{
					email: values.email,
					password: values.password,
					options: {
						data: {
							username: values.username,
							full_name: values.name,
							name: values.name,
							phone: values.phone,
							whatsapp: values.whatsapp,
							payment_type: values.payment_type,
							payment_method: values.payment_method,
							bank_account_number: values.bank_account_number,
							bank_account_name: values.bank_account_name,
							referral_code: values.referral_code || null,
						},
						emailRedirectTo: `${window.location.origin}/auth/confirm`,
					},
				},
			);

			if (signUpError) throw signUpError;
			if (!authData.user) throw new Error("User creation failed");

			// Refresh profile to get the newly created profile
			await refreshProfile();

			toast.success(
				"Registration successful! Please check your email to verify your account.",
			);

			return {
				success: true,
				user: authData.user,
			};
		} catch (error: any) {
			console.error("Registration error:", error);

			// Handle specific errors
			if (error.message?.includes("User already registered")) {
				throw new Error("Email sudah terdaftar");
			} else if (error.message?.includes("Database error")) {
				throw new Error("Terjadi kesalahan sistem. Silakan coba lagi.");
			}

			throw error;
		}
	};
	const login = async (identifier: string, password: string) => {
		try {
			let email = identifier;

			// Check if identifier is email format
			const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

			if (!isEmail) {
				// Query profiles to get email from username
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

			// Update last login
			if (data.user) {
				try {
					await supabase
						.from("profiles")
						.update({ last_sign_in_at: new Date().toISOString() })
						.eq("id", data.user.id);
				} catch (updateError) {
					console.warn("Could not update last_sign_in_at:", updateError);
				}
			}

			// Refresh profile
			await refreshProfile();

			toast.success("Login berhasil!");

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
	const logout = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			// Refresh profile (will set to null)
			await refreshProfile();

			toast.success("Logout berhasil");

			// Redirect to home
			await router.push("/");
		} catch (error: any) {
			console.error("Logout error:", error);
			toast.error("Gagal logout");
			throw error;
		}
	};
	const requestPasswordReset = async (email: string) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) throw error;

			toast.success("Link reset password telah dikirim ke email Anda");

			return { success: true };
		} catch (error: any) {
			console.error("Password reset error:", error);
			throw error;
		}
	};

	const updatePassword = async (newPassword: string) => {
		try {
			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) throw error;

			toast.success("Password berhasil diubah");

			return { success: true };
		} catch (error: any) {
			console.error("Update password error:", error);
			throw error;
		}
	};

	const isAuthenticated = computed(() => !!user.value);

	return {
		user,
		isAuthenticated,
		register,
		login,
		logout,
		requestPasswordReset,
		updatePassword,
	};
};
