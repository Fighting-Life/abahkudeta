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
	}
	interface MarqueeItem {
		text: string;
		link?: string;
		urgent?: boolean;
	}
	interface Game {
		category: string;
		categories: {
			name: string;
			seqNo: number;
		}[];
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
		| "Live22Games";

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
		| "LIVE22";

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
}
export {};
