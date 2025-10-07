<script setup lang="ts">
const props = defineProps<{
	providers: Partner[];
}>();

const emit = defineEmits<{
	(e: "selectProvider", provider?: Partner): void;
	(e: "filterChange", filter?: FilterType): void;
	(e: "onSearch", value?: string): void;
}>();

const searchTerm = ref("");
const selectedFilter = ref<FilterType | undefined>(undefined);
const selectedProvider = ref<Partner | null | undefined>(undefined);
const carouselRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const isAutoScrolling = ref(true);
const autoScrollInterval = ref<number | null>(null);

// Advanced drag state
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragOffset = ref(0);
const lastX = ref(0);
const lastTime = ref(0);
const velocity = ref(0);
const isAnimating = ref(false);
const hasMoved = ref(false);

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

const DRAG_THRESHOLD = 50;
const VELOCITY_THRESHOLD = 0.3;

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
	if (isAnimating.value) return;
	isAnimating.value = true;
	currentIndex.value = (currentIndex.value + 1) % props.providers.length;
	setTimeout(() => {
		isAnimating.value = false;
	}, 300);
};

const prev = () => {
	if (isAnimating.value) return;
	isAnimating.value = true;
	currentIndex.value =
		currentIndex.value === 0
			? props.providers.length - 1
			: currentIndex.value - 1;
	setTimeout(() => {
		isAnimating.value = false;
	}, 300);
};

const selectProvider = (provider?: Partner) => {
	if (isDragging.value || Math.abs(dragOffset.value) > 5) return;

	selectedProvider.value = provider;
	emit("selectProvider", provider);
};

const selectFilter = (filter?: FilterType) => {
	selectedFilter.value = filter;
	emit("filterChange", filter);
};

const onSearchChange = (e: Event) => {
	searchTerm.value = (e.target as HTMLInputElement).value;
	emit("onSearch", (e.target as HTMLInputElement).value);
};

const calculateVelocity = (currentTime: number) => {
	const timeDelta = currentTime - lastTime.value;
	if (timeDelta === 0) return 0;

	const distance = currentX.value - lastX.value;
	return distance / timeDelta;
};

const handleDragStart = (e: MouseEvent | TouchEvent) => {
	if (isAnimating.value) return;

	isDragging.value = true;
	stopAutoScroll();

	const point = "touches" in e ? e.touches[0] : e;
	startX.value = point?.clientX ?? 0;
	currentX.value = point?.clientX ?? 0;
	lastX.value = point?.clientX ?? 0;
	lastTime.value = Date.now();
	dragOffset.value = 0;
	velocity.value = 0;

	if (carouselRef.value) {
		carouselRef.value.style.cursor = "grabbing";
	}
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
	if (!isDragging.value) return;

	const point = "touches" in e ? e.touches[0] : e;
	const currentTime = Date.now();

	currentX.value = point?.clientX ?? 0;
	dragOffset.value = currentX.value - startX.value;

	velocity.value = calculateVelocity(currentTime);

	lastX.value = currentX.value;
	lastTime.value = currentTime;

	if (Math.abs(dragOffset.value) > 10) {
		e.preventDefault();
	}
};

const handleDragEnd = () => {
	if (!isDragging.value) return;

	const dragDistance = Math.abs(dragOffset.value);
	const dragDirection = dragOffset.value > 0 ? "right" : "left";

	if (carouselRef.value) {
		carouselRef.value.style.cursor = "grab";
	}

	const absVelocity = Math.abs(velocity.value);

	if (dragDistance > DRAG_THRESHOLD || absVelocity > VELOCITY_THRESHOLD) {
		if (dragDirection === "left" || velocity.value < -VELOCITY_THRESHOLD) {
			next();
		} else if (
			dragDirection === "right" ||
			velocity.value > VELOCITY_THRESHOLD
		) {
			prev();
		}
	}

	setTimeout(() => {
		isDragging.value = false;
		dragOffset.value = 0;
		velocity.value = 0;
	}, 50);

	setTimeout(() => {
		if (isAutoScrolling.value) {
			startAutoScroll();
		}
	}, 500);
};

const handleContextMenu = (e: MouseEvent) => {
	if (isDragging.value || Math.abs(dragOffset.value) > 10) {
		e.preventDefault();
	}
};

const carouselTransform = computed(() => {
	if (isDragging.value && dragOffset.value !== 0) {
		const maxOffset = 80;
		const clampedOffset = Math.max(
			-maxOffset,
			Math.min(maxOffset, dragOffset.value),
		);
		return `translateX(${clampedOffset}px)`;
	}
	return "translateX(0)";
});

const carouselTransition = computed(() => {
	if (isDragging.value) {
		return "none";
	}
	return "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
});

const carouselOpacity = computed(() => {
	if (isDragging.value && Math.abs(dragOffset.value) > 30) {
		const opacity = 1 - Math.abs(dragOffset.value) / 200;
		return Math.max(0.7, opacity);
	}
	return 1;
});

onMounted(() => {
	if (isAutoScrolling.value) {
		startAutoScroll();
	}

	if (carouselRef.value) {
		carouselRef.value.style.cursor = "grab";
	}

	window.addEventListener("mouseup", handleDragEnd);
});

onUnmounted(() => {
	stopAutoScroll();
	window.removeEventListener("mouseup", handleDragEnd);
});
</script>

