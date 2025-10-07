<script setup lang="ts">
const props = defineProps<{
	providers: Partner[];
}>();

const emit = defineEmits<{
	(e: "selectProvider", provider?: Partner): void;
}>();

const carouselRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const isAutoScrolling = ref(true);
const autoScrollInterval = ref<number | null>(null);

const visibleCount = 5;
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

const selectProvider = (provider?: Partner) => {
	emit("selectProvider", provider);
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
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";
.provider-section {
	@apply w-full space-y-4 rounded-lg bg-gray-900 p-4 lg:space-y-6 lg:p-6;
}

/* Carousel */
.carousel-wrapper {
	@apply relative flex items-center justify-between gap-4;
}

.carousel-container {
	@apply flex-1 overflow-hidden;
}

.carousel-btn {
	@apply z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-gray-700 lg:h-10 lg:w-10;
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
	@apply flex h-16 w-16 items-center justify-center rounded-xl bg-gray-700/50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-600/50 lg:h-20 lg:w-20;
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
	@apply h-1 w-full overflow-hidden rounded-full bg-gray-800;
}

.progress-bar-fill {
	@apply h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 ease-linear;
}

/* Filters Section */
.filters-section {
	@apply flex items-center gap-4 border-t border-gray-800 pt-4;
}

.filter-btn {
	@apply rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-800/50 hover:text-white;
}

.filter-btn-active {
	@apply bg-gray-800/80 text-yellow-400;
}

/* Search Input */
.search-input {
	@apply w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-sm text-white placeholder-gray-400 transition-colors focus:border-yellow-500 focus:outline-none lg:w-[280px];
}

/* Mobile Select */
.filter-select {
	@apply w-full appearance-none rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-yellow-500 focus:outline-none;
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	background-position: right 0.5rem center;
	background-repeat: no-repeat;
	background-size: 1.5em 1.5em;
	padding-right: 2.5rem;
}
</style>
