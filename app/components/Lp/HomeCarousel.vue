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

const currentSlide = ref(0);
const isVertical = ref(false);
const autoSlideInterval = ref<NodeJS.Timeout | null>(null);
const carouselContainer = ref<HTMLElement | null>(null);
const isTransitioning = ref(false);
const isDragging = ref(false);
const isMouseOver = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const dragOffset = ref(0);
const dragDirection = ref<"horizontal" | "vertical" | null>(null);

const SLIDE_INTERVAL = computed(() => props.slideInterval);
const TRANSITION_DURATION = computed(() => props.transitionDuration);
const DRAG_THRESHOLD = 50; // Minimum pixels to trigger slide change
const DIRECTION_THRESHOLD = 30; // Pixels to determine drag direction

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
		if (props.autoSlide) {
			startAutoSlide();
		}
	}, SLIDE_INTERVAL.value);
};

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

	// Set cursor to grabbing
	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = "grabbing";
	}

	// Prevent default hanya untuk mouse events, bukan touch
	if (!("touches" in e)) {
		e.preventDefault();
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
		// Hanya prevent default jika benar-benar diperlukan
		if (Math.abs(deltaX) > 5) {
			e.preventDefault();
		}
	} else if (dragDirection.value === "vertical") {
		dragOffset.value = deltaY;
		// Hanya prevent default jika benar-benar diperlukan
		if (Math.abs(deltaY) > 5) {
			e.preventDefault();
		}
	}
};
const handleDragEnd = () => {
	if (!isDragging.value) return;

	// console.log("Drag end triggered"); // Debug log

	// Reset semua drag state
	isDragging.value = false;
	dragOffset.value = 0;
	dragDirection.value = null;

	// Reset cursor dengan delay kecil untuk memastikan
	setTimeout(() => {
		if (carouselContainer.value) {
			carouselContainer.value.style.cursor = isMouseOver.value
				? "grab"
				: "default";
		}
	}, 50);

	const containerWidth = carouselContainer.value?.offsetWidth || 0;
	const containerHeight = carouselContainer.value?.offsetHeight || 0;

	let shouldChange = false;
	let nextIndex = currentSlide.value;
	let vertical = false;

	// Determine if slide should change based on drag distance
	if (dragDirection.value === "horizontal") {
		const threshold = containerWidth * 0.2;
		if (
			Math.abs(dragOffset.value) > threshold ||
			Math.abs(dragOffset.value) > DRAG_THRESHOLD
		) {
			shouldChange = true;
			vertical = false;
			if (dragOffset.value < 0) {
				nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
			} else {
				nextIndex =
					currentSlide.value === 0
						? carouselItems.value.length - 1
						: currentSlide.value - 1;
			}
		}
	} else if (dragDirection.value === "vertical") {
		const threshold = containerHeight * 0.2;
		if (
			Math.abs(dragOffset.value) > threshold ||
			Math.abs(dragOffset.value) > DRAG_THRESHOLD
		) {
			shouldChange = true;
			vertical = true;
			if (dragOffset.value < 0) {
				nextIndex = (currentSlide.value + 1) % carouselItems.value.length;
			} else {
				nextIndex =
					currentSlide.value === 0
						? carouselItems.value.length - 1
						: currentSlide.value - 1;
			}
		}
	}

	// Change slide if needed
	if (shouldChange) {
		goToSlide(nextIndex, vertical);
	}

	// Restart auto slide dengan delay yang lebih aman
	setTimeout(() => {
		if (props.autoSlide && isMouseOver.value) {
			startAutoSlide();
		}
	}, SLIDE_INTERVAL.value);
};
const handleMouseEnter = () => {
	isMouseOver.value = true;
	if (carouselContainer.value && !isDragging.value) {
		carouselContainer.value.style.cursor = "grab";
	}
	stopAutoSlide();
};
const handleMouseLeave = () => {
	isMouseOver.value = false;
	if (carouselContainer.value && !isDragging.value) {
		carouselContainer.value.style.cursor = "default";
	}

	// Jika tidak dragging, restart auto slide
	if (!isDragging.value && props.autoSlide) {
		startAutoSlide();
	}
};
const forceResetCursor = () => {
	isDragging.value = false;
	dragOffset.value = 0;
	dragDirection.value = null;

	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = isMouseOver.value
			? "grab"
			: "default";
	}
};
const setupEventListeners = () => {
	if (carouselContainer.value) {
		// Remove existing listeners dulu
		carouselContainer.value.removeEventListener(
			"touchmove",
			handleDragMove as EventListener,
		);

		// Add non-passive listener untuk touchmove
		carouselContainer.value.addEventListener(
			"touchmove",
			handleDragMove as EventListener,
			{
				passive: false,
			},
		);
	}
};
const handleContextMenu = (e: MouseEvent) => {
	if (isDragging.value) {
		e.preventDefault();
		return false;
	}
	return true;
};
const handleContainerClick = (event: MouseEvent) => {
	// Jika sedang dragging, prevent click
	if (isDragging.value) {
		event.preventDefault();
		event.stopPropagation();
		return;
	}

	// Cek jika click terjadi pada link carousel
	const target = event.target as HTMLElement;
	const link = target.closest(".carousel-link") as HTMLAnchorElement;

	if (link && !isDragging.value) {
		const slideIndex = parseInt(link.dataset.slideIndex || "0");

		// Hanya allow click pada slide yang aktif
		if (slideIndex === currentSlide.value) {
			// Biarkan NuxtLink handle navigation
			// console.log("Navigating to:", link.href);
		} else {
			// Prevent click pada slide yang tidak aktif
			event.preventDefault();
			event.stopPropagation();
		}
	}
};

