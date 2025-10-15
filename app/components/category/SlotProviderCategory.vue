<script setup lang="ts">
const props = defineProps<{
	providers: Partner[];
}>();

const emit = defineEmits<{
	(e: "selectProvider", provider?: Partner): void;
	(e: "filterChange", filter?: FilterType): void;
	(e: "onSearch", value?: string): void;
}>();

const route = useRoute();
const searchTerm = ref("");
const selectedFilter = ref<FilterType | undefined>(undefined);
const selectedProvider = ref<Partner | null | undefined>(undefined);
const carouselRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const isAutoScrolling = ref(true);
const autoScrollInterval = ref<number | null>(null);
const filters: FilterType[] = [
	"Semua permainan",
	"Top 20",
	"New",
	"Classic",
	"Bonus Buy",
	"Reel kingdom",
	"Megaways",
	"Jackpot Play Games",
	"Video Slots",
];
const visibleCount = 5;

const querySlug = computed(() => route.query.p as string | undefined);
const visibleProviders = computed(() => {
	const start = currentIndex.value;
	const providers = props.providers;
	const result = [];

	for (let i = 0; i < visibleCount; i++) {
		const index = (start + i) % providers.length;
		result.push(providers[index]);
	}

	return result;
});

watch(
	querySlug,
	(newSlug) => {
		if (newSlug) {
			selectedProvider.value = props.providers.find(
				(provider) => provider.slug === newSlug,
			);
			emit("selectProvider", selectedProvider.value);
		}
	},
	{ immediate: true },
);

const startAutoScroll = () => {
	if (autoScrollInterval.value) return;

	autoScrollInterval.value = window.setInterval(() => {
		next();
	}, 3000);
};

const stopAutoScroll = () => {
	if (autoScrollInterval.value) {
		clearInterval(autoScrollInterval.value);
		autoScrollInterval.value = null;
	}
};

const next = () => {
	currentIndex.value = (currentIndex.value + 1) % props.providers.length;
};

const prev = () => {
	currentIndex.value =
		currentIndex.value === 0
			? props.providers.length - 1
			: currentIndex.value - 1;
};

const selectProvider = async (provider?: Partner) => {
	await navigateTo({
		name: "category-game",
		query: {
			p: provider?.slug,
		},
	});
	// selectedProvider.value = provider;
	// emit("selectProvider", provider);
};

const selectFilter = (filter?: FilterType) => {
	selectedFilter.value = filter;
	emit("filterChange", filter);
};
const onSearchChange = (e: Event) => {
	searchTerm.value = (e.target as HTMLInputElement).value;
	emit("onSearch", (e.target as HTMLInputElement).value);
};

onMounted(() => {
	if (isAutoScrolling.value) {
		startAutoScroll();
	}
});

onUnmounted(() => {
	stopAutoScroll();
});
</script>

