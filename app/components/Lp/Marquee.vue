<script setup lang="ts">
interface Props {
	items?: MarqueeItem[];
	speed?: number; // pixels per second
	pauseOnHover?: boolean;
	showDate?: boolean;
	direction?: "left" | "right";
	separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
	speed: 50,
	pauseOnHover: true,
	showDate: true,
	direction: "left",
	separator: " • ",
});

const marqueeItems = computed(() => props.items || defaultItems);

// Date functionality
const currentDate = ref("");
const updateDate = () => {
	currentDate.value = formatDate(new Date());
};

// Marquee animation state
const marqueeContainer = ref<HTMLElement>();
const marqueeContent = ref<HTMLElement>();
const isHovered = ref(false);
const animationId = ref<number>();

// Create continuous text for seamless scrolling
const marqueeText = computed(() => {
	return marqueeItems.value.map((item) => item.text).join(props.separator);
});

// Duplicate text for seamless loop
const duplicatedText = computed(() => {
	return `${marqueeText.value}${props.separator}${marqueeText.value}`;
});

// Animation logic
const startMarquee = () => {
	if (!marqueeContainer.value || !marqueeContent.value) return;

	const container = marqueeContainer.value;
	const content = marqueeContent.value;

	const containerWidth = container.offsetWidth;
	const contentWidth = content.scrollWidth / 2; // Half because we duplicated

	let position = props.direction === "left" ? containerWidth : -contentWidth;
	const direction = props.direction === "left" ? -1 : 1;

	const animate = () => {
		if (isHovered.value && props.pauseOnHover) {
			animationId.value = requestAnimationFrame(animate);
			return;
		}

		position += direction * (props.speed / 60); // 60fps

		// Reset position for seamless loop
		if (props.direction === "left" && position <= -contentWidth) {
			position = containerWidth;
		} else if (props.direction === "right" && position >= containerWidth) {
			position = -contentWidth;
		}

		content.style.transform = `translateX(${position}px)`;
		animationId.value = requestAnimationFrame(animate);
	};

	animate();
};

const stopMarquee = () => {
	if (animationId.value) {
		cancelAnimationFrame(animationId.value);
	}
};

// Handle hover
const handleMouseEnter = () => {
	isHovered.value = true;
};

const handleMouseLeave = () => {
	isHovered.value = false;
};

// Handle item clicks
const handleItemClick = (item: MarqueeItem, event: Event) => {
	if (item.link) {
		// You can customize navigation logic here
		// For now, using navigateTo for Nuxt
		event.preventDefault();
		navigateTo(item.link);
	}
};

// Lifecycle
onMounted(() => {
	if (props.showDate) {
		updateDate();
		const dateInterval = setInterval(updateDate, 1000);

		onUnmounted(() => {
			clearInterval(dateInterval);
		});
	}

	// Start marquee after DOM is ready
	nextTick(() => {
		startMarquee();
	});

	onUnmounted(() => {
		stopMarquee();
	});
});
</script>

<template>
	<div
		class="w-full border-b border-b-neutral-700 bg-neutral-800 py-4 lg:-mt-4 lg:border-none"
	>
		<div class="container mx-auto w-full lg:max-w-[1024px]">
			<div class="flex w-full items-center gap-1 px-4 lg:px-0">
				<!-- Date Display (Desktop Only) -->
				<div
					v-if="showDate"
					class="hidden shrink-0 items-center justify-center px-2 text-xs font-bold text-nowrap text-neutral-200 lg:flex"
				>
					{{ currentDate }}
				</div>

				<!-- News Icon -->
				<img src="/images/icons/news.png" alt="News" class="h-4 w-4 shrink-0" />

				<!-- Marquee Container -->
				<div
					ref="marqueeContainer"
					class="relative flex-1 overflow-hidden"
					@mouseenter="handleMouseEnter"
					@mouseleave="handleMouseLeave"
				>
					<!-- Marquee Content -->
					<div
						ref="marqueeContent"
						class="marquee-content whitespace-nowrap will-change-transform"
						:class="{
							'cursor-pointer': marqueeItems.some((item) => item.link),
							'animate-pulse': isHovered && pauseOnHover,
						}"
					>
						<!-- Render clickable items -->
						<template
							v-for="(item, index) in marqueeItems"
							:key="`first-${index}`"
						>
							<span
								v-if="item.link"
								class="cursor-pointer text-xs font-bold transition-colors duration-200 hover:text-white"
								:class="{
									'text-red-400': item.urgent,
									'text-[#e5d177]': !item.urgent,
								}"
								@click="handleItemClick(item, $event)"
							>
								{{ item.text }}
							</span>
							<span
								v-else
								class="text-xs font-bold"
								:class="{
									'text-red-400': item.urgent,
									'text-[#e5d177]': !item.urgent,
								}"
							>
								{{ item.text }}
							</span>
							<span
								v-if="index < marqueeItems.length - 1"
								class="mx-2 text-[#e5d177]"
								>{{ separator }}</span
							>
						</template>

						<!-- Separator before duplicate -->
						<span class="mx-2 text-[#e5d177]">{{ separator }}</span>

						<!-- Duplicate content for seamless loop -->
						<template
							v-for="(item, index) in marqueeItems"
							:key="`second-${index}`"
						>
							<span
								v-if="item.link"
								class="cursor-pointer text-xs font-bold transition-colors duration-200 hover:text-white"
								:class="{
									'text-red-400': item.urgent,
									'text-[#e5d177]': !item.urgent,
								}"
								@click="handleItemClick(item, $event)"
							>
								{{ item.text }}
							</span>
							<span
								v-else
								class="text-xs font-bold"
								:class="{
									'text-red-400': item.urgent,
									'text-[#e5d177]': !item.urgent,
								}"
							>
								{{ item.text }}
							</span>
							<span
								v-if="index < marqueeItems.length - 1"
								class="mx-2 text-[#e5d177]"
								>{{ separator }}</span
							>
						</template>
					</div>

					<!-- Gradient Overlays -->
					<div
						class="pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r from-neutral-900 via-transparent to-transparent"
					></div>
					<div
						class="pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l from-neutral-900 via-transparent to-transparent"
					></div>
				</div>

				<!-- Pause Indicator (when hovered) -->
				<div
					v-if="isHovered && pauseOnHover"
					class="hidden shrink-0 items-center justify-center px-2 text-xs text-neutral-400 lg:flex"
				>
					⏸️
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.marquee-content {
	backface-visibility: hidden;
	perspective: 1000px;
}

/* Smooth animation performance optimization */
.marquee-content * {
	will-change: auto;
}

/* Custom scrollbar hiding (if needed) */
.overflow-hidden::-webkit-scrollbar {
	display: none;
}

.overflow-hidden {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

/* Hover effects */
.cursor-pointer:hover {
	text-shadow: 0 0 5px currentColor;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.marquee-content {
		font-size: 11px;
	}
}
</style>
