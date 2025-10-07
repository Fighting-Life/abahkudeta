<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { useDebounceFn } from "@vueuse/core";

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const props = defineProps<{
	open: boolean;
}>();

const modelValue = useVModel(props, "open", emits, {
	passive: true,
});

const { allGames, baseImgUrl, categoryName, resetFilters } = useGames();

// Local state for search
const searchInput = ref("");
const searchResults = ref<Game[]>([]);
const isSearching = ref(false);
const displayLimit = ref(20); // Initial display limit

// Debounced search function (300ms delay)
const performSearch = useDebounceFn((searchTerm: string) => {
	isSearching.value = true;

	if (!searchTerm.trim()) {
		// Show first 20 popular games when no search
		searchResults.value = allGames.value.slice(0, 20);
		isSearching.value = false;
		return;
	}

	const term = searchTerm.toLowerCase().trim();
	const terms = term.split(" ").filter((t) => t.length > 0);

	// Optimized filtering with early returns
	const results = allGames.value.filter((game) => {
		// Quick name check first (most common match)
		const gameName = game.name.toLowerCase();
		if (gameName.includes(term)) return true;

		// Then game code
		const gameCode = game.gameCode.toLowerCase();
		if (gameCode.includes(term)) return true;

		// Then category
		const category = game.category.toLowerCase();
		if (category.includes(term)) return true;

		// Multi-word search
		if (terms.length > 1) {
			const searchableText = `${gameName} ${gameCode} ${category}`;
			return terms.every((t) => searchableText.includes(t));
		}

		return false;
	});

	// Limit results for performance
	searchResults.value = results.slice(0, 100);
	isSearching.value = false;
}, 300); // 300ms debounce

// Watch search input
watch(searchInput, (newValue) => {
	displayLimit.value = 20; // Reset display limit on new search
	performSearch(newValue);
});

// Load more results on scroll
const loadMore = () => {
	if (displayLimit.value < searchResults.value.length) {
		displayLimit.value += 20;
	}
};

// Visible results (for virtual scrolling effect)
const visibleResults = computed(() => {
	return searchResults.value.slice(0, displayLimit.value);
});

// Initialize with popular games
onMounted(() => {
	searchResults.value = allGames.value.slice(0, 20);
});

// Scroll handler with throttle
const scrollContainer = ref<HTMLElement | null>(null);
const handleScroll = useDebounceFn(() => {
	if (!scrollContainer.value) return;

	const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
	const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

	// Load more when scrolled 80%
	if (scrollPercentage > 0.8) {
		loadMore();
	}
}, 100);

function handleClose() {
	modelValue.value = false;
	searchInput.value = "";
	searchResults.value = allGames.value.slice(0, 20);
	displayLimit.value = 20;
	resetFilters();
}

// Navigate to game (you can customize this)
function handleGameClick(game: Game) {
	// Navigate or open game
	console.log("Selected game:", game);
	// navigateTo(game.link) or emit event
}
</script>

