<script setup lang="ts">
const { launchGame } = useGameLauncher();

const popularCurrentIndex = ref(0);
const popularCarouselRef = ref<HTMLElement>();
const autoScrollInterval = ref<NodeJS.Timeout | null>(null);
const isMobile = ref(false);

// Constants - akan berubah sesuai screen size
const ITEMS_PER_PAGE_DESKTOP = 3; // 3 games per page di desktop
const ITEMS_PER_PAGE_MOBILE = 2; // 2 games per page di mobile
const AUTO_SCROLL_DELAY = 4000;

const baseImgUrl = computed(() => {
	return (link: string) => {
		return `https://d33egg70nrp50s.cloudfront.net/Images/providers-v2/${link.split("/")[3]}/`;
	};
});

// Get items per page based on screen size
const itemsPerPage = computed(() => {
	return isMobile.value ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
});

// Calculate total pages
const totalPages = computed(() => {
	return Math.ceil(LatestAddedGameItems.length / itemsPerPage.value);
});

// Get games for current page
const paginatedGames = computed(() => {
	const pages = [];
	for (let i = 0; i < totalPages.value; i++) {
		const start = i * itemsPerPage.value;
		const end = start + itemsPerPage.value;
		pages.push(LatestAddedGameItems.slice(start, end));
	}
	return pages;
});

// Navigate to specific page
const goToPage = (pageIndex: number) => {
	if (!popularCarouselRef.value) return;

	popularCurrentIndex.value = pageIndex;

	// Calculate scroll position
	const containerWidth = popularCarouselRef.value.offsetWidth;
	const scrollAmount = pageIndex * containerWidth;

	popularCarouselRef.value.scrollTo({
		left: scrollAmount,
		behavior: "smooth",
	});
};

// Navigate prev/next
const navigatePopular = (direction: "prev" | "next") => {
	// Stop auto scroll when manually navigating
	stopAutoScroll();

	let newIndex;
	if (direction === "next") {
		newIndex = (popularCurrentIndex.value + 1) % totalPages.value;
	} else {
		newIndex =
			popularCurrentIndex.value === 0
				? totalPages.value - 1
				: popularCurrentIndex.value - 1;
	}

	goToPage(newIndex);

	// Resume auto scroll after 2 seconds
	setTimeout(() => {
		startAutoScroll();
	}, 2000);
};

// Auto scroll
const startAutoScroll = () => {
	if (autoScrollInterval.value) return;

	autoScrollInterval.value = setInterval(() => {
		const nextIndex = (popularCurrentIndex.value + 1) % totalPages.value;
		goToPage(nextIndex);
	}, AUTO_SCROLL_DELAY);
};

const stopAutoScroll = () => {
	if (autoScrollInterval.value) {
		clearInterval(autoScrollInterval.value);
		autoScrollInterval.value = null;
	}
};

// Handle scroll event to update current index
const handleScroll = () => {
	if (!popularCarouselRef.value) return;

	const containerWidth = popularCarouselRef.value.offsetWidth;
	const scrollLeft = popularCarouselRef.value.scrollLeft;
	const currentPage = Math.round(scrollLeft / containerWidth);

	if (currentPage !== popularCurrentIndex.value) {
		popularCurrentIndex.value = currentPage;
	}
};

// Check if mobile
const checkMobile = () => {
	isMobile.value = window.innerWidth < 768;
};

// Handle resize
const handleResize = () => {
	checkMobile();
	// Reset to first page when screen size changes
	popularCurrentIndex.value = 0;
	if (popularCarouselRef.value) {
		popularCarouselRef.value.scrollTo({
			left: 0,
			behavior: "auto",
		});
	}
};

// Get image
function getImageGame(game?: Game) {
	if (!game || !game.link || !game.gameImage) {
		return "/images/no-image.webp";
	}

	return `${baseImgUrl.value(game.link)}${game.gameImage}`;
}

// Lifecycle
onMounted(() => {
	checkMobile();
	startAutoScroll();

	// Add scroll event listener
	if (popularCarouselRef.value) {
		popularCarouselRef.value.addEventListener("scroll", handleScroll);
	}

	// Add resize listener
	window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
	stopAutoScroll();

	// Remove scroll event listener
	if (popularCarouselRef.value) {
		popularCarouselRef.value.removeEventListener("scroll", handleScroll);
	}

	// Remove resize listener
	window.removeEventListener("resize", handleResize);
});
</script>

