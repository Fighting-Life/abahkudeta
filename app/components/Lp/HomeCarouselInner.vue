<script setup lang="ts">
interface Props {
	slides?: CarouselInnerSlide[];
	autoPlay?: boolean;
	interval?: number;
	transitionDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
	autoPlay: true,
	interval: 5000,
	transitionDuration: 800,
});

const currentSlide = ref(0);
const isTransitioning = ref(false);
const autoPlayTimer = ref<NodeJS.Timeout | null>(null);
const slides = computed(() => props.slides || defaultInnerSlides);
const imageVisible = ref(true);
const textVisible = ref(true);

const goToSlide = (index: number) => {
	if (isTransitioning.value || index === currentSlide.value) return;

	isTransitioning.value = true;

	// Start fade out animation
	imageVisible.value = false;
	textVisible.value = false;

	// Wait for fade out, then change slide and fade in
	setTimeout(() => {
		currentSlide.value = index;

		// Start fade in animation
		setTimeout(() => {
			imageVisible.value = true;
			textVisible.value = true;
			isTransitioning.value = false;
		}, 50);
	}, props.transitionDuration / 2);
};

const nextSlide = () => {
	const nextIndex = (currentSlide.value + 1) % slides.value.length;
	goToSlide(nextIndex);
};

const prevSlide = () => {
	const prevIndex =
		currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1;
	goToSlide(prevIndex);
};

// Auto play functionality
const startAutoPlay = () => {
	if (!props.autoPlay) return;

	stopAutoPlay();
	autoPlayTimer.value = setInterval(() => {
		nextSlide();
	}, props.interval);
};

const stopAutoPlay = () => {
	if (autoPlayTimer.value) {
		clearInterval(autoPlayTimer.value);
		autoPlayTimer.value = null;
	}
};

const resetAutoPlay = () => {
	stopAutoPlay();
	setTimeout(() => {
		startAutoPlay();
	}, 1000);
};

// Handle manual navigation
const handlePrev = () => {
	prevSlide();
	resetAutoPlay();
};

const handleNext = () => {
	nextSlide();
	resetAutoPlay();
};

const handleDotClick = (index: number) => {
	goToSlide(index);
	resetAutoPlay();
};

// Lifecycle
onMounted(() => {
	startAutoPlay();
});

onUnmounted(() => {
	stopAutoPlay();
});

