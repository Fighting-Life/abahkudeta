<script setup lang="ts">
interface Props {
	appName?: string;
	title?: string;
	subtitle?: string;
	qrCode?: string;
	buttonText?: string;
	buttonLink?: string;
	androidApkLink?: string;
	iosAppLink?: string;
	backgroundImage?: string;
	phoneImage?: string;
}

const props = withDefaults(defineProps<Props>(), {
	appName: "KUDETABET98",
	title: "UNDUH GRATIS",
	subtitle: "Nikmati berbagai permainan dalam satu genggaman",
	qrCode: "/images/qr-code-app.png",
	buttonText: "Panduan instalasi",
	buttonLink: "/panduan-instalasi",
	androidApkLink: "/download/app.apk",
	iosAppLink: "https://apps.apple.com/app",
	backgroundImage: "/images/bg-mobile-banner.webp",
	phoneImage: "/images/phone-mockup.webp",
});

// Handle download
const handleDownloadAndroid = () => {
	window.open(props.androidApkLink, "_blank");
};
const handleDownloadIOS = () => {
	window.open(props.iosAppLink, "_blank");
};
function handleQrCodeImage(e: Event) {
	if (e.target) {
		(e.target as HTMLImageElement).src =
			"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=";
	}
}
function handlePhoneImage(e: Event) {
	if (e.target) {
		(e.target as HTMLImageElement).style.display = "none";
	}
}
</script>

<template>
	<div
		class="mobile-app-banner h- relative w-full overflow-hidden bg-black py-3"
	>
		<!-- Background Image -->
		<div
			class="absolute inset-0 bg-center bg-no-repeat object-fill"
			:style="{ backgroundImage: `url('${backgroundImage}')` }"
		>
			<!-- Dark overlay for better text readability -->
			<div
				class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
			></div>
		</div>

		<!-- Animated decorative elements -->
		<div class="pointer-events-none absolute inset-0 overflow-hidden">
			<!-- Yellow orb top right -->
			<div
				class="animate-pulse-slow absolute top-20 right-1/3 h-64 w-64 rounded-full bg-yellow-400 opacity-30 blur-3xl"
			></div>
			<!-- Pink/Purple orb bottom right -->
			<div
				class="animate-pulse-slower absolute right-1/4 bottom-32 h-48 w-48 rounded-full bg-pink-500 opacity-40 blur-3xl"
			></div>
			<!-- Diagonal lines pattern -->
			<div
				class="bg-diagonal-lines absolute top-0 left-0 h-full w-full opacity-10"
			></div>
		</div>

		<!-- Content Container -->
		<div
			class="relative z-10 container mx-auto px-4 py-12 lg:max-w-[1024px] lg:px-6 lg:py-16"
		>
			<div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<!-- Left Content - Text & QR Code -->
				<div class="fade-in-left space-y-6 text-white lg:space-y-8">
					<!-- Title -->
					<div class="space-y-2">
						<h2 class="text-3xl leading-tight font-bold lg:text-5xl">
							{{ title }}
						</h2>
						<h3
							class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-4xl font-black text-transparent lg:text-6xl"
						>
							{{ appName }} APP
						</h3>
						<p class="mt-4 text-base text-neutral-300 lg:text-lg">
							{{ subtitle }}
						</p>
					</div>

					<!-- QR Code & Download Section -->
					<div
						class="flex flex-col items-start gap-6 sm:flex-row sm:items-center"
					>
						<!-- QR Code -->
						<div
							class="transform rounded-2xl bg-white p-4 shadow-2xl transition-transform duration-300 hover:scale-105"
						>
							<img
								:src="qrCode"
								:alt="`${appName} QR Code`"
								class="h-32 w-32 lg:h-40 lg:w-40"
								@error="handleQrCodeImage"
							/>
						</div>

						<!-- Download Info -->
						<div class="space-y-4">
							<div class="space-y-2">
								<p class="text-sm font-bold text-yellow-400 lg:text-base">
									{{ appName }} App
								</p>
								<p
									class="text-sm leading-relaxed text-neutral-300 lg:text-base"
								>
									<strong class="text-white">Pindai kode QR</strong><br />
									untuk Unduh<br />
									<strong class="text-yellow-400">Android APK</strong>
								</p>
							</div>

							<!-- Install Guide Button -->
							<a
								:href="buttonLink"
								class="inline-block transform rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:shadow-xl active:scale-95 lg:text-base"
							>
								{{ buttonText }}
							</a>
						</div>
					</div>

					<!-- Download Buttons -->
					<div class="flex flex-wrap gap-4 pt-4">
						<!-- Android Button -->
						<button
							class="group flex transform cursor-pointer items-center gap-3 rounded-xl bg-neutral-800 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-700 hover:shadow-lg"
							@click="handleDownloadAndroid"
						>
							<svg
								class="h-8 w-8 text-green-400 transition-transform group-hover:scale-110"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z"
								/>
							</svg>
							<div class="text-left">
								<p class="text-xs text-neutral-400">Download on</p>
								<p class="text-sm font-bold">Android</p>
							</div>
						</button>

						<!-- iOS Button -->
						<button
							class="group flex transform cursor-pointer items-center gap-3 rounded-xl bg-neutral-800 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-700 hover:shadow-lg"
							@click="handleDownloadIOS"
						>
							<svg
								class="h-8 w-8 text-neutral-300 transition-transform group-hover:scale-110"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M17.05,20.28c-0.98,0.95-2.05,0.8-3.08,0.35c-1.09-0.46-2.09-0.48-3.24,0c-1.44,0.62-2.2,0.44-3.06-0.35 C2.79,15.25,3.51,7.59,9.05,7.31c1.35,0.07,2.29,0.74,3.08,0.8c1.18-0.24,2.31-0.93,3.57-0.84c1.51,0.12,2.65,0.72,3.4,1.8 c-3.12,1.87-2.38,5.98,0.48,7.13c-0.57,1.5-1.31,2.99-2.54,4.09L17.05,20.28z M12.03,7.25c-0.15-2.23,1.66-4.07,3.74-4.25 c0.29,2.58-2.34,4.5-3.74,4.25z"
								/>
							</svg>
							<div class="text-left">
								<p class="text-xs text-neutral-400">Download on</p>
								<p class="text-sm font-bold">App Store</p>
							</div>
						</button>
					</div>
				</div>

				<!-- Right Content - Phone Mockup -->
				<div
					class="fade-in-right relative hidden items-center justify-center lg:flex"
				>
					<div class="animate-float-phone relative">
						<!-- Glowing effect behind phone -->
						<div
							class="absolute inset-0 scale-110 bg-gradient-to-br from-yellow-400/30 to-pink-500/30 blur-3xl"
						></div>

						<!-- Phone mockup -->
						<img
							:src="phoneImage"
							:alt="`${appName} App Screenshot`"
							class="relative z-10 w-full max-w-md drop-shadow-2xl"
							@error="handlePhoneImage"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom decorative dots pattern -->
		<div
			class="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/50 to-transparent"
		></div>
	</div>
