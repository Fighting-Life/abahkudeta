<script setup lang="ts">
import { cn } from "~/lib/utils";

interface Props {
	categorySlug?: string;
	filteredType?: string;
	searchTerm?: string;
	selectedProvider?: Partner;
	initialLimit?: number;
	loadMoreIncrement?: number;
	useFilter?: boolean; // Toggle antara filter atau slug
}
const props = withDefaults(defineProps<Props>(), {
	initialLimit: 12,
	loadMoreIncrement: 12,
	useFilter: false,
});
const { gameByArcadeCategorySlug, baseImgUrl, filterArcadeGames } =
	useArcadeGames();
const { launchGame } = useGameLauncher();

const isMounted = ref(false);

// Pagination state
const displayLimit = ref(props.initialLimit);
const isLoadingMore = ref(false);

// Get filtered games
const allCategoryGames = computed(() => {
	if (props.useFilter) {
		return filterArcadeGames({
			filter: props.filteredType as ArcadeFilterType,
			provider: props.selectedProvider,
			searchTerm: props.searchTerm,
			limit: 9999,
		});
	} else {
		return gameByArcadeCategorySlug.value(props.categorySlug || "pp", 9999);
	}
});

const displayedGames = computed(() => {
	return allCategoryGames.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
	return displayLimit.value < allCategoryGames.value.length;
});

const totalGames = computed(() => allCategoryGames.value.length);

// Progress percentage
const progress = computed(() => {
	if (totalGames.value === 0) return 0;
	return Math.round((displayLimit.value / totalGames.value) * 100);
});

// Badge cache to prevent random changes (hydration fix)
const badgeCache = ref<Map<string, "HOT" | "NEW">>(new Map());

const getBadgeType = (gameCode: string): "HOT" | "NEW" => {
	if (!isMounted.value) return "HOT"; // Default for SSR

	if (!badgeCache.value.has(gameCode)) {
		badgeCache.value.set(gameCode, Math.random() > 0.5 ? "HOT" : "NEW");
	}
	return badgeCache.value.get(gameCode)!;
};

const showBadge = (game: Game): boolean => {
	if (!isMounted.value) return false; // No random badges during SSR
	return game.isFavourite || Math.random() > 0.7;
};

// Load more handler
const loadMore = () => {
	if (isLoadingMore.value || !hasMore.value) return;

	isLoadingMore.value = true;

	setTimeout(() => {
		displayLimit.value += props.loadMoreIncrement;
		isLoadingMore.value = false;
	}, 300);
};

// Intersection Observer for infinite scroll
const loadMoreTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
	isMounted.value = true;

	if (!loadMoreTrigger.value) return;

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries[0]?.isIntersecting && hasMore.value) {
				loadMore();
			}
		},
		{ threshold: 0.1 },
	);

	observer.observe(loadMoreTrigger.value);

	onUnmounted(() => {
		observer.disconnect();
	});
});

const handleGameClick = (game: Game) => {
	// console.log("Play game:", game);
	launchGame(game.link);
};

watch(
	() => [
		props.categorySlug,
		props.filteredType,
		props.selectedProvider,
		props.searchTerm,
	],
	() => {
		displayLimit.value = props.initialLimit;
		badgeCache.value.clear();
	},
);
</script>

