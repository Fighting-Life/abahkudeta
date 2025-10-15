export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "13.0.5";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			double_exp_claims: {
				Row: {
					claimed_at: string;
					created_at: string | null;
					expires_at: string;
					id: string;
					is_active: boolean | null;
					next_claim_at: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					claimed_at?: string;
					created_at?: string | null;
					expires_at: string;
					id?: string;
					is_active?: boolean | null;
					next_claim_at: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					claimed_at?: string;
					created_at?: string | null;
					expires_at?: string;
					id?: string;
					is_active?: boolean | null;
					next_claim_at?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			history_games: {
				Row: {
					bet_amount: number | null;
					created_at: string;
					game_category: string | null;
					game_code: string | null;
					game_image: string | null;
					game_link: string | null;
					game_name: string;
					game_provider: number;
					game_slug: string | null;
					id: string;
					is_favourite: boolean | null;
					is_win: boolean | null;
					rtp_changed: boolean | null;
					rtp_value: number | null;
					total_play: number | null;
					updated_at: string;
					user_id: string;
					win_amount: number | null;
				};
				Insert: {
					bet_amount?: number | null;
					created_at?: string;
					game_category?: string | null;
					game_code?: string | null;
					game_image?: string | null;
					game_link?: string | null;
					game_name: string;
					game_provider: number;
					game_slug?: string | null;
					id?: string;
					is_favourite?: boolean | null;
					is_win?: boolean | null;
					rtp_changed?: boolean | null;
					rtp_value?: number | null;
					total_play?: number | null;
					updated_at?: string;
					user_id: string;
					win_amount?: number | null;
				};
				Update: {
					bet_amount?: number | null;
					created_at?: string;
					game_category?: string | null;
					game_code?: string | null;
					game_image?: string | null;
					game_link?: string | null;
					game_name?: string;
					game_provider?: number;
					game_slug?: string | null;
					id?: string;
					is_favourite?: boolean | null;
					is_win?: boolean | null;
					rtp_changed?: boolean | null;
					rtp_value?: number | null;
					total_play?: number | null;
					updated_at?: string;
					user_id?: string;
					win_amount?: number | null;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					balance: string;
					bank_account_name: string | null;
					bank_account_number: string | null;
					bonus_claimed: boolean;
					created_at: string;
					email: string | null;
					full_name: string | null;
					id: string;
					is_active: boolean;
					last_sign_in_at: string | null;
					payment_type: string | null;
					phone: string | null;
					referral_code: string | null;
					role: Database["public"]["Enums"]["user_role"];
					updated_at: string;
					username: string;
					whatsapp: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					balance?: string;
					bank_account_name?: string | null;
					bank_account_number?: string | null;
					bonus_claimed?: boolean;
					created_at?: string;
					email?: string | null;
					full_name?: string | null;
					id: string;
					is_active?: boolean;
					last_sign_in_at?: string | null;
					payment_type?: string | null;
					phone?: string | null;
					referral_code?: string | null;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
					username: string;
					whatsapp?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					balance?: string;
					bank_account_name?: string | null;
					bank_account_number?: string | null;
					bonus_claimed?: boolean;
					created_at?: string;
					email?: string | null;
					full_name?: string | null;
					id?: string;
					is_active?: boolean;
					last_sign_in_at?: string | null;
					payment_type?: string | null;
					phone?: string | null;
					referral_code?: string | null;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
					username?: string;
					whatsapp?: string | null;
				};
				Relationships: [];
			};
			transactions: {
				Row: {
					admin_notes: string | null;
					amount: number;
					balance_after: number | null;
					balance_before: number | null;
					completed_at: string | null;
					created_at: string;
					id: string;
					notes: string | null;
					payment_account_name: string | null;
					payment_account_number: string | null;
					payment_method: Database["public"]["Enums"]["payment_method"];
					payment_provider: string | null;
					processed_at: string | null;
					processed_by: string | null;
					proof_image_url: string | null;
					reference_number: string | null;
					status: Database["public"]["Enums"]["transaction_status"];
					transaction_type: Database["public"]["Enums"]["transaction_type"];
					updated_at: string;
					user_account_name: string;
					user_account_number: string;
					user_id: string;
				};
				Insert: {
					admin_notes?: string | null;
					amount: number;
					balance_after?: number | null;
					balance_before?: number | null;
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					notes?: string | null;
					payment_account_name?: string | null;
					payment_account_number?: string | null;
					payment_method: Database["public"]["Enums"]["payment_method"];
					payment_provider?: string | null;
					processed_at?: string | null;
					processed_by?: string | null;
					proof_image_url?: string | null;
					reference_number?: string | null;
					status?: Database["public"]["Enums"]["transaction_status"];
					transaction_type: Database["public"]["Enums"]["transaction_type"];
					updated_at?: string;
					user_account_name: string;
					user_account_number: string;
					user_id: string;
				};
				Update: {
					admin_notes?: string | null;
					amount?: number;
					balance_after?: number | null;
					balance_before?: number | null;
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					notes?: string | null;
					payment_account_name?: string | null;
					payment_account_number?: string | null;
					payment_method?: Database["public"]["Enums"]["payment_method"];
					payment_provider?: string | null;
					processed_at?: string | null;
					processed_by?: string | null;
					proof_image_url?: string | null;
					reference_number?: string | null;
					status?: Database["public"]["Enums"]["transaction_status"];
					transaction_type?: Database["public"]["Enums"]["transaction_type"];
					updated_at?: string;
					user_account_name?: string;
					user_account_number?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			transaction_history: {
				Row: {
					admin_notes: string | null;
					amount: number | null;
					balance_after: number | null;
					balance_before: number | null;
					completed_at: string | null;
					created_at: string | null;
					full_name: string | null;
					id: string | null;
					notes: string | null;
					payment_account_name: string | null;
					payment_account_number: string | null;
					payment_method: Database["public"]["Enums"]["payment_method"] | null;
					payment_provider: string | null;
					phone: string | null;
					processed_at: string | null;
					processed_by: string | null;
					processed_by_name: string | null;
					processed_by_username: string | null;
					proof_image_url: string | null;
					reference_number: string | null;
					status: Database["public"]["Enums"]["transaction_status"] | null;
					transaction_type:
						| Database["public"]["Enums"]["transaction_type"]
						| null;
					updated_at: string | null;
					user_account_name: string | null;
					user_account_number: string | null;
					user_id: string | null;
					username: string | null;
					whatsapp: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			can_claim_double_exp: {
				Args: { p_user_id: string };
				Returns: boolean;
			};
			generate_transaction_ref: {
				Args: { tx_type: Database["public"]["Enums"]["transaction_type"] };
				Returns: string;
			};
			get_user_transaction_stats: {
				Args: { p_user_id: string };
				Returns: Json;
			};
		};
		Enums: {
			payment_method: "bank_transfer" | "e_wallet" | "crypto" | "credit_card";
			transaction_status:
				| "pending"
				| "processing"
				| "completed"
				| "cancelled"
				| "rejected";
			transaction_type: "deposit" | "withdraw";
			user_role: "user" | "admin" | "superadmin";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			payment_method: ["bank_transfer", "e_wallet", "crypto", "credit_card"],
			transaction_status: [
				"pending",
				"processing",
				"completed",
				"cancelled",
				"rejected",
			],
			transaction_type: ["deposit", "withdraw"],
			user_role: ["user", "admin", "superadmin"],
		},
	},
} as const;
