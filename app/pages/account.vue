<script setup lang="ts">
const route = useRoute();

definePageMeta({
	middleware: "auth",
	layout: "default",
	name: "account",
	path: "/account",
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

const { $profileState, $refreshProfile } = useNuxtApp();

const queryQName = computed(() => route.query.q as string);
const queryTName = computed(() => route.query.t as string);

const sidebarMenuItems: PageMenuAccount[] = [
	{
		name: "Akun Saya",
		path_url: "/account?q=main&t=summary",
		main_query: "main",
		sub_query: "summary",
		icon: "/images/menus/profile-active.webp",
	},
	{
		name: "Deposit",
		path_url: "/account?q=finance&t=deposit",
		main_query: "finance",
		sub_query: "deposit",
		icon: "/images/menus/deposit-active.webp",
	},
	{
		name: "Hadiah Loyalitas",
		path_url: "/account?q=loyalty&t=rewards",
		main_query: "loyalty",
		sub_query: "rewards",
		icon: "/images/menus/loyalty-reward-active.webp",
	},
	{
		name: "Laporan",
		path_url: "/account?q=history&t=report",
		main_query: "history",
		sub_query: "report",
		icon: "/images/menus/reporting-active.webp",
	},
	{
		name: "Kotak Masuk",
		path_url: "/account?q=messages&t=inbox",
		main_query: "messages",
		sub_query: "inbox",
		icon: "/images/menus/inbox-active.webp",
	},
];
const activeMenu = ref<string>(queryQName.value);
const activeTab = ref<string>(queryTName.value);

const handleMenuClick = (item: PageMenuAccount) => {
	activeMenu.value = item.main_query;
	// console.log("Menu clicked:", item.name);
};
</script>

<template>
	<div class="w-full space-y-3 pt-12 pb-5">
		<div class="container mx-auto max-w-[1024px] space-y-4 rounded-lg">
			<!-- Desktop Layout -->
			<div class="flex gap-4">
				<div class="grid w-full grid-cols-1 gap-10 lg:grid-cols-12">
					<!-- Sidebar Component -->
					<div class="col-span-1 lg:col-span-3">
						<div class="hidden lg:block">
							<AccountSidebar
								:menu-items="sidebarMenuItems"
								:active-menu="activeMenu"
								@menu-click="handleMenuClick"
							/>
						</div>
						<div class="block px-2 lg:hidden">
							<AccountMobileMenu
								:menu-items="sidebarMenuItems"
								:active-menu="activeMenu"
								@menu-click="handleMenuClick"
							/>
						</div>
					</div>

					<!-- Main Content -->
					<div class="col-span-1 rounded-lg bg-neutral-900 p-5 lg:col-span-9">
						<div class="flex-1">
							<!-- Account Information Section -->
							<AccountInformationSection v-if="queryQName === 'main'" />

							<!-- Account Deposit Section -->
							<AccountDepositSection v-if="queryQName === 'finance'" />

							<!-- Account Claim Bonus Section -->
							<HistorySection v-if="queryQName === 'history'" />

							<!-- Account Inbox Section -->
							<InboxSection v-if="queryQName === 'messages'" />

							<!-- Account Loyalty Section -->
							<LoyaltySection v-if="queryQName === 'loyalty'" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";
</style>