<template>
	<div class="w-full space-y-6">
		<!-- Header -->
		<div class="flex items-center gap-3">
			<div
				class="h-8 w-1 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600"
			/>
			<h2 class="text-xl font-bold text-white uppercase sm:text-2xl">
				{{ selectedProvider?.name }}
			</h2>
			<ClientOnly>
				<span v-if="totalGames > 0" class="text-sm text-gray-400">
					({{ totalGames }} games)
				</span>
			</ClientOnly>
		</div>

		<!-- SSR Skeleton -->
		<div
			v-if="!isMounted"
			class="flex flex-col items-center justify-center gap-4 py-6"
		>
			<div class="flex items-center gap-2">
				<Icon
					name="svg-spinners:ring-resize"
					class="text-2xl text-yellow-400"
				/>
				<span class="text-sm text-gray-400">Memuat game...</span>
			</div>
		</div>

		<client-only>
			<!-- Games Grid -->
			<div
				class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
			>
				<TransitionGroup name="game-card">
					<div
						v-for="game in displayedGames"
						:key="game.gameCode"
						class="group relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/20"
					>
						<!-- Game Card -->
						<div class="relative aspect-[4/3] overflow-hidden">
							<!-- Badge (Top Left) -->
							<div
								v-if="game.isFavourite || Math.random() > 0.7"
								class="absolute top-2 left-2 z-10"
							>
								<div
									class="flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-[10px] font-bold text-white uppercase shadow-lg sm:text-xs"
								>
									<template v-if="game.isFavourite">
										<Icon name="mdi:heart" class="mr-1 text-xs" />
										FAV
									</template>
									<template v-else-if="Math.random() > 0.5"> HOT </template>
									<template v-else> NEW </template>
								</div>
							</div>

							<!-- Heart Icon (Top Right) -->
							<button
								class="absolute top-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 active:scale-90"
								@click.stop="game.isFavourite = !game.isFavourite"
							>
								<Icon
									:name="game.isFavourite ? 'mdi:heart' : 'mdi:heart-outline'"
									:class="
										cn(
											'text-lg transition-colors',
											game.isFavourite ? 'text-red-500' : 'text-white',
										)
									"
								/>
							</button>

							<!-- Game Image -->
							<NuxtImg
								:src="`${baseImgUrl(game.link)}${game.gameImage}`"
								:alt="game.name"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								loading="lazy"
								decoding="async"
							/>

							<!-- Hover Overlay with "Main" Button -->
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<button
									class="transform cursor-pointer rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-2.5 text-sm font-bold text-gray-900 uppercase shadow-lg transition-all hover:from-yellow-500 hover:to-yellow-700 hover:shadow-yellow-500/50 active:scale-95 sm:px-10 sm:py-3 sm:text-base"
									@click="handleGameClick(game)"
								>
									Main
								</button>
							</div>
						</div>

						<!-- Game Name -->
						<div class="p-2 sm:p-3">
							<h3
								class="line-clamp-2 text-xs font-semibold text-white transition-colors group-hover:text-yellow-400 sm:text-sm"
							>
								{{ game.name }}
							</h3>
						</div>
					</div>
				</TransitionGroup>
			</div>

			<!-- Load More Section -->
			<div
				v-if="hasMore || isLoadingMore"
				class="flex flex-col items-center justify-center gap-4 py-6"
			>
				<!-- Loading Indicator -->
				<div v-if="isLoadingMore" class="flex items-center gap-2">
					<Icon
						name="svg-spinners:ring-resize"
						class="text-2xl text-yellow-400"
					/>
					<span class="text-sm text-gray-400">Memuat game...</span>
				</div>

				<!-- Load More Trigger (for Intersection Observer) -->
				<div ref="loadMoreTrigger" class="h-10" />

				<!-- Manual Load More Button (Backup) -->
				<button
					v-if="hasMore && !isLoadingMore"
					class="cursor-pointer rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-3 text-sm font-bold text-gray-900 uppercase transition-all hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/50 active:scale-95"
					@click="loadMore"
				>
					Muat Lebih Banyak ({{ allCategoryGames.length - displayLimit }} lagi)
				</button>

				<!-- Progress Indicator -->
				<div class="w-full max-w-xs">
					<div
						class="mb-2 flex items-center justify-between text-xs text-gray-400"
					>
						<span>Menampilkan {{ displayLimit }} dari {{ totalGames }}</span>
						<span>{{ Math.round((displayLimit / totalGames) * 100) }}%</span>
					</div>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
						<div
							class="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
							:style="{ width: `${(displayLimit / totalGames) * 100}%` }"
						/>
					</div>
				</div>
			</div>

			<!-- All Games Loaded Message -->
			<div
				v-else-if="displayedGames.length > 0"
				class="flex flex-col items-center justify-center py-6 text-center"
			>
				<Icon name="mdi:check-circle" class="mb-2 text-4xl text-green-500" />
				<p class="text-sm font-medium text-gray-400">Semua game telah dimuat</p>
			</div>

			<!-- Empty State -->
			<div
				v-if="displayedGames.length === 0"
				class="flex flex-col items-center justify-center py-16 text-center"
			>
				<Icon
					name="mdi:gamepad-variant-outline"
					class="mb-4 text-6xl text-gray-600"
				/>
				<p class="text-lg font-medium text-gray-400">Tidak ada game tersedia</p>
				<p class="mt-1 text-sm text-gray-500">Coba kategori lain</p>
			</div>
		</client-only>
	</div>
</template>

<style scoped>
/* Card transition animations */
.game-card-enter-active {
	transition: all 0.4s ease-out;
}

.game-card-enter-from {
	opacity: 0;
	transform: scale(0.9) translateY(20px);
}

.game-card-enter-to {
	opacity: 1;
	transform: scale(1) translateY(0);
}

.game-card-move {
	transition: transform 0.4s ease;
}
</style>
