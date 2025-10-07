<script setup lang="ts">
import "~/assets/css/tailwind.css";

interface Props {
	errorCode?: number;
	errorTitle?: string;
	errorMessage?: string;
	homeUrl?: string;
	logoUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
	errorCode: 404,
	errorTitle: "Oops!",
	errorMessage: "We couldn't process your request.",
	homeUrl: "/",
	logoUrl: "/images/error/logo.png",
});

const route = useRoute();

// Get current page info for error reporting
const currentUrl = computed(() => {
	return typeof window !== "undefined" ? window.location.href : route.fullPath;
});

const goHome = () => {
	navigateTo(props.homeUrl);
};
function handleImageFallback(e: Event) {
	if (e.target) {
		(e.target as HTMLImageElement).style.display = "none";
	}
}
</script>

<template>
	<div
		class="error-page relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-12"
	>
		<!-- Animated background lines -->
		<div class="pointer-events-none absolute inset-0 overflow-hidden">
			<div class="vertical-lines"></div>
		</div>

		<!-- Content container -->
		<div class="relative z-10 w-full max-w-4xl">
			<!-- Logo -->
			<div class="mb-12 flex justify-center">
				<img
					:src="logoUrl"
					alt="KUDETABET98"
					class="h-16 w-auto lg:h-20"
					@error="handleImageFallback"
				/>
			</div>

			<!-- Error content -->
			<div class="space-y-8 text-center">
				<!-- Error title -->
				<div class="space-y-4">
					<h1
						class="error-title animate-pulse-slow text-6xl font-black text-yellow-400 lg:text-8xl"
					>
						{{ errorTitle }}
					</h1>
					<p class="text-xl font-medium text-gray-300 lg:text-2xl">
						{{ errorMessage }}
					</p>
				</div>

				<!-- Error details box -->
				<div
					class="error-box mx-auto max-w-2xl rounded-xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm lg:p-10"
				>
					<p class="mb-6 text-base text-gray-200 lg:text-lg">
						For further assistance,<br />
						you may contact our customer service and provide the following
						details:
					</p>

					<div class="space-y-3 text-left">
						<div class="flex items-start gap-3">
							<span class="flex-shrink-0 font-bold text-yellow-400">1.</span>
							<p class="text-sm text-gray-300 lg:text-base">
								The page that encountered the error (Please provide the full
								url)
								<span class="mt-1 block text-xs break-all text-gray-500">{{
									currentUrl
								}}</span>
							</p>
						</div>
						<div class="flex items-start gap-3">
							<span class="flex-shrink-0 font-bold text-yellow-400">2.</span>
							<p class="text-sm text-gray-300 lg:text-base">
								What action that triggered the error
							</p>
						</div>
						<div class="flex items-start gap-3">
							<span class="flex-shrink-0 font-bold text-yellow-400">3.</span>
							<p class="text-sm text-gray-300 lg:text-base">
								Report Code:
								<span class="font-mono text-yellow-400">{{ errorCode }}</span>
							</p>
						</div>
					</div>
				</div>

				<!-- Home button -->
				<div class="pt-6">
					<button
						class="home-button inline-flex transform cursor-pointer items-center gap-3 rounded-full bg-yellow-400 px-8 py-4 text-base font-bold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-2xl active:scale-95 lg:px-12 lg:text-lg"
						@click="goHome"
					>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
							/>
						</svg>
						Click here
					</button>
				</div>

				<!-- Decorative 3D elements -->
				<div
					class="decorative-elements mt-12 flex items-end justify-center gap-2 pb-8"
				>
					<div class="domino" style="animation-delay: 0s"></div>
					<div class="domino" style="animation-delay: 0.1s"></div>
					<div class="domino" style="animation-delay: 0.2s"></div>
					<div class="domino" style="animation-delay: 0.3s"></div>
					<div class="domino active" style="animation-delay: 0.4s"></div>
					<div class="domino active" style="animation-delay: 0.5s"></div>
					<div class="domino active" style="animation-delay: 0.6s"></div>
					<div class="domino active" style="animation-delay: 0.7s"></div>
					<div class="domino active" style="animation-delay: 0.8s"></div>
					<div class="domino" style="animation-delay: 0.9s"></div>
					<div class="domino" style="animation-delay: 1s"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Background vertical lines animation */
.vertical-lines {
	position: absolute;
	inset: 0;
	background-image: repeating-linear-gradient(
		90deg,
		transparent,
		transparent 40px,
		rgba(250, 204, 21, 0.03) 40px,
		rgba(250, 204, 21, 0.03) 41px
	);
	animation: slide-lines 20s linear infinite;
}

@keyframes slide-lines {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(40px);
	}
}

/* Error title glow */
.error-title {
	text-shadow:
		0 0 20px rgba(250, 204, 21, 0.5),
		0 0 40px rgba(250, 204, 21, 0.3),
		0 0 60px rgba(250, 204, 21, 0.2);
}

/* Error box hover effect */
.error-box {
	transition: all 0.3s ease;
}

.error-box:hover {
	border-color: rgba(250, 204, 21, 0.5);
	box-shadow: 0 0 30px rgba(250, 204, 21, 0.1);
}

/* Home button effects */
.home-button {
	position: relative;
	overflow: hidden;
}

.home-button::before {
	content: "";
	position: absolute;
	inset: 0;
	background: linear-gradient(
		45deg,
		transparent,
		rgba(255, 255, 255, 0.3),
		transparent
	);
	transform: translateX(-100%);
	transition: transform 0.6s;
}

.home-button:hover::before {
	transform: translateX(100%);
}

/* Domino pieces animation */
.decorative-elements {
	perspective: 1000px;
}

.domino {
	width: 50px;
	height: 120px;
	background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
	border-radius: 8px;
	position: relative;
	transform-style: preserve-3d;
	animation: sway 3s ease-in-out infinite;
	box-shadow:
		0 10px 30px rgba(0, 0, 0, 0.5),
		inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.domino.active {
	background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
	box-shadow:
		0 10px 30px rgba(250, 204, 21, 0.4),
		0 0 20px rgba(250, 204, 21, 0.3),
		inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.domino::before {
	content: "";
	position: absolute;
	top: 10px;
	left: 10px;
	right: 10px;
	height: 2px;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 2px;
}

.domino::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50%;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
	border-radius: 0 0 8px 8px;
}

@keyframes sway {
	0%,
	100% {
		transform: rotateY(-5deg) translateY(0);
	}
	50% {
		transform: rotateY(5deg) translateY(-10px);
	}
}

/* Pulse animation */
@keyframes pulse-slow {
	0%,
	100% {
		opacity: 1;
		transform: scale(1);
	}
	50% {
		opacity: 0.9;
		transform: scale(1.02);
	}
}

.animate-pulse-slow {
	animation: pulse-slow 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.domino {
		width: 30px;
		height: 80px;
	}

	.error-title {
		font-size: 3rem;
	}

	.decorative-elements {
		gap: 0.25rem;
	}
}

/* Loading animation on mount */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.error-page > div {
	animation: fadeInUp 0.6s ease-out;
}
</style>
