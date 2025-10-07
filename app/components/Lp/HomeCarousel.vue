<script setup lang="ts">
interface Props {
	items?: CarouselItem[];
	autoSlide?: boolean;
	slideInterval?: number;
	transitionDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
	autoSlide: true,
	slideInterval: 3000,
	transitionDuration: 800,
});

const carouselItems = computed(() => props.items || defaultCarouselItems);

// Reactive state
const currentSlide = ref(0);
const isVertical = ref(false);
const autoSlideInterval = ref<NodeJS.Timeout | null>(null);
const carouselContainer = ref<HTMLElement | null>(null);
const isTransitioning = ref(false);

// Drag/Swipe state
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const dragOffset = ref(0);
const dragDirection = ref<"horizontal" | "vertical" | null>(null);

// Auto slide configuration
const SLIDE_INTERVAL = computed(() => props.slideInterval);
const TRANSITION_DURATION = computed(() => props.transitionDuration);
const DRAG_THRESHOLD = 50; // Minimum pixels to trigger slide change
const DIRECTION_THRESHOLD = 30; // Pixels to determine drag direction

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

	setTimeout(() => {
		if (props.autoSlide) {
			startAutoSlide();
		}
	}, SLIDE_INTERVAL.value);
};

// Drag/Swipe handlers
const handleDragStart = (e: MouseEvent | TouchEvent) => {
	if (isTransitioning.value) return;

	isDragging.value = true;
	stopAutoSlide();

	const point = "touches" in e ? e.touches[0] : e;
	startX.value = point?.clientX ?? 0;
	startY.value = point?.clientY ?? 0;
	currentX.value = point?.clientX ?? 0;
	currentY.value = point?.clientY ?? 0;
	dragDirection.value = null;

	// Prevent text selection during drag
	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = "grabbing";
	}
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
	if (!isDragging.value) return;

	const point = "touches" in e ? e.touches[0] : e;
	currentX.value = point?.clientX ?? 0;
	currentY.value = point?.clientY ?? 0;

	const deltaX = currentX.value - startX.value;
	const deltaY = currentY.value - startY.value;

	// Determine drag direction if not set
	if (!dragDirection.value) {
		if (
			Math.abs(deltaX) > DIRECTION_THRESHOLD ||
			Math.abs(deltaY) > DIRECTION_THRESHOLD
		) {
			dragDirection.value =
				Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
		}
	}

	// Calculate drag offset based on direction
	if (dragDirection.value === "horizontal") {
		dragOffset.value = deltaX;
		// Prevent vertical scroll
		e.preventDefault();
	} else if (dragDirection.value === "vertical") {
		dragOffset.value = deltaY;
		// Prevent horizontal scroll
		e.preventDefault();
	}
};

const handleDragEnd = () => {
	if (!isDragging.value) return;

	isDragging.value = false;

	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = "grab";
	}

	const containerWidth = carouselContainer.value?.offsetWidth || 0;
	const containerHeight = carouselContainer.value?.offsetHeight || 0;

	let shouldChange = false;
	let nextIndex = currentSlide.value;
	let vertical = false;

	// Determine if slide should change based on drag distance
	if (dragDirection.value === "horizontal") {
		const threshold = containerWidth * 0.2; // 20% of width
		if (
			Math.abs(dragOffset.value) > threshold ||
			Math.abs(dragOffset.value) > DRAG_THRESHOLD
		) {
			shouldChange = true;
			vertical = false;
			if (dragOffset.value < 0) {
				// Drag left - next slide
				nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
			} else {
				// Drag right - previous slide
				nextIndex =
					currentSlide.value === 0
						? carouselItems.value.length - 1
						: currentSlide.value - 1;
			}
		}
	} else if (dragDirection.value === "vertical") {
		const threshold = containerHeight * 0.2; // 20% of height
		if (
			Math.abs(dragOffset.value) > threshold ||
			Math.abs(dragOffset.value) > DRAG_THRESHOLD
		) {
			shouldChange = true;
			vertical = true;
			if (dragOffset.value < 0) {
				// Drag up - next slide
				nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
			} else {
				// Drag down - previous slide
				nextIndex =
					currentSlide.value === 0
						? carouselItems.value.length - 1
						: currentSlide.value - 1;
			}
		}
	}

	// Reset drag state
	dragOffset.value = 0;
	dragDirection.value = null;

	// Change slide if needed
	if (shouldChange) {
		goToSlide(nextIndex, vertical);
	}

	// Restart auto slide
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

	// Set initial cursor
	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = "grab";
	}

	// Add global event listeners for drag end
	window.addEventListener("mouseup", handleDragEnd);
	window.addEventListener("touchend", handleDragEnd);
});

