<script setup lang="ts">
interface Props {
	items?: CarouselItem[];
	autoSlide?: boolean;
	slideInterval?: number;
	transitionDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
	autoSlide: true,
	slideInterval: 2000,
	transitionDuration: 800,
});

const carouselItems = computed(() => props.items || defaultCarouselItems);

// Reactive state
const currentSlide = ref(0);
const isVertical = ref(false);
const autoSlideInterval = ref<NodeJS.Timeout | null>(null);
const carouselContainer = ref<HTMLElement | null>(null);
const isTransitioning = ref(false);

// Auto slide configuration
const SLIDE_INTERVAL = computed(() => props.slideInterval);
const TRANSITION_DURATION = computed(() => props.transitionDuration);

// Random direction generator
const getRandomDirection = (): boolean => {
	return Math.random() > 0.5;
};

// Go to specific slide
const goToSlide = (index: number, vertical: boolean = false) => {
	if (isTransitioning.value || index === currentSlide.value) return;

	isTransitioning.value = true;
	isVertical.value = vertical;
	currentSlide.value = index;

	setTimeout(() => {
		isTransitioning.value = false;
	}, TRANSITION_DURATION.value);
};

// Auto slide function
const startAutoSlide = () => {
	if (autoSlideInterval.value) {
		clearInterval(autoSlideInterval.value);
	}

	autoSlideInterval.value = setInterval(() => {
		const nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
		const randomVertical = getRandomDirection();
		goToSlide(nextIndex, randomVertical);
	}, SLIDE_INTERVAL.value);
};

// Stop auto slide
const stopAutoSlide = () => {
	if (autoSlideInterval.value) {
		clearInterval(autoSlideInterval.value);
		autoSlideInterval.value = null;
	}
};

// Handle manual slide selection
const handleSlideSelect = (index: number) => {
	stopAutoSlide();
	const randomVertical = getRandomDirection();
	goToSlide(index, randomVertical);

	// Restart auto slide after manual selection
	setTimeout(() => {
		if (props.autoSlide) {
			startAutoSlide();
		}
	}, SLIDE_INTERVAL.value);
};

// Lifecycle hooks
onMounted(() => {
	if (props.autoSlide) {
		startAutoSlide();
	}
});

onUnmounted(() => {
	stopAutoSlide();
});

// Computed styles for transformation
const getTransformStyle = () => {
	const translateValue = currentSlide.value * -100;
	if (isVertical.value) {
		return `translateY(${translateValue}%)`;
	}
	return `translateX(${translateValue}%)`;
};
</script>

<template>
	<div
		class="relative h-[200px] w-full overflow-hidden rounded-lg bg-gray-900 py-3 shadow-2xl md:h-[300px] lg:h-[400px] xl:h-[500px]"
	>
		<!-- Carousel Container -->
		<div
			ref="carouselContainer"
			class="carousel-track relative h-full w-full"
			:class="{
				'vertical-track': isVertical,
				'horizontal-track': !isVertical,
			}"
			:style="{
				transform: getTransformStyle(),
				transition: isTransitioning
					? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
					: 'none',
			}"
			@mouseenter="stopAutoSlide"
			@mouseleave="startAutoSlide"
		>
			<!-- Carousel Items -->
			<div
				v-for="(item, index) in carouselItems"
				:key="index"
				class="carousel-slide absolute inset-0 h-full w-full"
				:class="{
					'slide-vertical': isVertical,
					'slide-horizontal': !isVertical,
				}"
				:style="{
					transform: isVertical
						? `translateY(${index * 100}%)`
						: `translateX(${index * 100}%)`,
				}"
			>
				<NuxtLink :to="item.link" class="group block h-full w-full">
					<div class="relative h-full w-full overflow-hidden">
						<img
							:src="item.image"
							:alt="item.alt || `Slide ${index + 1}`"
							class="h-full w-full object-fill object-center transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
						/>
						<!-- Overlay for better text readability -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
						></div>
					</div>
				</NuxtLink>
			</div>
		</div>

		<!-- Bottom Pagination (Horizontal Dots) -->
		<div class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
			<div
				class="hidden items-center justify-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm md:flex"
			>
				<button
					v-for="(item, index) in defaultCarouselItems"
					:key="`bottom-${index}`"
					class="pagination-dot transition-all duration-300 hover:scale-125"
					:class="{
						'h-2 w-8 rounded-full bg-white': currentSlide === index,
						'h-2 w-2 rounded-full bg-white/50 hover:bg-white/70':
							currentSlide !== index,
					}"
					:aria-label="`Go to slide ${index + 1}`"
					@click="handleSlideSelect(index)"
				></button>
			</div>
		</div>

		<!-- Right Side Pagination (Vertical Dots) -->
		<div class="absolute top-1/2 right-4 z-10 -translate-y-1/2 transform">
			<div
				class="hidden flex-col items-center gap-3 rounded-full bg-black/30 px-2 py-4 backdrop-blur-sm md:flex"
			>
				<button
					v-for="(item, index) in defaultCarouselItems"
					:key="`right-${index}`"
					class="pagination-dot transition-all duration-300 hover:scale-125"
					:class="{
						'h-8 w-2 rounded-full bg-white': currentSlide === index,
						'h-2 w-2 rounded-full bg-white/50 hover:bg-white/70':
							currentSlide !== index,
					}"
					:aria-label="`Go to slide ${index + 1}`"
					@click="handleSlideSelect(index)"
				></button>
			</div>
		</div>

		<!-- Loading Indicator (Optional) -->
		<div
			v-if="isTransitioning"
			class="absolute inset-0 z-20 flex items-center justify-center bg-black/10"
		>
			<div
				class="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"
			></div>
		</div>

		<!-- Slide Counter (Top Right) -->
		<div
			class="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
		>
			{{ currentSlide + 1 }} / {{ defaultCarouselItems.length }}
		</div>
	</div>
</template>

<style scoped>
.carousel-track {
	will-change: transform;
}

.carousel-slide {
	backface-visibility: hidden;
}

.pagination-dot {
	cursor: pointer;
	will-change: transform, background-color;
}

.pagination-dot:focus {
	outline: 2px solid rgba(255, 255, 255, 0.5);
	outline-offset: 2px;
}

/* Smooth transitions for different screen sizes */
@media (max-width: 768px) {
	.carousel-track {
		transition-duration: 600ms;
	}
}

/* Hover effects */
.carousel-slide:hover {
	z-index: 1;
}

/* Loading animation */
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Custom scrollbar (if needed) */
.carousel-track::-webkit-scrollbar {
	display: none;
}

.carousel-track {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
