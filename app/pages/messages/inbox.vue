<script setup lang="ts">
const route = useRoute();

definePageMeta({
	middleware: ["auth"],
	layout: "default",
	name: "messages-inbox",
	path: "/messages/inbox",
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
</script>
<template>
	<div></div>
</template>

<style scoped></style>
