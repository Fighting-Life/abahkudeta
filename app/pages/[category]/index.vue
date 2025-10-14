<script setup lang="ts">
import { cn } from "~/lib/utils";

const route = useRoute();
const router = useRouter();

definePageMeta({
	layout: "default",
	name: "category-game",
	path: "/:category",
	validate: (route) => {
		const categoryParam = route.params.category as string;
		return /^[a-z0-9-]+$/.test(categoryParam);
	},
});
useSeoMeta({
	title: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	description:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	robots: "index, follow",
	keywords:
		"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
	ogTitle: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	ogDescription:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	ogImage: "https://static.geekschip.com/data/category_images/1647524654_0.jpg",
	ogUrl: route.fullPath,
	twitterCard: "summary_large_image",
	twitterTitle: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	twitterDescription:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	twitterImage:
		"https://static.geekschip.com/data/category_images/1647524654_0.jpg",
	twitterSite: "@kudetabet98",
	twitterCreator: "@kudetabet98",
});
useHead({
	link: [
		{
			rel: "canonical",
			href: route.fullPath,
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "32x32",
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "512x512",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "180x180",
		},
		{
			rel: "shortcut icon",
			type: "image/x-icon",
			href: `/favicon.png`,
		},
	],
	meta: [
		// Open Graph tambahan untuk social media
		{ property: "og:type", content: "website" }, // Atau "artikel" untuk halaman artikel
		{ property: "og:url", content: route.fullPath },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:image:alt", content: "KUDETABET98" },
		{ property: "og:locale", content: "en_US" },
		{ name: "author", content: "Pixel Pedia" },
		{ name: "publisher", content: "Pixel Pedia" },
		{ name: "copyright", content: "Pixel Pedia" },
		{ name: "distribution", content: "global" },
		{ name: "rating", content: "general" },
		{ name: "revisit-after", content: "7 days" },
		{ name: "category", content: "Digital Marketing" },
		{ name: "topic", content: "KUDETABET98" },
		{
			name: "summary",
			content:
				"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
		},
		{
			name: "abstract",
			content:
				"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
		},
		{ name: "coverage", content: "Worldwide" },
	],
	script: [
		{
			type: "application/ld+json",
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Website",
				headline: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
				name: "KUDETABET98",
				description:
					"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.", // atau summary, introdution,
				image: "/app-bg.jpg",
				url: route.fullPath,
				datePublished: "2024-01-15T08:00:00+08:00", // Gunakan createdAt artikel
				dateModified: "2024-01-15T09:20:00+08:00", // Gunakan updatedAt artikel
				author: {
					"@type": "Person",
					name: "KUDETABET98",
				},
				publisher: {
					"@type": "Organization",
					name: "KUDETABET98",
					logo: {
						"@type": "ImageObject",
						url: `/favicon.png`,
					},
				},
				keywords:
					"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": route.fullPath,
				},
				inLanguage: "en-US",
				potentialAction: {
					"@type": "ReadAction",
					target: [route.fullPath],
				},
				about: {
					"@type": "Thing",
					name: "KUDETABET98",
				},
				genre:
					"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				audience: {
					"@type": "Audience",
					audienceType:
						"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				},
				isAccessibleForFree: true,
				license: `${route.fullPath}/license`,
			}),
		},
	],
});

const user = useSupabaseUser();
const {
	searchTerm: slotSearchTerm,
	selectedFilter: slotSelectedFilter,
	selectedProvider: slotSelectedProvider,
} = useSlotGames();
const { searchArcadeTerm, selectedArcadeFilter, selectedArcadeProvider } =
	useArcadeGames();
const { selectedCrashProvider } = useCrashGames();

const categorParams = route.params.category as string;
const category = computed(() =>
	CategoriesTopMenu.find((val) => val.slug === categorParams),
);

