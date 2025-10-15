<script setup lang="ts">
interface Props {
	speed?: number; // pixels per second
	pauseOnHover?: boolean;
	title?: string;
	rowGap?: number;
}

const props = withDefaults(defineProps<Props>(), {
	speed: 50,
	pauseOnHover: true,
	title: "OUR PARTNER",
	rowGap: 6,
});
const partnersPerRow = Math.ceil(partners.length / 3);
const row1 = partners.slice(0, partnersPerRow);
const row2 = partners.slice(partnersPerRow, partnersPerRow * 2);
const row3 = partners.slice(partnersPerRow * 2);

// Reactive state
const isHovered = ref(false);

// Handle hover
const handleMouseEnter = () => {
	isHovered.value = true;
};

const handleMouseLeave = () => {
	isHovered.value = false;
};
function fallbackImages(event: Event) {
	if (event.target) {
		(event.target as HTMLImageElement).src = "/images/no-image.webp";
	}
}
</script>
<template>
	<div class="partners-section w-full overflow-hidden bg-black py-12 lg:py-16">
		<div class="container mx-auto w-full px-4 md:max-w-[1024px] lg:px-0">
			<!-- Title -->
			<div
				class="mb-8 flex w-full items-center justify-center text-center lg:mb-12"
			>
				<h2
					class="line-clamp-1 max-w-max border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text pb-4 text-3xl font-bold text-transparent lg:text-4xl"
				>
					{{ title }}
				</h2>
			</div>

			<!-- Marquee Container -->
			<div
				class="marquee-wrapper space-y-6"
				@mouseenter="handleMouseEnter"
				@mouseleave="handleMouseLeave"
			>
				<!-- Row 1 - Left to Right -->
				<div class="marquee-row overflow-hidden">
					<div
						class="marquee-content-ltr inline-flex gap-8 lg:gap-12"
						:class="{ paused: isHovered && pauseOnHover }"
						:style="{ '--marquee-speed': `${speed}s` }"
					>
						<!-- First set -->
						<div
							v-for="partner in row1"
							:key="`row1-1-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<NuxtLink :to="partner.url">
								<img
									:src="partner.logo"
									:alt="partner.name"
									class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
									loading="lazy"
									@error="fallbackImages"
								/>
							</NuxtLink>
						</div>
						<!-- Duplicate set for seamless loop -->
						<div
							v-for="partner in row1"
							:key="`row1-2-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<img
								:src="partner.logo"
								:alt="partner.name"
								class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
								loading="lazy"
								@error="fallbackImages"
							/>
						</div>
					</div>
				</div>

				<!-- Row 2 - Right to Left -->
				<div class="marquee-row overflow-hidden">
					<div
						class="marquee-content-rtl inline-flex gap-8 lg:gap-12"
						:class="{ paused: isHovered && pauseOnHover }"
						:style="{ '--marquee-speed': `${speed + 10}s` }"
					>
						<!-- First set -->
						<div
							v-for="partner in row2"
							:key="`row2-1-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<NuxtLink :to="partner.url">
								<img
									:src="partner.logo"
									:alt="partner.name"
									class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
									loading="lazy"
									@error="fallbackImages"
								/>
							</NuxtLink>
						</div>
						<!-- Duplicate set for seamless loop -->
						<div
							v-for="partner in row2"
							:key="`row2-2-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<img
								:src="partner.logo"
								:alt="partner.name"
								class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
								loading="lazy"
								@error="fallbackImages"
							/>
						</div>
					</div>
				</div>

				<!-- Row 3 - Left to Right (slower) -->
				<div class="marquee-row overflow-hidden">
					<div
						class="marquee-content-ltr inline-flex gap-8 lg:gap-12"
						:class="{ paused: isHovered && pauseOnHover }"
						:style="{ '--marquee-speed': `${speed + 20}s` }"
					>
						<!-- First set -->
						<div
							v-for="partner in row3"
							:key="`row3-1-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<NuxtLink :to="partner.url">
								<img
									:src="partner.logo"
									:alt="partner.name"
									class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
									loading="lazy"
									@error="fallbackImages"
								/>
							</NuxtLink>
						</div>
						<!-- Duplicate set for seamless loop -->
						<div
							v-for="partner in row3"
							:key="`row3-2-${partner.name}`"
							class="partner-logo flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900/50 p-4 transition-all duration-300 hover:scale-110 hover:bg-neutral-800/70 lg:h-20 lg:w-36"
						>
							<img
								:src="partner.logo"
								:alt="partner.name"
								class="neutralscale hover:neutralscale-0 h-full w-full object-contain filter transition-all duration-300"
								loading="lazy"
								@error="fallbackImages"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.partners-section {
	position: relative;
}

/* Marquee animations */
.marquee-row {
	position: relative;
	width: 100%;
}

/* Left to Right animation */
.marquee-content-ltr {
	animation: scroll-ltr var(--marquee-speed, 50s) linear infinite;
	will-change: transform;
}

@keyframes scroll-ltr {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
}

/* Right to Left animation */
.marquee-content-rtl {
	animation: scroll-rtl var(--marquee-speed, 50s) linear infinite;
	will-change: transform;
}

@keyframes scroll-rtl {
	0% {
		transform: translateX(-50%);
	}
	100% {
		transform: translateX(0);
	}
}

/* Pause animation on hover */
.marquee-content-ltr.paused,
.marquee-content-rtl.paused {
	animation-play-state: paused;
}

/* Partner logo styles */
.partner-logo {
	cursor: pointer;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.partner-logo:hover {
	border-color: rgba(250, 204, 21, 0.3);
	box-shadow: 0 0 20px rgba(250, 204, 21, 0.2);
}

/* neutralscale effect */
.filter.neutralscale {
	filter: neutralscale(100%) brightness(0.8);
}

.filter.neutralscale:hover {
	filter: neutralscale(0%) brightness(1);
}

/* Gradient fade on edges */
.marquee-wrapper::before,
.marquee-wrapper::after {
	content: "";
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100px;
	z-index: 10;
	pointer-events: none;
}

.marquee-wrapper::before {
	left: 0;
	background: linear-gradient(to right, #000000, transparent);
}

.marquee-wrapper::after {
	right: 0;
	background: linear-gradient(to left, #000000, transparent);
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.marquee-wrapper::before,
	.marquee-wrapper::after {
		width: 50px;
	}

	.partner-logo {
		width: 112px;
		height: 64px;
	}
}

/* Performance optimization */
@media (prefers-reduced-motion: reduce) {
	.marquee-content-ltr,
	.marquee-content-rtl {
		animation: none;
	}
}
</style>
