<script setup lang="ts">
const props = defineProps<{
	category?: SubMenu[];
	title?: string;
}>();

const route = useRoute();
const { launchGame } = useGameLauncher();

async function goAdditionalLink(link?: string) {
	await navigateTo(link ?? route.fullPath);
}
</script>

<template>
	<div class="flex w-full flex-col gap-6">
		<!-- Section Title -->
		<div class="flex items-center gap-4">
			<div class="title-bar"></div>
			<h2
				class="text-2xl font-bold tracking-wide text-white capitalize lg:text-3xl"
			>
				{{ title }}
			</h2>
		</div>

		<!-- Games Grid -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
			<div
				v-for="(item, index) in category"
				:key="index"
				class="game-card group relative"
				@click="launchGame(item.link)"
			>
				<!-- Background Image -->
				<div
					class="absolute inset-0 z-0"
					:style="{
						backgroundImage: `url(${item.cover})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}"
				></div>

				<!-- <div
					class="absolute inset-0 z-1 bg-gradient-to-r from-black/70 via-black/40 to-black/20"
				></div> -->

				<button
					class="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-900 transition-all hover:scale-110 hover:bg-white"
					@click.stop="launchGame(item.alternative_link)"
				>
					<Icon name="heroicons:information-circle-solid" class="h-4 w-4" />
				</button>

				<div class="absolute top-1/2 left-3 z-5 -translate-y-1/2 transform">
					<div class="flex flex-col gap-3">
						<h3 class="title-shadow">
							{{ item.name }}
						</h3>
						<button
							class="main-button w-fit cursor-pointer self-start"
							@click.stop="launchGame(item.link)"
						>
							MAIN
						</button>
					</div>
				</div>
				<div class="gradient-overlay"></div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";

/* Title Bar - Custom gradient */
.title-bar {
	@apply h-8 w-1 rounded-sm;
	background: linear-gradient(to bottom, #8a2be2, #9d4edd);
}

/* Game Card Base */
.game-card {
	@apply relative flex h-[160px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ease-in-out lg:h-[180px];
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.game-card:hover {
	@apply -translate-y-1 scale-[1.02];
	box-shadow: 0 8px 30px rgba(138, 43, 226, 0.4);
}

.game-card:active {
	@apply scale-[0.98];
}

/* Title Shadow */
.title-shadow {
	font-size: 1.125rem;
	font-weight: 700;
	color: #fff;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	line-height: 1.2;
}

/* Main Button */
.main-button {
	@apply cursor-pointer rounded-full border-0 px-6 py-2.5 text-sm font-bold tracking-wide text-gray-900 uppercase transition-all duration-200 lg:px-8;
	background: linear-gradient(to bottom, #fbeb8c 0%, #d4af37 50%, #9d7e39 100%);
	box-shadow: 0 4px 15px rgba(251, 235, 140, 0.4);
}

.main-button:hover {
	@apply -translate-y-0.5;
	box-shadow: 0 6px 20px rgba(251, 235, 140, 0.6);
}

.main-button:active {
	@apply scale-95;
}

/* Gradient Overlay */
.gradient-overlay {
	@apply pointer-events-none absolute inset-0 z-3 opacity-0 transition-opacity duration-300;
	background: linear-gradient(
		45deg,
		rgba(138, 43, 226, 0.3) 0%,
		rgba(157, 78, 221, 0.2) 50%,
		rgba(138, 43, 226, 0.1) 100%
	);
}

.game-card:hover .gradient-overlay {
	@apply opacity-100;
}
@media (min-width: 1024px) {
	.game-title {
		font-size: 1.25rem;
	}
}
@media (max-width: 640px) {
	.game-title {
		font-size: 1rem;
	}
}
</style>