const handleSlotsFilterChange = (filter?: FilterType) => {
	if (!filter || filter === "Semua permainan") {
		slotSelectedFilter.value = undefined;
	} else {
		slotSelectedFilter.value = filter;
	}
};
const handleArcadeFilterChange = (filter?: ArcadeFilterType) => {
	if (!filter || filter === "Semua permainan") {
		selectedArcadeFilter.value = undefined;
	} else {
		selectedArcadeFilter.value = filter;
	}
};
</script>
<template>
	<div class="category-page min-h-screen w-full pb-[3rem]">
		<!-- Hero Section dengan Purple Glow -->
		<div
			v-if="!category?.slug.includes('promotion')"
			class="relative flex h-[300px] w-full items-center justify-center overflow-hidden pt-5 lg:h-[500px] lg:pt-5"
		>
			<!-- Background Gradient -->
			<div
				:class="cn('absolute inset-0 z-1', category?.style?.bg_gradient)"
			></div>

			<!-- Purple Glow Effect -->
			<div
				:class="
					cn(
						'absolute -top-[50%] left-[50%] z-0 h-[800px] w-[800px] -translate-x-[50%] transform blur-[60px]',
						category?.style?.glow_effect_1,
					)
				"
			></div>
			<div
				::class="cn('absolute top-[20%] -right-[20%] z-0 h-[600px] w-[600px] blur-[80px]', category?.style?.glow_effect_2)"
			></div>

			<!-- Hero Image -->
			<div class="relative z-2 max-h-[1200px] w-full">
				<nuxt-img
					:src="category?.cover"
					:alt="category?.name"
					:class="
						cn(
							'hidden h-[240px] w-full object-contain lg:block lg:h-full',
							category?.style?.her0_image,
						)
					"
					loading="lazy"
					decoding="auto"
				/>
				<nuxt-img
					:src="category?.cover_small"
					:alt="category?.name"
					class="block h-full w-full bg-center object-fill lg:hidden"
					loading="lazy"
					decoding="auto"
				>
				</nuxt-img>
			</div>
		</div>

		<div
			v-if="category?.slug === 'slots'"
			class="flex min-h-48 items-center justify-center py-2 lg:min-h-max"
		>
			<jackpot-banner />
		</div>
		<!-- Content Section -->
		<div class="relative -mt-8 px-4">
			<div class="container">
				<!-- Title & Description Card -->
				<div class="info-card">
					<h1 class="title">{{ category?.name || "HOT GAMES" }}</h1>

					<p class="description">
						{{ category?.descriptions }}
					</p>

					<!-- Register Button (jika belum login) -->
					<NuxtLink v-if="!user" to="/register" class="register-button">
						REGISTER
					</NuxtLink>
				</div>

				<SlotProviderCategory
					v-if="category?.slug === 'slots'"
					:providers="SlotsProvidersCategory"
					@select-provider="(val) => (slotSelectedProvider = val)"
					@filter-change="handleSlotsFilterChange"
					@on-search="(val) => (slotSearchTerm = val)"
				/>
				<crash-provider-category
					v-if="category?.slug === 'crash-game'"
					:providers="CrashProvidersCategory"
					@select-provider="(val) => (selectedCrashProvider = val)"
				/>
				<arcade-provider-category
					v-if="category?.slug === 'arcade'"
					:providers="ArcadeProvidersCategory"
					@select-provider="(val) => (selectedArcadeProvider = val)"
					@filter-change="handleArcadeFilterChange"
					@on-search="(val) => (searchArcadeTerm = val)"
				/>
				<PromotionCategory v-if="category?.slug === 'promotion'" />
				<!-- Hot Games Section -->
				<GameCardHorizontal
					v-if="
						!category?.slug.includes('slots') &&
						!category?.slug.includes('crash-game') &&
						!category?.slug.includes('arcade') &&
						!category?.slug.includes('promotion')
					"
					:category="category?.sub"
					:title="category?.alias"
				/>
				<SlotsGameCardHorizontal
					v-if="category?.slug === 'slots'"
					:selected-provider="slotSelectedProvider"
					:filtered-type="slotSelectedFilter"
					:search-term="slotSearchTerm"
					:initial-limit="12"
					:load-more-increment="12"
					:use-filter="true"
				/>
				<CrashGameCardHorizontal
					v-if="category?.slug === 'crash-game'"
					:selected-provider="selectedCrashProvider"
					:initial-limit="12"
					:load-more-increment="12"
					:use-filter="true"
				/>
				<ArcadeGameCardHorizontal
					v-if="category?.slug === 'arcade'"
					:selected-provider="selectedArcadeProvider"
					:filtered-type="selectedArcadeFilter"
					:search-term="searchArcadeTerm"
					:initial-limit="12"
					:load-more-increment="12"
					:use-filter="true"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";
/* Main Container */
.category-page {
	background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}
