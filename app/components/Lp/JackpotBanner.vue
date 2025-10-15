<script setup lang="ts">
interface Props {
	initialAmount?: number;
	currency?: string;
	minAmount?: number;
	maxAmount?: number;
	updateInterval?: number;
	animationDuration?: number;
	showPragmaticLogo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	initialAmount: 8995324080,
	currency: "IDR",
	minAmount: 8000000000,
	maxAmount: 12000000000,
	updateInterval: 2000,
	animationDuration: 800,
	showPragmaticLogo: true,
});

// Reactive state
const currentAmount = ref(props.initialAmount);
const displayAmount = ref(props.initialAmount);
const isIncreasing = ref(true);
const isAnimating = ref(false);
const animationId = ref<number>();
const intervalId = ref<NodeJS.Timeout>();

// Format number with dots as thousands separator
const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("id-ID", {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	})
		.format(amount)
		.replace(/,/g, ".");
};

// Generate random amount change (like stock movement)
const generateRandomChange = (): number => {
	const changePercent = Math.random() * 0.02 + 0.001; // 0.1% to 2.1% change
	const baseChange = currentAmount.value * changePercent;
	const variation = (Math.random() - 0.5) * baseChange * 0.5;
	return Math.floor(baseChange + variation);
};

// Animate counter with easing
const animateCounter = (
	startValue: number,
	endValue: number,
	duration: number,
) => {
	isAnimating.value = true;
	const startTime = Date.now();
	const difference = endValue - startValue;

	const animate = () => {
		const elapsed = Date.now() - startTime;
		const progress = Math.min(elapsed / duration, 1);

		// Easing function (ease-out-cubic)
		const easeOutCubic = 1 - Math.pow(1 - progress, 3);

		displayAmount.value = Math.floor(startValue + difference * easeOutCubic);

		if (progress < 1) {
			animationId.value = requestAnimationFrame(animate);
		} else {
			isAnimating.value = false;
		}
	};

	animate();
};

// Update jackpot amount
const updateAmount = () => {
	const change = generateRandomChange();
	const shouldIncrease = Math.random() > 0.3; // 70% chance to increase

	let newAmount;
	if (shouldIncrease) {
		newAmount = Math.min(currentAmount.value + change, props.maxAmount);
		isIncreasing.value = true;
	} else {
		newAmount = Math.max(currentAmount.value - change, props.minAmount);
		isIncreasing.value = false;
	}

	const oldAmount = displayAmount.value;
	currentAmount.value = newAmount;

	animateCounter(oldAmount, newAmount, props.animationDuration);
};

// Start the jackpot animation
const startAnimation = () => {
	intervalId.value = setInterval(() => {
		updateAmount();
	}, props.updateInterval);
};

// Stop animation
const stopAnimation = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value);
	}
	if (animationId.value) {
		cancelAnimationFrame(animationId.value);
	}
};

// Lifecycle
onMounted(() => {
	startAnimation();
});

onUnmounted(() => {
	stopAnimation();
});

// Computed formatted amount
const formattedAmount = computed(() => {
	return `${props.currency} ${formatCurrency(displayAmount.value)}`;
});
</script>

