<script setup lang="ts">
interface Props {
	showAfter?: number; // Show button after scrolling X pixels
	scrollDuration?: number; // Smooth scroll duration
	position?: "right" | "left";
	bottom?: string;
	backgroundColor?: string;
	hoverBackgroundColor?: string;
	iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
	showAfter: 300,
	scrollDuration: 800,
	position: "right",
	bottom: "1.75rem", // 7 in Tailwind = 1.75rem
	backgroundColor: "#facc15", // yellow-400
	hoverBackgroundColor: "#eab308", // yellow-500
	iconColor: "#000000",
});

// Reactive state
const isVisible = ref(false);
const isScrolling = ref(false);

// Check scroll position
const handleScroll = () => {
	isVisible.value = window.scrollY > props.showAfter;
};

// Smooth scroll to top
const scrollToTop = () => {
	if (isScrolling.value) return;

	isScrolling.value = true;

	const start = window.scrollY;
	const startTime = performance.now();

	const easeInOutCubic = (t: number): number => {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	};

	const animateScroll = (currentTime: number) => {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / props.scrollDuration, 1);
		const easing = easeInOutCubic(progress);

		window.scrollTo(0, start * (1 - easing));

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		} else {
			isScrolling.value = false;
		}
	};

	requestAnimationFrame(animateScroll);
};

// Lifecycle
onMounted(() => {
	// Check initial scroll position
	handleScroll();

	// Add scroll listener with throttle
	let ticking = false;
	const scrollListener = () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				handleScroll();
				ticking = false;
			});
			ticking = true;
		}
	};

	window.addEventListener("scroll", scrollListener, { passive: true });

	onUnmounted(() => {
		window.removeEventListener("scroll", scrollListener);
	});
});

// Computed styles
const buttonPosition = computed(() => ({
	[props.position]: "1rem",
	bottom: props.bottom,
}));
</script>

<template>
	<Transition name="fade-scale">
		<button
			v-show="isVisible"
			class="scroll-to-top-btn fixed right-2 bottom-[5rem] z-50 inline-flex cursor-pointer items-center justify-center rounded-md p-3 shadow-lg transition-all duration-300 hover:shadow-xl active:scale-90 lg:bottom-2"
			:style="{
				backgroundColor: backgroundColor,
				'--hover-bg': hoverBackgroundColor,
			}"
			aria-label="Scroll to top"
			:disabled="isScrolling"
			@click="scrollToTop"
		>
			<!-- Arrow Icon -->
			<Icon
				name="ic:twotone-arrow-upward"
				class="text-xl transition-transform duration-300"
				:class="{ 'animate-bounce-up': !isScrolling }"
				:style="{ color: iconColor }"
			/>

			<!-- Ripple effect on click -->
			<span class="ripple-effect"></span>
		</button>
	</Transition>
</template>

<style lang="css" scoped>
@reference "tailwindcss";

.scroll-to-top-btn {
	will-change: transform, opacity;
}

/* Hover effect */
.scroll-to-top-btn:hover {
	background-color: var(--hover-bg);
	transform: translateY(-4px);
}

.scroll-to-top-btn:active {
	transform: translateY(-2px) scale(0.95);
}

/* Icon bounce animation on hover */
.scroll-to-top-btn:hover .text-xl {
	animation: bounce-up 0.6s ease-in-out infinite;
}

@keyframes bounce-up {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-4px);
	}
}

.animate-bounce-up {
	animation: bounce-up 2s ease-in-out infinite;
}

/* Fade and scale transition */
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
	opacity: 0;
	transform: scale(0.8) translateY(20px);
}

.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.8) translateY(20px);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
	opacity: 1;
	transform: scale(1) translateY(0);
}

/* Ripple effect */
.ripple-effect {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
}

.scroll-to-top-btn:active .ripple-effect::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.5);
	transform: translate(-50%, -50%);
	animation: ripple 0.6s ease-out;
}

@keyframes ripple {
	to {
		width: 100px;
		height: 100px;
		opacity: 0;
	}
}

/* Disabled state */
.scroll-to-top-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.scroll-to-top-btn {
		padding: 0.625rem; /* p-2.5 */
	}

	.text-xl {
		font-size: 1.125rem; /* Slightly smaller on mobile */
	}
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
	.scroll-to-top-btn,
	.fade-scale-enter-active,
	.fade-scale-leave-active {
		transition: none;
		animation: none;
	}

	.animate-bounce-up {
		animation: none;
	}
}
</style>