/* Background Gradient */
.hero-background-purple {
	background: linear-gradient(
		180deg,
		rgba(138, 43, 226, 0.3) 0%,
		rgba(75, 0, 130, 0.5) 50%,
		rgba(25, 25, 35, 0.9) 100%
	);
}
.hero-background-dark {
	background: linear-gradient(
		180deg,
		rgba(43, 42, 43, 0) 0%,
		rgb(19, 18, 20) 50%,
		rgba(0, 0, 0, 0.9) 100%
	);
}
/* Purple Glow Effects */
.purple-glow-purple {
	background: radial-gradient(
		circle,
		rgba(138, 43, 226, 0.6) 0%,
		rgba(138, 43, 226, 0.3) 30%,
		transparent 70%
	);
	animation: pulse 4s ease-in-out infinite;
}
.glow-effect-dark {
	background: radial-gradient(
		circle,
		rgba(50, 50, 51, 0.6) 0%,
		rgba(28, 28, 29, 0.3) 30%,
		transparent 70%
	);
	animation: pulse 4s ease-in-out infinite;
}
.purple-glow-purple-2 {
	background: radial-gradient(
		circle,
		rgba(255, 0, 255, 0.4) 0%,
		rgba(138, 43, 226, 0.2) 40%,
		transparent 70%
	);
	animation: pulse 6s ease-in-out infinite reverse;
}
.purple-glow-dark-2 {
	background: radial-gradient(
		circle,
		rgba(34, 34, 34, 0.4) 0%,
		rgba(0, 0, 0, 0.2) 40%,
		transparent 70%
	);
	animation: pulse 6s ease-in-out infinite reverse;
}
@keyframes pulse {
	0%,
	100% {
		opacity: 0.6;
		transform: translateX(-50%) scale(1);
	}
	50% {
		opacity: 1;
		transform: translateX(-50%) scale(1.1);
	}
}

.hero-image-purple {
	filter: drop-shadow(0 0 40px rgba(138, 43, 226, 0.5));
}
.hero-image-dark {
	filter: drop-shadow(0 0 40px rgba(40, 40, 41, 0.5));
}

.container {
	max-width: 1024px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

/* Info Card */
.info-card {
	background: rgba(17, 24, 39, 0.8);
	backdrop-filter: blur(10px);
	border-radius: 1rem;
	padding: 2rem 1.5rem;
	border: 1px solid rgba(138, 43, 226, 0.2);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	text-align: center;
}

@media (min-width: 1024px) {
	.info-card {
		padding: 3rem 2.5rem;
	}
}

.title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

@media (min-width: 1024px) {
	.title {
		font-size: 2.5rem;
	}
}

.description {
	font-size: 0.875rem;
	line-height: 1.6;
	color: #d1d5db;
	max-width: 800px;
}

@media (min-width: 1024px) {
	.description {
		font-size: 1rem;
	}
}

/* Register Button */
.register-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 3rem;
	font-size: 0.875rem;
	font-weight: 700;
	color: #1a1a1a;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	background: linear-gradient(to bottom, #fbeb8c 0%, #9d7e39 100%);
	border-radius: 9999px;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 0 4px 15px rgba(251, 235, 140, 0.4);
}

.register-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(251, 235, 140, 0.6);
}

.register-button:active {
	transform: scale(0.95);
}

/* Hot Games Section */
.hot-games-section {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.section-title {
	font-size: 1.25rem;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
	padding-left: 1rem;
	border-left: 4px solid #8a2be2;
}

/* Games Grid */
.games-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
}

@media (min-width: 640px) {
	.games-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (min-width: 1024px) {
	.games-grid {
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
	}
}

/* Game Card */
.game-card {
	position: relative;
	background: rgba(17, 24, 39, 0.6);
	border-radius: 0.75rem;
	overflow: hidden;
	border: 1px solid rgba(138, 43, 226, 0.2);
	transition: all 0.3s;
	cursor: pointer;
}

.game-card:hover {
	transform: translateY(-4px);
	border-color: rgba(138, 43, 226, 0.6);
	box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
}

.game-badge {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	width: 2rem;
	height: 2rem;
	background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
	font-weight: 700;
	color: #fff;
	z-index: 2;
}

.game-image {
	width: 100%;
	height: 140px;
	overflow: hidden;
	background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
}

@media (min-width: 1024px) {
	.game-image {
		height: 180px;
	}
}

.game-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s;
}

.game-card:hover .game-img {
	transform: scale(1.1);
}

.game-info {
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.game-provider {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.provider-name {
	font-size: 0.75rem;
	font-weight: 600;
	color: #9ca3af;
	text-transform: uppercase;
}

.play-button {
	width: 100%;
	padding: 0.5rem;
	font-size: 0.75rem;
	font-weight: 700;
	color: #1a1a1a;
	text-transform: uppercase;
	background: linear-gradient(to bottom, #fbeb8c 0%, #9d7e39 100%);
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.2s;
}

.play-button:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 10px rgba(251, 235, 140, 0.4);
}

.play-button:active {
	transform: scale(0.95);
}
</style>