// Current slide data
const currentSlideData = computed(() => slides.value[currentSlide.value]);
</script>
<template>
	<div
		class="hero-carousel relative min-h-[500px] w-full overflow-hidden bg-gray-900 lg:min-h-[600px]"
	>
		<!-- Background overlay -->
		<div
			class="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent"
		></div>

		<!-- Carousel container -->
		<div class="relative h-full min-h-[500px] lg:min-h-[600px]">
			<!-- Slide content -->
			<div class="relative z-20 flex h-full items-center">
				<div class="container mx-auto px-4 lg:px-6">
					<div
						class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12"
					>
						<!-- Left side - Image with fade animation -->
						<div class="relative order-2 lg:order-1">
							<Transition name="fade-slide">
								<div
									v-show="imageVisible"
									:key="currentSlideData?.id + '-image'"
									class="relative flex items-center justify-center"
								>
									<img
										:src="currentSlideData?.image"
										:alt="currentSlideData?.title"
										class="animate-float mx-auto w-full max-w-md drop-shadow-2xl lg:max-w-lg"
									/>
								</div>
							</Transition>
						</div>

						<!-- Right side - Text content with fade animation -->
						<div class="relative order-1 lg:order-2">
							<Transition name="fade-slide-right">
								<div
									v-show="textVisible"
									:key="currentSlideData?.id + '-text'"
									class="space-y-6 text-white"
								>
									<!-- Title -->
									<h1
										class="text-4xl font-black tracking-tight lg:text-6xl xl:text-7xl"
									>
										<span
											class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
										>
											{{ currentSlideData?.title }}
										</span>
									</h1>

									<!-- Description -->
									<p
										class="max-w-2xl text-sm leading-relaxed text-gray-300 lg:text-base"
									>
										{{ currentSlideData?.description }}
									</p>

									<!-- CTA Button -->
									<div class="pt-4">
										<a
											:href="currentSlideData?.buttonLink"
											class="inline-block transform rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-2xl active:scale-95"
										>
											{{ currentSlideData?.buttonText }}
										</a>
									</div>
								</div>
							</Transition>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation Arrows -->
			<button
				class="group absolute top-1/2 left-4 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 lg:left-8 lg:h-14 lg:w-14"
				aria-label="Previous slide"
				@click="handlePrev"
			>
				<svg
					class="h-6 w-6 text-white transition-transform group-hover:scale-110 lg:h-7 lg:w-7"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
				</svg>
			</button>

			<button
				class="group absolute top-1/2 right-4 z-30 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 lg:right-8 lg:h-14 lg:w-14"
				aria-label="Next slide"
				@click="handleNext"
			>
				<svg
					class="h-6 w-6 text-white transition-transform group-hover:scale-110 lg:h-7 lg:w-7"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
				</svg>
			</button>

			<!-- Pagination Dots -->
			<div
				class="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 lg:flex"
			>
				<button
					v-for="(slide, index) in slides"
					:key="slide.id"
					class="cursor-pointer transition-all duration-300"
					:class="{
						'h-3 w-12 rounded-full bg-yellow-400': index === currentSlide,
						'h-3 w-3 rounded-full bg-white/50 hover:bg-white/70':
							index !== currentSlide,
					}"
					:aria-label="`Go to slide ${index + 1}`"
					@click="handleDotClick(index)"
				></button>
			</div>

			<!-- Left sidebar menu indicator (KLIK DISINI!) -->
			<div
				class="absolute bottom-8 left-4 z-30 lg:left-8"
				style="display: none"
			>
				<div class="flex flex-col items-center gap-2">
					<span
						class="text-xs font-bold tracking-wider text-yellow-400 uppercase"
						>KLIK DISINI!</span
					>
					<button
						class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-yellow-400 transition-all duration-300 hover:scale-110 hover:bg-yellow-500 active:scale-95"
						aria-label="Open menu"
					>
						<svg
							class="h-6 w-6 text-black"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Background image (blurred) -->
		<div class="absolute inset-0 z-0">
			<Transition name="fade">
				<div
					v-show="imageVisible"
					:key="currentSlideData?.id + '-bg'"
					class="absolute inset-0"
				>
					<img
						:src="currentSlideData?.image"
						:alt="currentSlideData?.title"
						class="h-full w-full scale-110 object-cover opacity-20 blur-2xl"
					/>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
/* Fade slide animation for image (from left) */
.fade-slide-enter-active,
.fade-slide-leave-active {
	transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
	opacity: 0;
	transform: translateX(-50px);
}

.fade-slide-leave-to {
	opacity: 0;
	transform: translateX(-50px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
	opacity: 1;
	transform: translateX(0);
}

/* Fade slide animation for text (from right) */
.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
	transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-right-enter-from {
	opacity: 0;
	transform: translateX(50px);
}

.fade-slide-right-leave-to {
	opacity: 0;
	transform: translateX(50px);
}

.fade-slide-right-enter-to,
.fade-slide-right-leave-from {
	opacity: 1;
	transform: translateX(0);
}

/* Simple fade for background */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 0.2;
}

/* Float animation for character image */
@keyframes float {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-20px);
	}
}

.animate-float {
	animation: float 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
	.hero-carousel {
		min-height: 500px;
	}
}

@media (max-width: 768px) {
	.hero-carousel {
		min-height: 600px;
	}

	.fade-slide-enter-from,
	.fade-slide-leave-to {
		transform: translateX(-30px);
	}

	.fade-slide-right-enter-from,
	.fade-slide-right-leave-to {
		transform: translateX(30px);
	}
}
</style>