onUnmounted(() => {
	stopAutoSlide();
	window.removeEventListener("mouseup", handleDragEnd);
	window.removeEventListener("touchend", handleDragEnd);
});

// Computed styles for transformation
const getTransformStyle = () => {
	const baseTranslate = currentSlide.value * -100;

	// Add drag offset if dragging
	if (isDragging.value && carouselContainer.value) {
		if (dragDirection.value === "horizontal") {
			const containerWidth = carouselContainer.value.offsetWidth;
			const offsetPercent = (dragOffset.value / containerWidth) * 100;
			return `translateX(${baseTranslate + offsetPercent}%)`;
		} else if (dragDirection.value === "vertical") {
			const containerHeight = carouselContainer.value.offsetHeight;
			const offsetPercent = (dragOffset.value / containerHeight) * 100;
			return `translateY(${baseTranslate + offsetPercent}%)`;
		}
	}

	// Normal transform
	if (isVertical.value) {
		return `translateY(${baseTranslate}%)`;
	}
	return `translateX(${baseTranslate}%)`;
};

// Prevent context menu on long press
const handleContextMenu = (e: MouseEvent) => {
	if (isDragging.value) {
		e.preventDefault();
	}
};
</script>

<template>
	<div
		class="relative h-[200px] w-full overflow-hidden rounded-lg bg-gray-900 py-3 shadow-2xl md:h-[300px] lg:h-[400px] xl:h-[500px]"
	>
		<!-- Carousel Container -->
		<div
			ref="carouselContainer"
			class="carousel-track relative h-full w-full select-none"
			:class="{
				'vertical-track': isVertical,
				'horizontal-track': !isVertical,
				'cursor-grabbing': isDragging,
				'cursor-grab': !isDragging,
			}"
			:style="{
				transform: getTransformStyle(),
				transition:
					isDragging || !isTransitioning
						? 'none'
						: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
			}"
			@mousedown="handleDragStart"
			@touchstart.passive="handleDragStart"
			@mousemove="handleDragMove"
			@touchmove="handleDragMove"
			@contextmenu="handleContextMenu"
			@mouseenter="stopAutoSlide"
			@mouseleave="!isDragging && startAutoSlide()"
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
					:target="item.is_external ? '_blank' : null"
					:external="item.is_external"
					class="group pointer-events-none block h-full w-full"
					:class="{ 'pointer-events-auto': !isDragging }"
					@click.prevent="isDragging && $event.preventDefault()"
				>
					<div class="relative h-full w-full overflow-hidden">
						<img
							:src="item.image"
							:alt="item.alt || `Slide ${index + 1}`"
							class="h-full w-full object-fill object-center transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
							draggable="false"
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

		<!-- Right Side Pagination (Vertical Dots) -->
		<div class="absolute top-1/2 right-4 z-10 -translate-y-1/2 transform">
			<div
				class="hidden flex-col items-center gap-3 rounded-full bg-black/30 px-2 py-4 backdrop-blur-sm md:flex"
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

		<!-- Drag Indicator -->
		<div v-if="isDragging" class="pointer-events-none absolute inset-0 z-30">
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-4 backdrop-blur-md"
			>
				<Icon
					v-if="dragDirection === 'horizontal'"
					:name="dragOffset < 0 ? 'mdi:chevron-right' : 'mdi:chevron-left'"
					class="text-4xl text-white"
				/>
				<Icon
					v-else-if="dragDirection === 'vertical'"
					:name="dragOffset < 0 ? 'mdi:chevron-down' : 'mdi:chevron-up'"
					class="text-4xl text-white"
				/>
			</div>
		</div>

		<!-- Loading Indicator -->
		<div
			v-if="isTransitioning && !isDragging"
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
			{{ currentSlide + 1 }} / {{ carouselItems.length }}
		</div>

		<!-- Swipe Hint (Mobile) -->
		<div
			class="pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transform md:hidden"
		>
			<div
				class="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-xs text-white/70 backdrop-blur-sm"
			>
				<Icon name="mdi:gesture-swipe-horizontal" class="text-lg" />
				<span>Geser untuk slide</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.carousel-track {
	will-change: transform;
	touch-action: pan-y pan-x;
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

/* Prevent image dragging */
img {
	-webkit-user-drag: none;
	-khtml-user-drag: none;
	-moz-user-drag: none;
	-o-user-drag: none;
	user-drag: none;
}

/* Smooth transitions for different screen sizes */
@media (max-width: 768px) {
	.carousel-track {
		transition-duration: 600ms;
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

/* Custom scrollbar (if needed) */
.carousel-track::-webkit-scrollbar {
	display: none;
}

.carousel-track {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* Cursor states */
.cursor-grab {
	cursor: grab;
}

.cursor-grabbing {
	cursor: grabbing;
}
</style>
