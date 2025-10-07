<script setup lang="ts">
const props = defineProps<{
	popularGames?: Game[];
	trendingGame?: TrendingGame[];
}>();

const { launchGame } = useGameLauncher();

const currentDate: Date = new Date();
currentDate.setDate(currentDate.getDate() + 2);
const serverInfo: ServerInfo = {
	name: "SINGAPORE 4D",
	number: "3788",
	nextDraw: formatDate(currentDate),
};

// Reactive state
const popularCurrentIndex = ref(0);
const trendingCurrentIndex = ref(0);
const popularCarouselRef = ref<HTMLElement>();
const trendingCarouselRef = ref<HTMLElement>();
const isMounted = ref(import.meta.client);

// Computed
const games = computed(() => defaultPopularGames);
const baseImgUrl = computed(() => {
	return (link: string) => {
		return `https://d33egg70nrp50s.cloudfront.net/Images/providers-v2/${link.split("/")[3]}/`;
	};
});

const visibleGames = computed(() => {
	const itemsPerView = 4;
	return games.value.slice(0, 8); // Show max 8 items for 2 rows
});

// Auto carousel for popular games (horizontal 2 columns)
const startPopularCarousel = () => {
	setInterval(() => {
		const itemsPerPage = 6; // ✅ 2 columns x 3 rows = 6 items per page
		const maxPages = Math.ceil(games.value.length / itemsPerPage);
		popularCurrentIndex.value = (popularCurrentIndex.value + 1) % maxPages;

		if (popularCarouselRef.value) {
			const cardWidth = 200; // Approximate card width + gap
			const scrollAmount = popularCurrentIndex.value * (cardWidth * 2); // Move 2 columns
			popularCarouselRef.value.scrollTo({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	}, 4000);
};

// Auto carousel for trending items (vertical)
const startTrendingCarousel = () => {
	setInterval(() => {
		trendingCurrentIndex.value =
			(trendingCurrentIndex.value + 1) % trendingGameItems.length;

		if (trendingCarouselRef.value) {
			const itemHeight = 80; // Height of each trending item
			const scrollAmount = trendingCurrentIndex.value * itemHeight;
			trendingCarouselRef.value.scrollTo({
				top: scrollAmount,
				behavior: "smooth",
			});
		}
	}, 3000);
};

// Manual navigation for popular games (2 columns scroll)
const navigatePopular = (direction: "prev" | "next") => {
	const itemsPerPage = 6; // ✅ 2 columns x 3 rows
	const maxPages = Math.ceil(games.value.length / itemsPerPage);

	if (direction === "next") {
		popularCurrentIndex.value = (popularCurrentIndex.value + 1) % maxPages;
	} else {
		popularCurrentIndex.value =
			popularCurrentIndex.value === 0
				? maxPages - 1
				: popularCurrentIndex.value - 1;
	}

	if (popularCarouselRef.value) {
		const cardWidth = 200; // Approximate card width + gap
		const scrollAmount = popularCurrentIndex.value * (cardWidth * 2); // Move 2 columns
		popularCarouselRef.value.scrollTo({
			left: scrollAmount,
			behavior: "smooth",
		});
	}
};

// Lifecycle
onMounted(() => {
	startPopularCarousel();
	startTrendingCarousel();
});
</script>

<template>
	<div class="w-full bg-gray-950 py-6">
		<div class="container mx-auto w-full px-2 lg:max-w-[1024px]">
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<!-- Left Section - Popular Games -->
				<div class="lg:col-span-2">
					<div class="rounded-xl bg-gray-800 p-6">
						<!-- Header -->
						<div class="mb-6 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-6 w-1 rounded-full bg-[#fbeb8c]"></div>
								<h2 class="text-xl font-bold text-white">GAME POPULER</h2>
							</div>
							<!-- Navigation Buttons -->
							<div class="flex items-center gap-2">
								<button
									class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600"
									@click="navigatePopular('prev')"
								>
									<svg
										class="h-4 w-4 text-gray-300"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
									</svg>
								</button>
								<button
									class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700 transition-colors hover:bg-gray-600"
									@click="navigatePopular('next')"
								>
									<svg
										class="h-4 w-4 text-gray-300"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
									</svg>
								</button>
							</div>
						</div>
						<!-- Games Grid with Horizontal Scroll (2 columns x 3 rows) -->
						<div
							ref="popularCarouselRef"
							class="overflow-x-auto overflow-y-hidden scroll-smooth"
							style="scrollbar-width: none; -ms-overflow-style: none"
						>
							<div class="flex min-w-max gap-4">
								<!-- Create pages with 2 columns x 3 rows -->
								<div
									v-for="pageIndex in Math.ceil(games.length / 6)"
									:key="pageIndex"
									class="grid flex-shrink-0 grid-cols-2 gap-3"
								>
									<!-- 6 items per page (2 cols x 3 rows) -->
									<div
										v-for="(game, gameIndex) in games.slice(
											(pageIndex - 1) * 6,
											pageIndex * 6,
										)"
										:key="gameIndex"
										class="game-card group cursor-pointer"
										@click="launchGame(game.link)"
									>
										<div
											class="flex h-32 w-36 flex-col rounded-lg bg-gray-950 p-2 shadow-xl transition-transform hover:scale-105 lg:h-32 lg:w-40"
										>
											<div class="relative overflow-hidden rounded-sm">
												<!-- Game Image -->
												<img
													:src="`${baseImgUrl(game.link)}${game.gameImage}`"
													:alt="game.name"
													class="h-full w-full object-cover"
													loading="lazy"
													decoding="auto"
												/>

												<!-- Trending Badge -->
												<div
													v-if="game.isFavourite"
													class="absolute top-0 left-0 rounded-br-lg bg-red-500 px-2 py-1 text-[10px] font-semibold text-white"
												>
													HOT
												</div>

												<!-- Hover Overlay -->
												<div
													class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/60"
												>
													<button
														class="inline-flex cursor-pointer items-center justify-center rounded-xl border-b border-gray-200 bg-gradient-to-br from-[#9d7e39] to-[#fbeb8c] px-4 py-1 text-xs font-bold text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100"
													>
														MAIN
													</button>
												</div>
											</div>

											<!-- Game Title -->
											<div class="flex-1 p-1">
												<h3
													class="line-clamp-1 text-xs leading-tight font-medium text-gray-200"
												>
													{{ game.name }}
												</h3>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Page Indicators -->
						<div class="mt-4 flex justify-center space-x-2">
							<div
								v-for="pageIndex in Math.ceil(games.length / 6)"
								:key="pageIndex"
								class="h-2 w-2 rounded-full transition-all"
								:class="
									popularCurrentIndex === pageIndex - 1
										? 'w-4 bg-[#fbeb8c]'
										: 'bg-gray-600'
								"
							></div>
						</div>
					</div>
				</div>

				<!-- Right Section - Trending & Server Info -->
				<div class="space-y-6">
					<!-- Trending Today Section -->
					<div class="rounded-xl bg-gray-800 p-6">
						<div class="mb-4 flex items-center gap-3">
							<div class="h-6 w-1 rounded-full bg-[#d7c068]"></div>
							<h2 class="text-lg font-bold text-white">TRENDING HARI INI</h2>
						</div>

						<!-- Trending Items -->
						<div
							ref="trendingCarouselRef"
							class="max-h-52 space-y-3 overflow-hidden"
						>
							<div
								v-for="(item, index) in trendingGameItems"
								:key="index"
								class="trending-item flex cursor-pointer items-center gap-3 rounded-lg bg-gray-700 p-3 transition-colors hover:bg-gray-600"
							>
								<!-- Game Image -->
								<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
									<img
										:src="`${baseImgUrl(item.link)}${item.gameImage}`"
										:alt="item.title"
										class="h-full w-full object-cover"
									/>
								</div>

								<!-- Info -->
								<div class="min-w-0 flex-1">
									<h4 class="line-clamp-1 text-sm font-medium text-white">
										{{ item.title }}
									</h4>
									<p class="mt-1 text-xs text-gray-400">
										{{ item.subtitle }}
									</p>
									<p class="mt-1 text-sm font-bold text-yellow-400">
										{{ item.amount }}
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Server Info Section -->
					<div class="rounded-xl bg-gray-800 p-6">
						<div class="text-center">
							<!-- Server Name -->
							<div
								class="mb-4 inline-block rounded-2xl border border-yellow-400 bg-gray-950 px-6 py-0.5"
							>
								<span class="text-xs font-bold text-white">{{
									serverInfo.name
								}}</span>
							</div>

							<!-- Server Number -->
							<div class="mb-4">
								<div
									class="rounded-lg border border-gray-600 bg-gray-950 p-4 text-4xl font-bold text-yellow-400"
								>
									{{ serverInfo.number }}
								</div>
							</div>

							<!-- Next Draw -->
							<div
								class="rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 px-4 py-1.5 text-xs font-bold text-gray-900"
							>
								<ClientOnly>
									<p>{{ serverInfo.nextDraw }}</p>
								</ClientOnly>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.game-card {
	will-change: transform;
}

/* Adjust height untuk 3 baris */
.h-28 {
	height: 7rem; /* 112px */
}
.lg\:h-32 {
	height: 8rem; /* 128px */
}

/* Image height adjustment */
.h-16 {
	height: 4rem; /* 64px */
}
.lg\:h-20 {
	height: 5rem; /* 80px */
}

/* Smooth scrolling */
.overflow-hidden {
	scroll-behavior: smooth;
}

/* Hide scrollbar */
.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

.overflow-x-auto {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

/* Line clamp utility */
.line-clamp-1 {
	display: -webkit-box;
	line-clamp: 1;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.line-clamp-2 {
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Hover animations */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.group:hover .opacity-0 {
	animation: fadeIn 0.3s ease-in-out forwards;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	/* Untuk mobile, tetap 2 kolom tapi lebih compact */
	.h-28 {
		height: 6rem; /* 96px */
	}

	.h-16 {
		height: 3.5rem; /* 56px */
	}

	.grid-cols-2 {
		gap: 8px;
	}
}
</style>