<template>
	<div class="provider-section">
		<!-- Carousel -->
		<div
			class="carousel-wrapper"
			@mouseenter="stopAutoScroll"
			@mouseleave="isAutoScrolling && startAutoScroll()"
		>
			<!-- Prev Button -->
			<button
				class="carousel-btn carousel-btn-prev cursor-pointer"
				@click="prev"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<!-- Providers Container -->
			<div ref="carouselRef" class="carousel-container">
				<!-- Desktop View: 5 items -->
				<div class="hidden items-center justify-center gap-8 lg:flex lg:gap-12">
					<div
						v-for="provider in visibleProviders"
						:key="provider?.slug"
						class="provider-item group"
						@click="selectProvider(provider)"
					>
						<div class="provider-logo-wrapper">
							<nuxt-img
								:src="provider?.logo_colored"
								:alt="provider?.name"
								class="provider-logo"
								loading="lazy"
							/>
						</div>
						<p class="provider-name">{{ provider?.name }}</p>
					</div>
				</div>

				<!-- Mobile View: 3 items -->
				<div class="flex items-center justify-center gap-6 lg:hidden">
					<div
						v-for="provider in visibleProviders.slice(0, 3)"
						:key="provider?.slug"
						class="provider-item group"
						@click="selectProvider(provider)"
					>
						<div class="provider-logo-wrapper">
							<nuxt-img
								:src="provider?.logo_colored"
								:alt="provider?.name"
								class="provider-logo"
								loading="lazy"
							/>
						</div>
						<p class="provider-name">{{ provider?.name }}</p>
					</div>
				</div>
			</div>

			<!-- Next Button -->
			<button
				class="carousel-btn carousel-btn-next cursor-pointer"
				@click="next"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>

		<!-- Progress Bar -->
		<div class="progress-bar-container">
			<div class="progress-bar-track">
				<div
					class="progress-bar-fill"
					:style="{
						width: `${((currentIndex + 1) / providers.length) * 100}%`,
					}"
				></div>
			</div>
		</div>

		<!-- Filters -->
		<div class="filters-section">
			<!-- Desktop Filter -->
			<div class="hidden flex-wrap items-center gap-4 lg:flex">
				<button
					v-for="filter in filters"
					:key="filter"
					class="filter-btn cursor-pointer"
					:class="{ 'filter-btn-active': selectedFilter === filter }"
					@click="selectFilter(filter)"
				>
					{{ filter }}
				</button>
			</div>

			<!-- Mobile Filter & Search -->
			<div class="flex w-full flex-col gap-3 lg:hidden">
				<!-- Search Input -->
				<div class="relative">
					<input
						v-model="searchTerm"
						type="text"
						placeholder="Cari Permainan"
						class="search-input"
						@input="onSearchChange"
					/>
					<svg
						class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>

				<!-- Mobile Dropdown Filter -->
				<Select
					v-model="selectedFilter"
					@update:model-value="selectFilter(selectedFilter)"
				>
					<SelectTrigger class="filter-select bg-neutral-900 text-neutral-100">
						<SelectValue placeholder="Pilih" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<!-- <SelectLabel>Fruits</SelectLabel> -->
							<SelectItem
								v-for="filter in filters"
								:key="filter"
								:value="filter"
							>
								{{ filter }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<!-- Desktop Search (right side) -->
			<div class="ml-auto hidden lg:flex">
				<div class="relative">
					<input
						v-model="searchTerm"
						type="text"
						placeholder="Cari Permainan"
						class="search-input"
						@input="onSearchChange"
					/>
					<svg
						class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-neutral-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";
.provider-section {
	@apply w-full space-y-4 rounded-lg bg-neutral-900 p-4 lg:space-y-6 lg:p-6;
}

/* Carousel */
.carousel-wrapper {
	@apply relative flex items-center justify-between gap-4;
}

.carousel-container {
	@apply flex-1 overflow-hidden;
}

.carousel-btn {
	@apply z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-neutral-700 lg:h-10 lg:w-10;
}

.carousel-btn:hover {
	@apply scale-110;
}

.carousel-btn:active {
	@apply scale-95;
}

/* Provider Item */
.provider-item {
	@apply flex cursor-pointer flex-col items-center gap-2 transition-all duration-300;
}

.provider-logo-wrapper {
	@apply flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-700/50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-neutral-600/50 lg:h-20 lg:w-20;
}

.provider-logo {
	@apply h-full w-full object-contain;
}

.provider-name {
	@apply text-center text-xs font-semibold text-white lg:text-sm;
}

/* Progress Bar */
.progress-bar-container {
	@apply w-full px-4 lg:px-8;
}

.progress-bar-track {
	@apply h-1 w-full overflow-hidden rounded-full bg-neutral-800;
}

.progress-bar-fill {
	@apply h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 ease-linear;
}

/* Filters Section */
.filters-section {
	@apply flex items-center gap-4 border-t border-neutral-800 pt-4;
}

.filter-btn {
	@apply rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-neutral-300 transition-all duration-200 hover:bg-neutral-800/50 hover:text-white;
}

.filter-btn-active {
	@apply bg-neutral-800/80 text-yellow-400;
}

/* Search Input */
.search-input {
	@apply w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-white placeholder-neutral-400 transition-colors focus:border-yellow-500 focus:outline-none lg:w-[280px];
}

/* Mobile Select */
.filter-select {
	@apply w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-yellow-500 focus:outline-none;
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	background-position: right 0.5rem center;
	background-repeat: no-repeat;
	background-size: 1.5em 1.5em;
	padding-right: 2.5rem;
}
</style>