<template>
	<div class="w-full bg-neutral-950 py-6">
		<div class="container mx-auto w-full px-2 lg:max-w-[1024px]">
			<div class="rounded-xl bg-neutral-800 p-4 lg:p-6">
				<!-- Header -->
				<div class="mb-4 flex items-center justify-between lg:mb-6">
					<div class="flex items-center gap-2 lg:gap-3">
						<div class="h-5 w-1 rounded-full bg-[#fbeb8c] lg:h-6"></div>
						<h2 class="text-base font-bold text-white uppercase lg:text-xl">
							Slots Game Baru
						</h2>
					</div>
					<!-- Navigation Buttons -->
					<div class="flex items-center gap-1 lg:gap-2">
						<button
							class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-neutral-700 transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 lg:h-8 lg:w-8"
							:disabled="totalPages <= 1"
							@click="navigatePopular('prev')"
						>
							<svg
								class="h-3 w-3 text-neutral-300 lg:h-4 lg:w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
							</svg>
						</button>
						<button
							class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-neutral-700 transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 lg:h-8 lg:w-8"
							:disabled="totalPages <= 1"
							@click="navigatePopular('next')"
						>
							<svg
								class="h-3 w-3 text-neutral-300 lg:h-4 lg:w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
							</svg>
						</button>
					</div>
				</div>

				<!-- Games Carousel -->
				<div
					ref="popularCarouselRef"
					class="carousel-container overflow-x-auto overflow-y-hidden scroll-smooth"
					@mouseenter="stopAutoScroll"
					@mouseleave="startAutoScroll"
				>
					<div class="flex">
						<!-- Each page shows 2 games (mobile) or 3 games (desktop) -->
						<div
							v-for="(pageGames, pageIndex) in paginatedGames"
							:key="pageIndex"
							class="carousel-page flex-shrink-0"
						>
							<!-- Grid: 2 columns (mobile) or 3 columns (desktop) -->
							<div class="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4">
								<div
									v-for="(game, gameIndex) in pageGames"
									:key="gameIndex"
									class="group cursor-pointer will-change-transform"
									@click="launchGame(game)"
								>
									<div
										class="flex flex-col overflow-hidden rounded-lg bg-neutral-950 shadow-xl transition-transform hover:scale-105"
									>
										<div class="relative overflow-hidden">
											<!-- Game Image -->
											<img
												:src="getImageGame(game)"
												:alt="game.name"
												class="aspect-video w-full object-cover"
												loading="lazy"
												decoding="auto"
											/>

											<!-- Trending Badge -->
											<div
												v-if="game.isFavourite"
												class="absolute top-0 left-0 rounded-br-lg bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white lg:px-2 lg:py-1 lg:text-xs"
											>
												HOT
											</div>

											<!-- Hover Overlay -->
											<div
												class="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/60"
											>
												<button
													class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-[#9d7e39] to-[#fbeb8c] px-4 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100 lg:rounded-xl lg:px-8 lg:py-2 lg:text-sm"
												>
													MAIN
												</button>
												<h3
													class="mt-1.5 line-clamp-2 px-1.5 text-center text-[10px] font-bold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 lg:mt-2 lg:px-2 lg:text-sm"
												>
													{{ game.name }}
												</h3>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Page Indicators -->
				<div
					v-if="totalPages > 1"
					class="mt-4 flex justify-center space-x-1.5 lg:mt-6 lg:space-x-2"
				>
					<button
						v-for="pageIndex in totalPages"
						:key="pageIndex"
						class="h-1.5 rounded-full transition-all lg:h-2"
						:class="
							popularCurrentIndex === pageIndex - 1
								? 'w-5 bg-[#fbeb8c] lg:w-6'
								: 'w-1.5 bg-neutral-600 hover:bg-neutral-500 lg:w-2'
						"
						@click="goToPage(pageIndex - 1)"
					></button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Carousel Container */
.carousel-container {
	scrollbar-width: none;
	-ms-overflow-style: none;
	scroll-snap-type: x mandatory;
}

.carousel-container::-webkit-scrollbar {
	display: none;
}

/* Carousel Page - Full Width */
.carousel-page {
	width: 100%;
	scroll-snap-align: start;
	padding: 0 1px;
}

/* Line clamp utility */
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
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.group:hover .opacity-0 {
	animation: fadeIn 0.3s ease-in-out forwards;
}

/* Smooth transitions */
* {
	-webkit-tap-highlight-color: transparent;
}

/* Responsive fine-tuning */
@media (max-width: 767px) {
	.carousel-page {
		padding: 0 0.5px;
	}
}
</style>