<template>
	<div class="w-full px-4 py-4 lg:px-6 lg:py-6">
		<!-- Desktop Version -->
		<div class="hidden flex-col lg:flex">
			<div class="container mx-auto max-w-[1024px]">
				<!-- Outer glow container -->
				<div
					class="relative rounded-full bg-gradient-to-r from-yellow-400/50 via-yellow-300/40 to-yellow-400/50 p-1 shadow-2xl"
				>
					<!-- Inner container with dark background -->
					<div
						class="relative rounded-full border border-[#e5d177] bg-gradient-to-r from-neutral-900 via-black to-neutral-900"
					>
						<!-- Content container -->
						<div
							class="flex items-center justify-between gap-3 px-8 py-6 lg:px-12 lg:py-8"
						>
							<!-- Left side - Pragmatic Play Logo and Jackpot text -->
							<div class="flex items-center gap-6">
								<!-- Pragmatic Play Logo -->
								<div
									v-if="showPragmaticLogo"
									class="flex items-center justify-center"
								>
									<img
										src="/images/icons/jackpot-play-logo-desktop-v2.webp"
										alt=""
										class="h-10 w-full"
									/>
								</div>

								<!-- Jackpot Text -->
								<div class="text-left">
									<h2
										class="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-2xl font-bold text-transparent lg:text-4xl"
									>
										JACKPOT
									</h2>
									<h3
										class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent lg:text-3xl"
									>
										PLAY
									</h3>
								</div>
							</div>

							<!-- Right side - Amount display -->
							<div class="max-w-2xl flex-1">
								<div
									class="relative rounded-full border-2 border-dashed border-[#e5d177] bg-black px-8 py-4"
								>
									<!-- Animated dots border effect -->
									<div
										class="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-[#e5d177]"
									></div>

									<!-- Amount text -->
									<div class="relative text-center">
										<div
											class="font-mono text-2xl font-bold tabular-nums transition-all duration-300 lg:text-4xl"
											:class="{
												'text-shadow-green text-green-400':
													isIncreasing && isAnimating,
												'text-shadow-red text-red-400':
													!isIncreasing && isAnimating,
												'text-yellow-300': !isAnimating,
											}"
										>
											{{ formattedAmount }}
										</div>

										<!-- Trend indicator -->
										<div
											class="absolute top-1/2 -right-8 -translate-y-1/2 transform"
										>
											<div
												v-if="isAnimating"
												class="flex items-center transition-all duration-300"
											>
												<svg
													v-if="isIncreasing"
													class="h-6 w-6 animate-bounce text-green-400"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M7 14l5-5 5 5H7z" />
												</svg>
												<svg
													v-else
													class="h-6 w-6 animate-bounce text-red-400"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M7 10l5 5 5-5H7z" />
												</svg>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile Version -->
		<div class="block lg:hidden">
			<div class="container mx-auto max-w-sm px-2">
				<!-- Outer glow container -->
				<div
					class="relative rounded-2xl bg-gradient-to-r from-yellow-400/50 via-yellow-300/40 to-yellow-400/50 p-0.5 shadow-xl"
				>
					<!-- Inner container -->
					<div
						class="relative rounded-2xl border border-[#e5d177] bg-gradient-to-r from-neutral-900 via-black to-neutral-900"
					>
						<!-- Content -->
						<div class="px-4 py-4">
							<!-- Top row - Logo and Jackpot text -->
							<div class="mb-3 flex items-center justify-center gap-3">
								<!-- Pragmatic Play Logo -->
								<div
									v-if="showPragmaticLogo"
									class="flex items-center justify-center"
								>
									<img
										src="/images/icons/jackpot-play-logo-desktop-v2.webp"
										alt=""
										class="h-8 w-full"
									/>
								</div>

								<div class="text-center">
									<h2
										class="bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 bg-clip-text text-lg font-bold text-transparent"
									>
										JACKPOT PLAY
									</h2>
								</div>
							</div>

							<!-- Amount display -->
							<div
								class="relative rounded-xl border-2 border-dashed border-yellow-400/60 bg-black px-4 py-3"
							>
								<div
									class="absolute inset-0 animate-pulse rounded-xl border-2 border-dashed border-[#e5d177]"
								></div>

								<div class="relative text-center">
									<div
										class="flex items-center justify-center gap-2 font-mono text-sm font-bold tabular-nums transition-all duration-300"
										:class="{
											'text-green-400': isIncreasing && isAnimating,
											'text-red-400': !isIncreasing && isAnimating,
											'text-yellow-300': !isAnimating,
										}"
									>
										<span>{{ formattedAmount }}</span>

										<!-- Mobile trend indicator -->
										<div v-if="isAnimating" class="flex items-center">
											<svg
												v-if="isIncreasing"
												class="h-4 w-4 animate-bounce text-green-400"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M7 14l5-5 5 5H7z" />
											</svg>
											<svg
												v-else
												class="h-4 w-4 animate-bounce text-red-400"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M7 10l5 5 5-5H7z" />
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.jackpot-banner {
	background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
}

/* Text shadow effects */
.text-shadow-green {
	text-shadow:
		0 0 10px rgba(34, 197, 94, 0.5),
		0 0 20px rgba(34, 197, 94, 0.3);
}

.text-shadow-red {
	text-shadow:
		0 0 10px rgba(239, 68, 68, 0.5),
		0 0 20px rgba(239, 68, 68, 0.3);
}

/* Tabular numbers for consistent spacing */
.tabular-nums {
	font-variant-numeric: tabular-nums;
}

/* Glowing border animation */
@keyframes glow {
	0%,
	100% {
		border-color: rgba(250, 204, 21, 0.6);
		box-shadow: 0 0 5px rgba(250, 204, 21, 0.3);
	}
	50% {
		border-color: rgba(250, 204, 21, 0.8);
		box-shadow: 0 0 15px rgba(250, 204, 21, 0.5);
	}
}

/* Custom animations */
@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-25%);
	}
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
	animation: bounce 1s infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.tabular-nums {
		font-size: 0.875rem;
	}
}
</style>
