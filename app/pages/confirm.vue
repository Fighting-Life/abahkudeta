<script setup lang="ts">
import {
	CheckCircle2,
	Mail,
	Loader2,
	XCircle,
	ArrowLeft,
} from "lucide-vue-next";

const route = useRoute();

definePageMeta({
	layout: false,
	name: "confirm",
	path: "/confirm",
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

const supabase = useSupabaseClient<Database>();
const router = useRouter();

const status = ref<"loading" | "success" | "error">("loading");
const errorMessage = ref("");
const countdown = ref(3);

onMounted(async () => {
	try {
		const token_hash = route.query.token_hash as string;
		const type = route.query.type as string;

		if (!token_hash || !type) {
			throw new Error("Link verifikasi tidak valid atau sudah kadaluarsa");
		}

		// Verify email token
		const { data, error } = await supabase.auth.verifyOtp({
			token_hash,
			type: type as any,
		});

		if (error) throw error;

		if (data.user) {
			// Update profile
			await supabase
				.from("profiles")
				.update({
					last_sign_in_at: new Date().toISOString(),
					is_active: true,
				})
				.eq("id", data.user.id);

			status.value = "success";

			// Countdown redirect
			const interval = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					clearInterval(interval);
					router.push("/");
				}
			}, 1000);
		}
	} catch (error: any) {
		console.error("Verification error:", error);
		status.value = "error";
		errorMessage.value = error.message || "Terjadi kesalahan saat verifikasi";
	}
});

const handleBackToHome = () => {
	router.push("/");
};
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-black px-4">
		<div class="w-full max-w-md">
			<!-- Loading State -->
			<Transition name="fade" mode="out-in">
				<div v-if="status === 'loading'" class="space-y-6 text-center">
					<div class="relative inline-flex">
						<div
							class="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-2xl"
						></div>
						<div
							class="relative rounded-full border border-gray-800 bg-gray-900 p-6"
						>
							<Loader2 class="h-12 w-12 animate-spin text-yellow-400" />
						</div>
					</div>

					<div class="space-y-3">
						<h1 class="text-2xl font-bold text-gray-100">
							Memverifikasi Email Anda
						</h1>
						<p class="text-sm text-gray-400">
							Mohon tunggu sebentar, kami sedang memproses verifikasi...
						</p>
					</div>

					<div class="flex items-center justify-center gap-1.5">
						<div
							class="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:-0.3s]"
						></div>
						<div
							class="h-2 w-2 animate-bounce rounded-full bg-yellow-400 [animation-delay:-0.15s]"
						></div>
						<div
							class="h-2 w-2 animate-bounce rounded-full bg-yellow-400"
						></div>
					</div>
				</div>

				<!-- Success State -->
				<div v-else-if="status === 'success'" class="space-y-6 text-center">
					<div class="relative inline-flex">
						<div
							class="absolute inset-0 rounded-full bg-yellow-500/20 blur-2xl"
						></div>
						<div
							class="relative rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 p-6"
						>
							<CheckCircle2 class="animate-scale-in h-12 w-12 text-white" />
						</div>
					</div>

					<div class="animate-fade-in-up space-y-3">
						<h1 class="text-2xl font-bold text-gray-100">
							Email Terverifikasi!
						</h1>
						<p class="text-sm text-gray-400">
							Akun Anda berhasil diverifikasi. Selamat bergabung dengan
							KUDETABET98!
						</p>
					</div>

					<div
						class="animate-fade-in-up rounded-lg border border-gray-800 bg-gray-900 p-4 [animation-delay:0.2s]"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="rounded-lg bg-yellow-400/10 p-2">
									<Mail class="h-5 w-5 text-yellow-400" />
								</div>
								<div class="text-left">
									<p class="text-xs text-gray-500">Redirect otomatis dalam</p>
									<p class="text-lg font-bold text-yellow-400">
										{{ countdown }} detik
									</p>
								</div>
							</div>
							<button
								class="cursor-pointer rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-yellow-400 hover:to-yellow-500 active:scale-95"
								@click="handleBackToHome"
							>
								Ke Beranda
							</button>
						</div>
					</div>

					<div
						class="animate-fade-in-up border-t border-gray-800 pt-4 [animation-delay:0.4s]"
					>
						<p class="text-xs text-gray-500">
							Terima kasih telah memverifikasi email Anda
						</p>
					</div>
				</div>

				<!-- Error State -->
				<div v-else-if="status === 'error'" class="space-y-6 text-center">
					<div class="relative inline-flex">
						<div
							class="absolute inset-0 rounded-full bg-red-500/20 blur-2xl"
						></div>
						<div
							class="relative rounded-full border border-red-900 bg-gray-900 p-6"
						>
							<XCircle class="animate-scale-in h-12 w-12 text-red-500" />
						</div>
					</div>

					<div class="animate-fade-in-up space-y-3">
						<h1 class="text-2xl font-bold text-gray-100">Verifikasi Gagal</h1>
						<p class="text-sm text-gray-400">{{ errorMessage }}</p>
					</div>

					<div
						class="animate-fade-in-up space-y-3 rounded-lg border border-gray-800 bg-gray-900 p-4 [animation-delay:0.2s]"
					>
						<div class="text-sm text-gray-400">
							<p class="mb-2">Kemungkinan penyebab:</p>
							<ul class="list-inside list-disc space-y-1 text-left text-xs">
								<li>Link verifikasi sudah kadaluarsa</li>
								<li>Link sudah pernah digunakan</li>
								<li>Link tidak valid</li>
							</ul>
						</div>

						<button
							class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-yellow-400 hover:to-yellow-500 active:scale-95"
							@click="handleBackToHome"
						>
							<ArrowLeft class="h-4 w-4" />
							Kembali ke Beranda
						</button>
					</div>

					<div
						class="animate-fade-in-up border-t border-gray-800 pt-4 [animation-delay:0.4s]"
					>
						<p class="text-xs text-gray-500">
							Butuh bantuan? Hubungi customer service kami
						</p>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Scale in animation */
@keyframes scale-in {
	from {
		transform: scale(0);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

.animate-scale-in {
	animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Fade in up animation */
@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in-up {
	animation: fade-in-up 0.6s ease-out forwards;
	opacity: 0;
}

/* Animation delay classes */
.\[animation-delay\:0\.2s\] {
	animation-delay: 0.2s;
}

.\[animation-delay\:0\.4s\] {
	animation-delay: 0.4s;
}

.\[animation-delay\:-0\.3s\] {
	animation-delay: -0.3s;
}

.\[animation-delay\:-0\.15s\] {
	animation-delay: -0.15s;
}
</style>