<template>
	<HeadlessTransitionRoot appear :show="modelValue" as="template">
		<HeadlessDialog as="div" class="relative z-[9999]" @close="handleClose">
			<HeadlessTransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
			</HeadlessTransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
					<HeadlessTransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<HeadlessDialogPanel
							class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-900 text-left align-middle shadow-xl transition-all"
						>
							<!-- Header (Fixed) -->
							<div
								class="sticky top-0 z-10 border-b border-gray-700 bg-gray-900 px-5 py-4"
							>
								<!-- Close Button -->
								<div class="absolute top-4 right-4">
									<button
										class="inline-flex cursor-pointer items-center justify-center text-white transition-colors hover:text-gray-300 active:scale-95"
										@click="handleClose"
									>
										<Icon name="ph:x-bold" class="text-xl font-bold" />
									</button>
								</div>

								<!-- Title -->
								<div class="mb-4 flex w-full items-center justify-center gap-2">
									<Icon
										name="ph:magnifying-glass-bold"
										class="text-xl text-yellow-400"
									/>
									<h2 class="text-lg font-bold text-white">Cari Game</h2>
								</div>

								<!-- Search Input -->
								<div class="relative w-full">
									<Input
										v-model="searchInput"
										name="search"
										type="text"
										placeholder="Cari nama game, kode, atau kategori..."
										autocomplete="off"
										class="h-11 w-full border-gray-700 bg-gray-800 pr-10 pl-10 text-white placeholder:text-gray-400 focus:border-yellow-400"
									/>
									<span
										class="absolute inset-y-0 left-0 flex items-center justify-center px-3"
									>
										<Search class="size-5 text-gray-400" />
									</span>
									<!-- Loading Indicator -->
									<span
										v-if="isSearching"
										class="absolute inset-y-0 right-0 flex items-center justify-center px-3"
									>
										<Icon
											name="svg-spinners:ring-resize"
											class="size-5 text-yellow-400"
										/>
									</span>
									<!-- Clear Button -->
									<button
										v-else-if="searchInput"
										class="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-400 hover:text-white"
										@click="searchInput = ''"
									>
										<Icon name="ph:x-circle-fill" class="size-5" />
									</button>
								</div>

								<!-- Results Count -->
								<div
									class="mt-2 flex items-center justify-between text-xs text-gray-400"
								>
									<span>
										{{
											searchInput
												? `${searchResults.length} hasil ditemukan`
												: "Game Populer"
										}}
									</span>
									<span v-if="visibleResults.length < searchResults.length">
										Menampilkan {{ visibleResults.length }} dari
										{{ searchResults.length }}
									</span>
								</div>
							</div>

							<!-- Results Container (Scrollable) -->
							<div
								ref="scrollContainer"
								class="max-h-[60vh] overflow-x-hidden overflow-y-auto px-5 py-4"
								@scroll="handleScroll"
							>
								<!-- Results Grid -->
								<div class="space-y-2">
									<TransitionGroup name="list">
										<button
											v-for="game in visibleResults"
											:key="game.gameCode"
											class="group hover:bg-gray-750 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 transition-all duration-200 hover:border-yellow-400 active:scale-[0.98]"
											@click="handleGameClick(game)"
										>
											<!-- Game Image -->
											<div
												class="relative flex-shrink-0 overflow-hidden rounded-md"
											>
												<NuxtImg
													:src="`${baseImgUrl(game.link)}${game.gameImage}`"
													:alt="game.name"
													class="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
													loading="lazy"
													decoding="async"
												/>
											</div>

											<!-- Game Info -->
											<div class="flex-1 space-y-1.5 text-left">
												<h3
													class="line-clamp-1 text-sm font-semibold text-gray-100 transition-colors group-hover:text-yellow-400"
												>
													{{ game.name }}
												</h3>
												<div class="flex items-center gap-2">
													<span
														class="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-0.5 text-[10px] font-bold text-gray-900 uppercase"
													>
														{{ categoryName(game.link) }}
													</span>
													<span v-if="game.isFavourite" class="text-red-500">
														<Icon name="mdi:heart" class="text-sm" />
													</span>
												</div>
											</div>

											<!-- Arrow Icon -->
											<div
												class="flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-yellow-400"
											>
												<Icon name="mdi:chevron-right" class="text-2xl" />
											</div>
										</button>
									</TransitionGroup>
								</div>

								<!-- Loading More Indicator -->
								<div
									v-if="visibleResults.length < searchResults.length"
									class="flex items-center justify-center py-4"
								>
									<Icon
										name="svg-spinners:ring-resize"
										class="size-6 text-yellow-400"
									/>
								</div>

								<!-- Empty State -->
								<div
									v-if="searchResults.length === 0 && !isSearching"
									class="flex flex-col items-center justify-center py-12 text-center"
								>
									<Icon
										name="mdi:magnify-close"
										class="mb-4 text-6xl text-gray-600"
									/>
									<p class="text-base font-medium text-gray-400">
										Tidak ada game ditemukan
									</p>
									<p class="mt-1 text-sm text-gray-500">Coba kata kunci lain</p>
								</div>
							</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: #1f2937;
	border-radius: 4px;
}

::-webkit-scrollbar-thumb {
	background: #4b5563;
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: #6b7280;
}

/* List transition animations */
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease;
}

.list-enter-from {
	opacity: 0;
	transform: translateX(-20px);
}

.list-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.list-move {
	transition: transform 0.3s ease;
}
</style>
