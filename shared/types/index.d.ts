import type { ToastOptions, ToastType } from "vue3-toastify";

declare global {
	interface Window {
		ethereum?: {
			isMetaMask?: true;
			request: (...args: any[]) => Promise<void>;
			on: (eventName: string, callback: (...args: any[]) => void) => void;
			removeListener: (
				eventName: string,
				callback: (...args: any[]) => void,
			) => void;
		};
	}
	type Profile = Database["public"]["Tables"]["profiles"]["Row"];
	type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
	type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
	type GameHistory = Database["public"]["Tables"]["history_games"]["Row"];
	// type Game = Database["public"]["Tables"]["games"]["Row"];
	// type DoubleExpClaim =
	// 	Database["public"]["Tables"]["double_exp_claims"]["Row"];
	type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
	type TransactionType = Database["public"]["Enums"]["transaction_type"];
	type TransactionStatus = Database["public"]["Enums"]["transaction_status"];
	type PaymentMethod = Database["public"]["Enums"]["payment_method"];

	interface DialogProps {
		open?: boolean;
		type?: "success" | "error" | "warning" | "info";
		title?: string;
		messages?: string;
		enableBtnAction?: boolean;
		labelBtnAction?: string;
		labelClose?: string;
		classBtnAction?: HTMLAttributes["class"];
		classBtnClose?: HTMLAttributes["class"];
	}
	type CategoriesMenu = {
		name: string;
		descriptions?: string;
		alias?: string;
		slug: string;
		icon: string;
		cover?: string;
		cover_small?: string;
		style?: StyleItem;
		sub?: SubMenu[];
	};
	type SubMenu = {
		name: string;
		category: string;
		slug: string;
		icon: string;
		cover?: string;
		link?: string;
		alternative_link?: string;
		style?: StyleItem;
	};
	type StyleItem = {
		bg_gradient?: string;
		glow_effect_1?: string;
		glow_effect_2?: string;
		her0_image?: string;
		text_color?: string;
		bg_color?: string;
		font_size?: string;
		height?: string;
		width?: string;
	};
	interface CarouselItem {
		image: string;
		link: string;
		alt?: string;
		category?: string;
		slug?: string;
		is_external: boolean;
	}
	interface MarqueeItem {
		text: string;
		link?: string;
		urgent?: boolean;
	}
	interface Game {
		category: string;
		categories:
			| {
					name: string;
					seqNo: number;
			  }[]
			| null;
		provider: number;
		name: string;
		gameCode: string;
		gameImage: string;
		link: string;
		isFavourite: boolean;
		rtpValue: null;
		rtpChanged: null;
	}
	type GameType =
		| "PrgamaticGames"
		| "AdvatPlayGames"
		| "FachaiGames"
		| "FastSpinGames"
		| "FatPandaGames"
		| "FiveGgGames"
		| "HabaneroGames"
		| "HacksawGames"
		| "JiliGames"
		| "JokerGames"
		| "KingMadasGames"
		| "MicroGamingGames"
		| "NagaGames"
		| "NoLimitCityGames"
		| "PgSoftGames"
		| "PlayTechGames"
		| "Slot88Games"
		| "SlotManiaGames"
		| "SmartSoftGames"
		| "SpadeGamingGames"
		| "PlayNGoGames"
		| "YggdrasilGames"
		| "SkyWIndGames"
		| "RedTigerGames"
		| "BigTimeGames"
		| "NetentGames"
		| "OnlyPlayGames"
		| "CQ9Games"
		| "JDBGames"
		| "PlayStarGames"
		| "SpinixGames"
		| "CrowdPlayGames"
		| "IonSlotGames"
		| "BigSpotGames"
		| "VPowerGames"
		| "AMBGames"
		| "WorldmatchGames"
		| "OctoPlayGames"
		| "MarioClubGames"
		| "DragoonsoftGames"
		| "FunGamingGames"
		| "FunkyGames"
		| "Live22Games"
		| "PPCasinoGames"
		| "AviatorGames"
		| "CrashSmartsoft"
		| "CrashMicroGaming"
		| "CrashSpinixGames"
		| "GeminiGames"
		| "AdvantPlayMiniGames"
		| "CrashSpadeGaming"
		| "CrashOnlyPlayGames"
		| "CrashJokerGames"
		| "CrashDragoonsoftGames"
		| "CrashFunkyGames"
		| "ArcadePPGames"
		| "ArcadeMigrogamingGames"
		| "ArcadeHackSawGames"
		| "AracdeKingMidasGames"
		| "ArcadeJiliGames"
		| "ArcadeGeminiGames"
		| "ArcadeAviatorGames"
		| "ArcadeFachaiGames"
		| "ArcadeSpinixGames"
		| "ArcadeJokerGames"
		| "ArcadeBtGamingGames"
		| "ArcadeAMBGames"
		| "ArcadeCrowdPlayGames"
		| "AraceVPowerGames"
		| "ArcadeWorldmatchGames"
		| "ArcadeMarioClubGames"
		| "ArcadeDragoonsoftGames"
		| "ArcadeCQ9Games"
		| "ArcadeFunGamingGames"
		| "ArcadeMMTangkasGames"
		| "ArcadeSkywindGames"
		| "ArcadeJDBGames"
		| "ArcadeFungkyGames"
		| "RaceMarblexGames";

	type ShorcutGame =
		| "PP"
		| "ADVANTPLAY"
		| "FACHAI"
		| "FASTSPIN"
		| "FATPANDA"
		| "FIVEGG"
		| "HABANERO"
		| "HACKSAW"
		| "JILI"
		| "JOKER"
		| "KINGMIDAS"
		| "MICROGAMING"
		| "NAGAGAMES"
		| "NOLIMITCITY"
		| "PGSOFT"
		| "PLAYTECH"
		| "SLOT88"
		| "SLOTMANIA"
		| "SMARTSOFT"
		| "SPADEGAMING"
		| "PLAYNGO"
		| "YGGDRASIL"
		| "SKYWIND"
		| "REDTIGER"
		| "BIGTIMEGAMING"
		| "NETENT"
		| "ONLYPLAY"
		| "SBOCQ9"
		| "JDB"
		| "PLAYSTAR"
		| "SPINIX"
		| "CROWDPLAY"
		| "PGS"
		| "BIGPOT"
		| "VPOWER"
		| "AMB"
		| "WORLDMATCH"
		| "OCTOPLAY"
		| "MARIOCLUB"
		| "DRAGOONSOFT"
		| "FUNGAMING"
		| "SBOFUNKYGAME"
		| "LIVE22"
		| "PPLIVECASINO"
		| "SPRIBE"
		| "GEMINI"
		| "ADVANTPLAYMINIGAME"
		| "G8TANGKAS"
		| "BTGAMING"
		| "MARBLEX";

	interface TrendingGame {
		id: string;
		title: string;
		subtitle: string;
		amount: string;
		gameCode: string;
		gameImage: string;
		link: string;
	}
	interface ServerInfo {
		name: string;
		number: string;
		nextDraw: string;
	}
	interface CarouselInnerSlide {
		id: string;
		title: string;
		description: string;
		image: string;
		buttonText: string;
		buttonLink: string;
	}
	interface Partner {
		name: string;
		logo: string;
		logo_colored: string;
		category: string;
		slug: string;
		url: string;
	}
	interface DoubleExpClaim {
		id: string;
		user_id: string;
		claimed_at: string;
		expires_at: string;
		next_claim_at: string;
		is_active: boolean;
	}
	interface PromotionCategory {
		id: number;
		name: string;
		slug: string;
		type: string;
	}
	interface PromotionContent {
		id: string;
		name: string;
		label: string;
		category_id: number;
		end_date?: string;
		image: string;
		detail_url?: string;
		claim_url?: string;
	}
	interface PageMenuAccount {
		name: string;
		path_url: string;
		main_query: string;
		sub_query: string;
		icon: string;
	}
	interface AccountTabMenu {
		name: string;
		path_url: string;
		main_query: string;
		sub_query: string;
	}

	interface TransactionHistory extends Transaction {
		username?: string | null;
		full_name?: string | null;
		phone?: string | null;
		whatsapp?: string | null;
		processed_by_username?: string | null;
		processed_by_name?: string | null;
	}
	interface TransactionStats {
		total_deposits: number;
		total_withdrawals: number;
		pending_deposits: number;
		pending_withdrawals: number;
		total_transactions: number;
		completed_transactions: number;
	}
	interface CreateTransactionInput {
		transaction_type: TransactionType;
		amount: number;
		payment_method: PaymentMethod;
		payment_provider?: string;
		user_account_number: string;
		user_account_name: string;
		notes?: string;
		proof_image_url?: string;
	}
	interface UpdateTransactionInput {
		status?: TransactionStatus;
		admin_notes?: string;
		processed_by?: string;
		proof_image_url?: string;
		notes?: string;
	}
	interface TransactionFilters {
		type?: TransactionType;
		status?: TransactionStatus;
		payment_method?: PaymentMethod;
		date_from?: string;
		date_to?: string;
		min_amount?: number;
		max_amount?: number;
		search?: string; // Search by reference, name, account
	}
	interface CreateGameHistoryInput {
		game_name: string;
		game_slug?: string;
		game_category?: string;
		game_provider: number;
		game_code?: string;
		game_image?: string;
		game_link?: string;
		bet_amount?: number;
		win_amount?: number;
		total_play?: number;
		is_win?: boolean;
		is_favourite?: boolean;
		rtp_value?: number;
	}
	interface UpdateGameHistoryInput {
		total_play?: number;
		bet_amount?: number;
		win_amount?: number;
		is_win?: boolean;
		is_favourite?: boolean;
		rtp_value?: number;
		rtp_changed?: boolean;
	}
	interface GameHistoryStats {
		total_plays: number;
		total_bet_amount: number;
		total_win_amount: number;
		favourite_games: number;
		win_rate: number;
		most_played_game: string;
	}
}
export {};
