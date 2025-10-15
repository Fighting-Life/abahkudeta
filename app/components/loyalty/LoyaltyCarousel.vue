<script setup lang="ts">
interface Props {
	items: CarouselItem[];
	autoPlayDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
	autoPlayDelay: 4000,
});

const currentIndex = ref(0);
const carouselRef = ref<HTMLElement>();
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);

// Navigate to specific slide
const goToSlide = (index: number) => {
	if (!carouselRef.value) return;

	currentIndex.value = index;

	const slideWidth = carouselRef.value.offsetWidth;
	const scrollAmount = index * slideWidth;

	carouselRef.value.scrollTo({
		left: scrollAmount,
		behavior: "smooth",
	});
};

// Navigate prev/next
const navigate = (direction: "prev" | "next") => {
	stopAutoPlay();

	let newIndex;
	if (direction === "next") {
		newIndex = (currentIndex.value + 1) % props.items.length;
	} else {
		newIndex =
			currentIndex.value === 0
				? props.items.length - 1
				: currentIndex.value - 1;
	}

	goToSlide(newIndex);

	// Resume auto play after manual navigation
	setTimeout(() => {
		startAutoPlay();
	}, 2000);
};

// Auto play
const startAutoPlay = () => {
	if (autoPlayInterval.value || props.items.length <= 1) return;

	autoPlayInterval.value = setInterval(() => {
		const nextIndex = (currentIndex.value + 1) % props.items.length;
		goToSlide(nextIndex);
	}, props.autoPlayDelay);
};

const stopAutoPlay = () => {
	if (autoPlayInterval.value) {
		clearInterval(autoPlayInterval.value);
		autoPlayInterval.value = null;
	}
};

// Handle scroll event
const handleScroll = () => {
	if (!carouselRef.value) return;

	const slideWidth = carouselRef.value.offsetWidth;
	const scrollLeft = carouselRef.value.scrollLeft;
	const currentSlide = Math.round(scrollLeft / slideWidth);

	if (currentSlide !== currentIndex.value) {
		currentIndex.value = currentSlide;
	}
};

// Handle click on carousel item
const handleItemClick = (item: CarouselItem) => {
	if (item.is_external) {
		window.open(item.link, "_blank");
	} else {
		navigateTo(item.link);
	}
};

// Lifecycle
onMounted(() => {
	startAutoPlay();

	if (carouselRef.value) {
		carouselRef.value.addEventListener("scroll", handleScroll);
	}
});

onBeforeUnmount(() => {
	stopAutoPlay();

	if (carouselRef.value) {
		carouselRef.value.removeEventListener("scroll", handleScroll);
	}
});
</script>

<template>
	<div class="relative w-full">
		<!-- Carousel Container -->
		<div
			ref="carouselRef"
			class="carousel-container overflow-x-auto overflow-y-hidden scroll-smooth"
			@mouseenter="stopAutoPlay"
			@mouseleave="startAutoPlay"
		>
			<div class="flex">
				<div
					v-for="(item, index) in items"
					:key="index"
					class="carousel-slide w-full flex-shrink-0 cursor-pointer"
					@click="handleItemClick(item)"
				>
					<div class="relative overflow-hidden rounded-lg">
						<img
							:src="item.image"
							:alt="item.alt || `Slide ${index + 1}`"
							class="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation Arrows (Desktop only) -->
		<div
			v-if="items.length > 1"
			class="absolute inset-y-0 right-0 left-0 hidden items-center justify-between px-4 lg:flex"
		>
			<!-- Previous Button -->
			<button
				class="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
				@click="navigate('prev')"
			>
				<Icon name="lucide:chevron-left" class="h-6 w-6" />
			</button>

			<!-- Next Button -->
			<button
				class="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
				@click="navigate('next')"
			>
				<Icon name="lucide:chevron-right" class="h-6 w-6" />
			</button>
		</div>

		<!-- Dots Indicator -->
		<div
			v-if="items.length > 1"
			class="absolute right-0 bottom-4 left-0 flex justify-center space-x-2"
		>
			<button
				v-for="(item, index) in items"
				:key="index"
				class="h-2 rounded-full transition-all"
				:class="
					currentIndex === index
						? 'w-6 bg-yellow-400'
						: 'w-2 bg-white/50 hover:bg-white/70'
				"
				@click="goToSlide(index)"
			></button>
		</div>
	</div>
</template>

<style scoped>
.carousel-container {
	scrollbar-width: none;
	-ms-overflow-style: none;
	scroll-snap-type: x mandatory;
}

.carousel-container::-webkit-scrollbar {
	display: none;
}

.carousel-slide {
	scroll-snap-align: start;
}
</style>