onMounted(() => {
	if (props.autoSlide) {
		startAutoSlide();
	}

	// Set initial cursor
	if (carouselContainer.value) {
		carouselContainer.value.style.cursor = "grab";
		// Setup non-passive event listeners
		setupEventListeners();
	}

	// Add global event listeners
	const handleGlobalMouseUp = () => {
		if (isDragging.value) {
			handleDragEnd();
		}
	};

	const handleGlobalTouchEnd = () => {
		if (isDragging.value) {
			handleDragEnd();
		}
	};

	window.addEventListener("mouseup", handleGlobalMouseUp);
	window.addEventListener("touchend", handleGlobalTouchEnd, { passive: true });
	window.addEventListener("touchcancel", handleGlobalTouchEnd, {
		passive: true,
	});

	onUnmounted(() => {
		stopAutoSlide();
		window.removeEventListener("mouseup", handleGlobalMouseUp);
		window.removeEventListener("touchend", handleGlobalTouchEnd);
		window.removeEventListener("touchcancel", handleGlobalTouchEnd);

		// Cleanup custom event listeners
		if (carouselContainer.value) {
			carouselContainer.value.removeEventListener(
				"touchmove",
				handleDragMove as EventListener,
			);
		}
	});
});

onUnmounted(() => {
	stopAutoSlide();
	window.removeEventListener("mouseup", handleDragEnd);
	window.removeEventListener("touchend", handleDragEnd);
});

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
</script>

<template>
	<div
		class="relative h-[200px] w-full overflow-hidden rounded-lg bg-gray-900 py-3 shadow-2xl md:h-[300px] lg:h-[400px] xl:h-[500px]"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<!-- Carousel Container -->
		<div
			ref="carouselContainer"
			class="carousel-track relative h-full w-full select-none"
			:class="{
				'vertical-track': isVertical,
				'horizontal-track': !isVertical,
			}"
			:style="{
				transform: getTransformStyle(),
				transition:
					isDragging || !isTransitioning
						? 'none'
						: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
				cursor: isDragging ? 'grabbing' : isMouseOver ? 'grab' : 'default',
			}"
			@mousedown="handleDragStart"
			@touchstart="handleDragStart"
			@mousemove="handleDragMove"
			@contextmenu="handleContextMenu"
			@click="handleContainerClick"
		>
			<!-- Carousel Items -->
			<div
				v-for="(item, index) in carouselItems"
				:key="index"
				class="carousel-slide absolute inset-0 h-full w-full"
				:class="{
					'slide-vertical': isVertical,
					'slide-horizontal': !isVertical,
					'active-slide': currentSlide === index,
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
					class="carousel-link group block h-full w-full"
					:data-slide-index="index"
					:class="{ 'pointer-events-none': isDragging }"
				>
					<div class="relative h-full w-full overflow-hidden">
						<img
							:src="item.image"
							:alt="item.alt || `Slide ${index + 1}`"
							class="h-full w-full object-fill object-center transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
							draggable="false"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
						></div>

						<div
							v-if="item.alt"
							class="absolute right-4 bottom-4 left-4 text-white"
						>
							<h3 class="mb-2 text-xl font-bold">{{ item.alt }}</h3>
						</div>
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
					class="pagination-dot cursor-pointer transition-all duration-300 hover:scale-125"
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
					class="pagination-dot cursor-pointer transition-all duration-300 hover:scale-125"
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

		<!-- Slide Counter -->
		<div
			class="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
		>
			{{ currentSlide + 1 }} / {{ carouselItems.length }}
		</div>

		<!-- Swipe Hint (Mobile) -->
		<div
			v-if="!isDragging"
			class="pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transform md:hidden"
		>
			<div
				class="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-xs text-white/70 backdrop-blur-sm"
			>
				<Icon name="mdi:gesture-swipe-horizontal" class="text-lg" />
				<span>Geser untuk slide</span>
			</div>
		</div>

		<!-- Emergency Reset Button (Debug) -->
		<button
			v-if="isDragging"
			class="absolute top-4 left-4 z-50 cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white"
			style="display: none"
			@click="forceResetCursor"
		>
			Reset Cursor
		</button>
	</div>
</template>

<style scoped>
.carousel-track {
	will-change: transform;
	touch-action: pan-y pan-x;
	cursor: grab;
}

.carousel-track:active {
	cursor: grabbing;
}

.carousel-slide {
	backface-visibility: hidden;
}

.carousel-link {
	cursor: pointer;
	pointer-events: auto;
}

.pagination-dot {
	cursor: pointer;
	will-change: transform, background-color;
}

.pagination-dot:focus {
	outline: 2px solid rgba(255, 255, 255, 0.5);
	outline-offset: 2px;
}
.active-slide .carousel-link {
	pointer-events: auto;
	cursor: pointer;
}
.carousel-slide:not(.active-slide) .carousel-link {
	pointer-events: none;
	cursor: default;
}
/* Prevent image dragging */
img {
	-webkit-user-drag: none;
	-khtml-user-drag: none;
	-moz-user-drag: none;
	-o-user-drag: none;
	user-drag: none;
	pointer-events: none; /* Prevent image from interfering with drag */
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

.carousel-track {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
	display: none;
}
.carousel-track.grabbing .carousel-link {
	pointer-events: none;
	cursor: grabbing;
}
.cursor-reset {
	cursor: default !important;
}
/* Cursor states */
.cursor-grab {
	cursor: grab;
}

.cursor-grabbing {
	cursor: grabbing;
}

.pagination-dot {
	cursor: pointer;
	will-change: transform, background-color;
}
.pagination-dot:focus {
	outline: 2px solid rgba(255, 255, 255, 0.5);
	outline-offset: 2px;
}
</style>