</template>

<style scoped>
/* Diagonal lines background pattern */
.bg-diagonal-lines {
	background-image: repeating-linear-gradient(
		45deg,
		transparent,
		transparent 20px,
		rgba(255, 255, 255, 0.03) 20px,
		rgba(255, 255, 255, 0.03) 40px
	);
}

/* Custom animations */
@keyframes pulse-slow {
	0%,
	100% {
		opacity: 0.3;
		transform: scale(1);
	}
	50% {
		opacity: 0.5;
		transform: scale(1.1);
	}
}

@keyframes pulse-slower {
	0%,
	100% {
		opacity: 0.4;
		transform: scale(1);
	}
	50% {
		opacity: 0.6;
		transform: scale(1.05);
	}
}

@keyframes float-phone {
	0%,
	100% {
		transform: translateY(0px) rotate(-2deg);
	}
	50% {
		transform: translateY(-20px) rotate(2deg);
	}
}

.animate-pulse-slow {
	animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-slower {
	animation: pulse-slower 6s ease-in-out infinite;
}

.animate-float-phone {
	animation: float-phone 6s ease-in-out infinite;
}

/* Hover effects */
.mobile-app-banner button:hover {
	box-shadow: 0 10px 40px rgba(250, 204, 21, 0.3);
}

/* QR Code container glow */
.bg-white {
	box-shadow: 0 0 40px rgba(250, 204, 21, 0.2);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
	.mobile-app-banner {
		background-position: center right;
	}
}

@media (max-width: 768px) {
	.animate-float-phone {
		animation: none;
	}
}
</style>
