export const useTransactions = () => {
	const supabase = useSupabaseClient<Database>();
	const user = useSupabaseUser();
	const toast = useToast();

	// ==================== CREATE ====================
	const createTransaction = async (input: CreateTransactionInput) => {
		if (!user.value) {
			throw new Error("User not authenticated");
		}

		try {
			const generateReference = (type: string) => {
				const prefix = type === "deposit" ? "DEP" : "WD";
				const timestamp = new Date()
					.toISOString()
					.replace(/[-:T.Z]/g, "")
					.slice(0, 14);
				const random = Math.floor(Math.random() * 10000)
					.toString()
					.padStart(4, "0");
				return `${prefix}${timestamp}-${random}`;
			};

			const { data, error } = await supabase
				.from("transactions")
				.insert({
					user_id: user.value.id,
					transaction_type: input.transaction_type,
					amount: input.amount,
					payment_method: input.payment_method,
					payment_provider: input.payment_provider,
					user_account_number: input.user_account_number,
					user_account_name: input.user_account_name,
					notes: input.notes,
					proof_image_url: input.proof_image_url,
					status: "pending",
					reference_number: generateReference(input.transaction_type), // manual fallback
				})
				.select()
				.single();

			if (error) throw error;

			// toast.success(
			// 	`${input.transaction_type === "deposit" ? "Deposit" : "Penarikan"} berhasil dibuat!`,
			// );

			return data as Transaction;
		} catch (error: any) {
			console.error("Create transaction error:", error);
			// toast.error(error.message || "Gagal membuat transaksi");
			throw error;
		}
	};

	// ==================== READ ====================
	const getTransactions = async (filters?: TransactionFilters) => {
		if (!user.value) return [];

		try {
			let query = supabase
				.from("transactions")
				.select("*")
				.eq("user_id", user.value.id)
				.order("created_at", { ascending: false });

			// Apply filters
			if (filters?.type) {
				query = query.eq("transaction_type", filters.type);
			}

			if (filters?.status) {
				query = query.eq("status", filters.status);
			}

			if (filters?.payment_method) {
				query = query.eq("payment_method", filters.payment_method);
			}

			if (filters?.date_from) {
				query = query.gte("created_at", filters.date_from);
			}

			if (filters?.date_to) {
				query = query.lte("created_at", filters.date_to);
			}

			if (filters?.min_amount) {
				query = query.gte("amount", filters.min_amount);
			}

			if (filters?.max_amount) {
				query = query.lte("amount", filters.max_amount);
			}

			const { data, error } = await query;

			if (error) throw error;

			return data as Transaction[];
		} catch (error: any) {
			console.error("Get transactions error:", error);
			return [];
		}
	};

	const getTransactionById = async (id: string) => {
		try {
			const { data, error } = await supabase
				.from("transactions")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;

			return data as Transaction;
		} catch (error: any) {
			console.error("Get transaction error:", error);
			throw error;
		}
	};

	const getTransactionByReference = async (reference: string) => {
		try {
			const { data, error } = await supabase
				.from("transactions")
				.select("*")
				.eq("reference_number", reference)
				.single();

			if (error) throw error;

			return data as Transaction;
		} catch (error: any) {
			console.error("Get transaction by reference error:", error);
			throw error;
		}
	};

	// Get transaction history with user details (from view)
	const getTransactionHistory = async (filters?: TransactionFilters) => {
		if (!user.value) return [];

		try {
			let query = supabase
				.from("transaction_history")
				.select("*")
				.eq("user_id", user.value.id)
				.order("created_at", { ascending: false });

			// Apply filters
			if (filters?.type) {
				query = query.eq("transaction_type", filters.type);
			}

			if (filters?.status) {
				query = query.eq("status", filters.status);
			}

			const { data, error } = await query;

			if (error) throw error;

			return data as TransactionHistory[];
		} catch (error: any) {
			console.error("Get transaction history error:", error);
			return [];
		}
	};

	// ==================== UPDATE ====================
	const updateTransaction = async (
		id: string,
		input: UpdateTransactionInput,
	) => {
		try {
			const { data, error } = await supabase
				.from("transactions")
				.update(input)
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;

			toast.success("Transaksi berhasil diupdate!");

			return data as Transaction;
		} catch (error: any) {
			console.error("Update transaction error:", error);
			toast.error(error.message || "Gagal update transaksi");
			throw error;
		}
	};

	const cancelTransaction = async (id: string) => {
		if (!user.value) {
			throw new Error("User not authenticated");
		}

		try {
			const { data, error } = await supabase
				.from("transactions")
				.update({ status: "cancelled" })
				.eq("id", id)
				.eq("user_id", user.value.id)
				.eq("status", "pending")
				.select()
				.single();

			if (error) throw error;

			toast.success("Transaksi berhasil dibatalkan");

			return data as Transaction;
		} catch (error: any) {
			console.error("Cancel transaction error:", error);
			toast.error("Gagal membatalkan transaksi");
			throw error;
		}
	};

	const uploadProofOfPayment = async (id: string, file: File) => {
		try {
			// Upload to Supabase Storage
			const fileExt = file.name.split(".").pop();
			const fileName = `${id}-${Date.now()}.${fileExt}`;
			const filePath = `proof-of-payment/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("transactions")
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			// Get public URL
			const {
				data: { publicUrl },
			} = supabase.storage.from("transactions").getPublicUrl(filePath);

			// Update transaction with proof URL
			const { data, error } = await supabase
				.from("transactions")
				.update({ proof_image_url: publicUrl })
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;

			toast.success("Bukti pembayaran berhasil diupload!");

			return data as Transaction;
		} catch (error: any) {
			console.error("Upload proof error:", error);
			toast.error("Gagal upload bukti pembayaran");
			throw error;
		}
	};

	// ==================== STATS ====================
	const getUserStats = async () => {
		if (!user.value) return null;

		try {
			const { data, error } = await supabase.rpc("get_user_transaction_stats", {
				p_user_id: user.value.id,
			});

			if (error) throw error;

			return data as unknown as TransactionStats;
		} catch (error: any) {
			console.error("Get user stats error:", error);
			return null;
		}
	};

	const getPendingCount = async (type?: TransactionType) => {
		if (!user.value) return 0;

		try {
			let query = supabase
				.from("transactions")
				.select("*", { count: "exact", head: true })
				.eq("user_id", user.value.id)
				.eq("status", "pending");

			if (type) {
				query = query.eq("transaction_type", type);
			}

			const { count, error } = await query;

			if (error) throw error;

			return count || 0;
		} catch (error: any) {
			console.error("Get pending count error:", error);
			return 0;
		}
	};

	// ==================== ADMIN FUNCTIONS ====================
	const approveTransaction = async (id: string, adminNotes?: string) => {
		try {
			const { data, error } = await supabase
				.from("transactions")
				.update({
					status: "completed",
					admin_notes: adminNotes,
					processed_by: user.value?.id,
					processed_at: new Date().toISOString(),
				})
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;

			toast.success("Transaksi berhasil disetujui!");

			return data as Transaction;
		} catch (error: any) {
			console.error("Approve transaction error:", error);
			toast.error(error.message || "Gagal menyetujui transaksi");
			throw error;
		}
	};

	const rejectTransaction = async (id: string, adminNotes: string) => {
		try {
			const { data, error } = await supabase
				.from("transactions")
				.update({
					status: "rejected",
					admin_notes: adminNotes,
					processed_by: user.value?.id,
					processed_at: new Date().toISOString(),
				})
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;

			toast.success("Transaksi ditolak");

			return data as Transaction;
		} catch (error: any) {
			console.error("Reject transaction error:", error);
			toast.error("Gagal menolak transaksi");
			throw error;
		}
	};

	// Get all transactions (admin only)
	const getAllTransactions = async (filters?: TransactionFilters) => {
		try {
			let query = supabase
				.from("transaction_history")
				.select("*")
				.order("created_at", { ascending: false });

			// Apply filters
			if (filters?.type) {
				query = query.eq("transaction_type", filters.type);
			}

			if (filters?.status) {
				query = query.eq("status", filters.status);
			}

			if (filters?.search) {
				query = query.or(
					`reference_number.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`,
				);
			}

			const { data, error } = await query;

			if (error) throw error;

			return data as TransactionHistory[];
		} catch (error: any) {
			console.error("Get all transactions error:", error);
			return [];
		}
	};

	return {
		// Create
		createTransaction,

		// Read
		getTransactions,
		getTransactionById,
		getTransactionByReference,
		getTransactionHistory,

		// Update
		updateTransaction,
		cancelTransaction,
		uploadProofOfPayment,

		// Stats
		getUserStats,
		getPendingCount,

		// Admin
		approveTransaction,
		rejectTransaction,
		getAllTransactions,
	};
};
