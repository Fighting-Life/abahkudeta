<script setup lang="ts">
interface Props {
	items?: CarouselItem[];
	autoSlide?: boolean;
	slideInterval?: number;
	transitionDuration?: number;
	useTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	autoSlide: true,
	slideInterval: 3000,
	transitionDuration: 800,
	useTitle: false,
});

const carouselItems = computed(() => props.items || defaultCarouselItems);

const currentSlide = ref(0);
const isVertical = ref(false);
const autoSlideInterval = ref<NodeJS.Timeout | null>(null);
const carouselContainer = ref<HTMLElement | null>(null);
const isTransitioning = ref(false);

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
	}, props.transitionDuration);
};

// Manual next slide
const nextSlide = () => {
	const nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
	const randomVertical = getRandomDirection();
	goToSlide(nextIndex, randomVertical);
};

// Manual previous slide
const prevSlide = () => {
	const prevIndex =
		currentSlide.value === 0
			? carouselItems.value.length - 1
			: currentSlide.value - 1;
	const randomVertical = getRandomDirection();
	goToSlide(prevIndex, randomVertical);
};

// Auto slide function
const startAutoSlide = () => {
	if (!props.autoSlide) return;

	if (autoSlideInterval.value) {
		clearInterval(autoSlideInterval.value);
	}

	autoSlideInterval.value = setInterval(() => {
		nextSlide();
	}, props.slideInterval);
};

// Stop auto slide
const stopAutoSlide = () => {
	if (autoSlideInterval.value) {
		clearInterval(autoSlideInterval.value);
		autoSlideInterval.value = null;
	}
};

const handleSlideSelect = (index: number) => {
	stopAutoSlide();
	const randomVertical = getRandomDirection();
	goToSlide(index, randomVertical);

	setTimeout(() => {
		startAutoSlide();
	}, props.slideInterval);
};

onMounted(() => {
	if (props.autoSlide) {
		startAutoSlide();
	}
});

onUnmounted(() => {
	stopAutoSlide();
});

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
		class="relative h-[200px] w-full overflow-hidden rounded-lg bg-gray-900 shadow-2xl md:h-[300px] lg:h-[400px] xl:h-[500px]"
	>
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
					? `transform ${props.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
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
				<NuxtLink
					:to="item.link"
					:external="item.is_external"
					:target="item.is_external ? '_blank' : null"
					class="group block h-full w-full"
				>
					<div class="relative h-full w-full overflow-hidden">
						<img
							:src="item.image"
							:alt="item.alt || `Slide ${index + 1}`"
							class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
							draggable="false"
						/>
						<!-- Overlay -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
						></div>

						<!-- Content -->
						<div
							v-if="useTitle"
							class="absolute right-4 bottom-4 left-4 text-white"
						>
							<h3 class="mb-2 text-xl font-bold drop-shadow-lg md:text-2xl">
								{{ item.alt }}
							</h3>
						</div>
					</div>
				</NuxtLink>
			</div>
		</div>

		<!-- Navigation Buttons - PREV -->
		<button
			class="nav-button nav-button-prev absolute top-1/2 left-4 z-20 -translate-y-1/2 transform"
			:aria-label="'Previous slide'"
			@click="prevSlide"
		>
			<Icon name="mdi:chevron-left" class="text-2xl" />
		</button>

		<!-- Navigation Buttons - NEXT -->
		<button
			class="nav-button nav-button-next absolute top-1/2 right-4 z-20 -translate-y-1/2 transform"
			:aria-label="'Next slide'"
			@click="nextSlide"
		>
			<Icon name="mdi:chevron-right" class="text-2xl" />
		</button>

		<!-- Bottom Pagination -->
		<div class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
			<div
				class="flex items-center justify-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm"
			>
				<button
					v-for="(item, index) in carouselItems"
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

		<!-- Right Pagination -->
		<div class="absolute top-1/2 right-4 z-10 -translate-y-1/2 transform">
			<div
				class="flex flex-col items-center gap-3 rounded-full bg-black/30 px-2 py-4 backdrop-blur-sm"
			>
				<button
					v-for="(item, index) in carouselItems"
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

		<!-- Loading Indicator -->
		<div
			v-if="isTransitioning"
			class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/10"
		>
			<div
				class="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"
			></div>
		</div>

		<!-- Slide Counter -->
		<div
			class="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
		>
			{{ currentSlide + 1 }} / {{ carouselItems.length }}
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

/* Navigation Buttons */
.nav-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(8px);
	color: white;
	border: 2px solid rgba(255, 255, 255, 0.2);
	cursor: pointer;
	transition: all 0.3s ease;
}

.nav-button:hover {
	background: rgba(0, 0, 0, 0.7);
	border-color: rgba(255, 255, 255, 0.4);
	transform: translateY(-50%) scale(1.1);
}

.nav-button:active {
	transform: translateY(-50%) scale(0.95);
}

.nav-button-prev:hover {
	transform: translateY(-50%) translateX(-4px) scale(1.1);
}

.nav-button-next:hover {
	transform: translateY(-50%) translateX(4px) scale(1.1);
}

/* Pagination Dots */
.pagination-dot {
	cursor: pointer;
	will-change: transform, background-color;
}

.pagination-dot:focus {
	outline: 2px solid rgba(255, 255, 255, 0.5);
	outline-offset: 2px;
}

/* Prevent image drag */
img {
	-webkit-user-drag: none;
	user-drag: none;
}

/* Smooth transitions */
@media (max-width: 768px) {
	.carousel-track {
		transition-duration: 600ms;
	}

	.nav-button {
		width: 40px;
		height: 40px;
	}
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

/* Hide scrollbar */
.carousel-track::-webkit-scrollbar {
	display: none;
}

.carousel-track {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