<template>
	<div class="provider-section">
		<!-- Carousel -->
		<div
			class="carousel-wrapper"
			@mouseenter="stopAutoScroll"
			@mouseleave="!isDragging && isAutoScrolling && startAutoScroll()"
		>
			<!-- Prev Button -->
			<button
				class="carousel-btn carousel-btn-prev cursor-pointer"
				:disabled="isAnimating"
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
			<div
				ref="carouselRef"
				class="carousel-container select-none"
				:style="{
					transform: carouselTransform,
					transition: carouselTransition,
					opacity: carouselOpacity,
				}"
				@mousedown="handleDragStart"
				@mousemove="handleDragMove"
				@mouseleave="isDragging && handleDragEnd()"
				@touchstart.passive="handleDragStart"
				@touchmove="handleDragMove"
				@touchend="handleDragEnd"
				@contextmenu="handleContextMenu"
			>
				<!-- Desktop View: 5 items -->
				<div class="hidden items-center justify-center gap-8 lg:flex lg:gap-12">
					<TransitionGroup name="provider-slide">
						<div
							v-for="provider in visibleProviders"
							:key="provider?.slug"
							class="provider-item group"
							:class="{
								'pointer-events-none': isDragging || Math.abs(dragOffset) > 5,
								'scale-95': isDragging && Math.abs(dragOffset) > 30,
							}"
							@click="selectProvider(provider)"
						>
							<div class="provider-logo-wrapper">
								<nuxt-img
									:src="provider?.logo_colored"
									:alt="provider?.name"
									class="provider-logo"
									loading="lazy"
									draggable="false"
								/>
							</div>
							<p class="provider-name">{{ provider?.name }}</p>
						</div>
					</TransitionGroup>
				</div>

				<!-- Mobile View: 3 items -->
				<div class="flex items-center justify-center gap-6 lg:hidden">
					<TransitionGroup name="provider-slide">
						<div
							v-for="provider in visibleProviders.slice(0, 3)"
							:key="provider?.slug"
							class="provider-item group"
							:class="{
								'pointer-events-none': isDragging || Math.abs(dragOffset) > 5,
								'scale-95': isDragging && Math.abs(dragOffset) > 30,
							}"
							@click="selectProvider(provider)"
						>
							<div class="provider-logo-wrapper">
								<nuxt-img
									:src="provider?.logo_colored"
									:alt="provider?.name"
									class="provider-logo"
									loading="lazy"
									draggable="false"
								/>
							</div>
							<p class="provider-name">{{ provider?.name }}</p>
						</div>
					</TransitionGroup>
				</div>

				<!-- Drag Indicator -->
				<Transition name="fade">
					<div
						v-if="isDragging && Math.abs(dragOffset) > 30"
						class="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
					>
						<div
							class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md"
							:class="{
								'animate-pulse': Math.abs(dragOffset) > DRAG_THRESHOLD,
							}"
						>
							<Icon
								:name="
									dragOffset > 0 ? 'mdi:chevron-left' : 'mdi:chevron-right'
								"
								class="text-2xl text-white"
							/>
							<span class="text-xs font-medium text-white">
								{{ dragOffset > 0 ? "Previous" : "Next" }}
							</span>
						</div>
					</div>
				</Transition>

				<!-- Velocity Indicator (Debug - Optional) -->
				<div
					v-if="false && isDragging && Math.abs(velocity) > 0.1"
					class="pointer-events-none absolute top-2 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm"
				>
					Velocity: {{ velocity.toFixed(2) }}
				</div>
			</div>

			<!-- Next Button -->
			<button
				class="carousel-btn carousel-btn-next cursor-pointer"
				:disabled="isAnimating"
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

		<!-- Swipe Hint (Mobile) -->
		<Transition name="fade">
			<div
				v-if="!isDragging"
				class="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 lg:hidden"
			>
				<Icon name="mdi:gesture-swipe-horizontal" class="text-lg" />
				<span>Geser untuk ganti provider</span>
			</div>
		</Transition>

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
						class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400"
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
					<SelectTrigger class="filter-select bg-gray-900 text-gray-100">
						<SelectValue placeholder="Pilih" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
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
						class="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400"
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
	@apply w-full space-y-4 rounded-lg bg-gray-900 p-4 lg:space-y-6 lg:p-6;
}

/* Carousel */
.carousel-wrapper {
	@apply relative flex items-center justify-between gap-4;
}

.carousel-container {
	@apply relative flex-1 overflow-hidden;
	cursor: grab;
	touch-action: pan-y;
	will-change: transform, opacity;
}

.carousel-container:active {
	cursor: grabbing;
}

.carousel-btn {
	@apply z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-800/50 text-white backdrop-blur-sm transition-all duration-200 hover:bg-gray-700 lg:h-10 lg:w-10;
}

.carousel-btn:hover:not(:disabled) {
	@apply scale-110;
}

.carousel-btn:active:not(:disabled) {
	@apply scale-95;
}

.carousel-btn:disabled {
	@apply cursor-not-allowed opacity-50;
}

/* Provider Item */
.provider-item {
	@apply flex cursor-pointer flex-col items-center gap-2 transition-all duration-300;
	user-select: none;
	-webkit-user-select: none;
}

.provider-item.pointer-events-none {
	@apply pointer-events-none;
}

.provider-item.scale-95 {
	@apply scale-95 opacity-80;
}

.provider-logo-wrapper {
	@apply flex h-16 w-16 items-center justify-center rounded-xl bg-gray-700/50 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-600/50 lg:h-20 lg:w-20;
}

.provider-logo {
	@apply h-full w-full object-contain;
	-webkit-user-drag: none;
	-khtml-user-drag: none;
	-moz-user-drag: none;
	-o-user-drag: none;
	user-drag: none;
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

/* Transitions */
.provider-slide-enter-active,
.provider-slide-leave-active {
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.provider-slide-enter-from {
	opacity: 0;
	transform: translateX(-20px);
}

.provider-slide-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Pulse animation */
@keyframes pulse {
	0%,
	100% {
		opacity: 1;
		transform: scale(1);
	}
	50% {
		opacity: 0.8;
		transform: scale(1.05);
	}
}

.animate-pulse {
	animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
