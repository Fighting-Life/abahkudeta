<script setup lang="ts">
interface LuckyDrawItem {
	id: string;
	title: string;
	image: string;
	points: number;
	daysLeft: number;
	status: "active" | "ended" | "upcoming";
}

const route = useRoute();
const { $profileState } = useNuxtApp();

const carouselItems = computed(() => defaultCarouselItems);
const queryCName = computed(() => route.query.c as string);

// User level info
const userLevel = ref({
	name: "BRONZE",
	currentExp: 18,
	maxExp: 25000,
	badge:
		"https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/badge/bronze.svg",
});

const loyaltyPoints = ref(0);

// Menu items
const menuItems = [
	{
		label: "Penukaran",
		icon: "https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/redemption-icon.svg?v=20250528",
		url: "/account?q=loyalty&t=rewards&c=redemption",
		category: "redemption",
	},
	{
		label: "Misi",
		icon: "https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/mission-icon.svg?v=20250528",
		url: "/account?q=loyalty&t=missions",
		category: "missions",
	},
	{
		label: "Hasil Lucky Draw",
		icon: "https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/lucky-draw-result-icon.svg?v=20250528",
		url: "/account?q=loyalty&t=lucky-draw-results",
		category: "lucky-draw-results",
	},
	{
		label: "Riwayat",
		icon: "https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/history-icon.svg?v=20250528",
		url: "/account?q=loyalty&t=history",
		category: "history",
	},
	{
		label: "Cara Kerja",
		icon: "https://d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/loyalty/how-it-works-icon.svg?v=20250528",
		url: "/account?q=loyalty&t=how-it-works",
		category: "how-it-works",
	},
];

// Lucky Draw items
const luckyDrawItems = ref<LuckyDrawItem[]>([
	{
		id: "1",
		title: "ZOOM LUCKY DRAW - OKTOBER",
		image:
			"https://zmprod-redemption.s3.ap-northeast-1.amazonaws.com/product-images/WLB/thumbnail/5532c768-2333-4e6c-abbb-c80685b1a489.png",
		points: 2000,
		daysLeft: 17,
		status: "active",
	},
	{
		id: "2",
		title: "777 LUCKY - OKTOBER",
		image:
			"https://zmprod-redemption.s3.ap-northeast-1.amazonaws.com/product-images/WLB/thumbnail/5532c768-2333-4e6c-abbb-c80685b1a489.png",
		points: 5000,
		daysLeft: 25,
		status: "active",
	},
	{
		id: "3",
		title: "MEGA LUCKY DRAW - NOVEMBER",
		image:
			"https://zmprod-redemption.s3.ap-northeast-1.amazonaws.com/product-images/WLB/thumbnail/5532c768-2333-4e6c-abbb-c80685b1a489.png",
		points: 3500,
		daysLeft: 30,
		status: "active",
	},
	{
		id: "4",
		title: "SUPER LUCKY DRAW - DESEMBER",
		image:
			"https://zmprod-redemption.s3.ap-northeast-1.amazonaws.com/product-images/WLB/thumbnail/5532c768-2333-4e6c-abbb-c80685b1a489.png",
		points: 1500,
		daysLeft: 45,
		status: "active",
	},
]);

// Active tab
const activeTab = ref("semua");

// Navigate to menu
const navigateToMenu = (item: any) => {
	navigateTo(item.url);
};

// Calculate progress percentage
const progressPercentage = computed(() => {
	return (userLevel.value.currentExp / userLevel.value.maxExp) * 100;
});
</script>

<template>
	<div
		class="animate-page-grow w-full space-y-4 rounded-lg bg-neutral-950 p-2 lg:space-y-6 lg:p-4"
	>
		<!-- Header -->
		<div
			class="flex items-center border-b border-neutral-800 py-2 text-sm font-semibold text-neutral-100 uppercase lg:text-base"
		>
			Hadiah Loyalitas
		</div>

		<!-- Desktop & Mobile Layout Container -->
		<div class="space-y-4 lg:space-y-6">
			<!-- User Level & Points Card -->
			<div class="space-y-4 rounded-lg bg-neutral-800 p-3 lg:p-4">
				<!-- Level Progress -->
				<div class="flex items-center gap-3 lg:gap-4">
					<!-- Badge -->
					<div class="flex-shrink-0">
						<img
							:src="userLevel.badge"
							alt="Badge"
							class="h-12 w-12 lg:h-16 lg:w-16"
						/>
					</div>

					<!-- Progress Bar -->
					<div class="flex-1">
						<div class="mb-1.5 flex items-center justify-between lg:mb-2">
							<div class="flex items-center gap-2">
								<span class="text-sm font-bold text-yellow-400 lg:text-base">
									{{ userLevel.name }}
								</span>
								<span
									class="rounded-full bg-neutral-700 px-2 py-0.5 text-[10px] text-neutral-300 lg:text-xs"
								>
									EXP
								</span>
							</div>
							<span class="text-[10px] text-neutral-400 lg:text-sm">
								{{ userLevel.currentExp }}/{{
									userLevel.maxExp.toLocaleString()
								}}
								EXP
							</span>
						</div>

						<!-- Progress Bar -->
						<div
							class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-700 lg:h-2"
						>
							<div
								class="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-300"
								:style="{ width: `${progressPercentage}%` }"
							></div>
						</div>
					</div>

					<!-- Arrow -->
					<div class="flex-shrink-0">
						<Icon
							name="lucide:chevron-right"
							class="h-4 w-4 text-neutral-400 lg:h-5 lg:w-5"
						/>
					</div>
				</div>

				<!-- Loyalty Points -->
				<div
					class="flex items-center justify-between rounded-lg bg-neutral-900 p-2.5 lg:p-3"
				>
					<div class="flex items-center gap-2">
						<Icon
							name="lucide:info"
							class="h-3.5 w-3.5 text-blue-400 lg:h-4 lg:w-4"
						/>
						<span
							class="text-[11px] font-semibold text-neutral-300 uppercase lg:text-sm"
						>
							Loyalty Point
						</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-1">
							<Icon
								name="lucide:coins"
								class="h-4 w-4 text-yellow-400 lg:h-5 lg:w-5"
							/>
							<span class="text-sm font-bold text-yellow-400 lg:text-base">
								{{ loyaltyPoints }}
							</span>
						</div>
						<button
							class="cursor-pointer rounded-full bg-neutral-700 p-1 transition-colors hover:bg-neutral-600 active:scale-95"
						>
							<Icon
								name="lucide:refresh-cw"
								class="h-3.5 w-3.5 text-neutral-300 lg:h-4 lg:w-4"
							/>
						</button>
					</div>
				</div>
			</div>

			<!-- Menu Icons -->
			<div class="rounded-lg bg-neutral-800 p-3 lg:p-4">
				<div class="grid grid-cols-5 gap-2 lg:gap-4">
					<button
						v-for="item in menuItems"
						:key="item.category"
						class="group flex cursor-pointer flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 lg:gap-2"
						@click="navigateToMenu(item)"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 transition-colors group-hover:bg-neutral-700 lg:h-16 lg:w-16"
						>
							<img
								:src="item.icon"
								:alt="item.label"
								class="h-5 w-5 lg:h-8 lg:w-8"
							/>
						</div>
						<span
							class="text-center text-[9px] leading-tight font-medium text-neutral-300 lg:text-xs"
						>
							{{ item.label }}
						</span>
					</button>
				</div>
			</div>

			<!-- Carousel Banner -->
			<div class="rounded-lg bg-neutral-800 p-2 lg:p-4">
				<LoyaltyCarousel :items="carouselItems" :auto-play-delay="4000" />
			</div>

			<!-- Tabs -->
			<div class="rounded-lg bg-neutral-800 p-2">
				<div class="flex gap-2">
					<button
						:class="[
							'flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase transition-colors active:scale-95 lg:px-4 lg:py-2 lg:text-sm',
							activeTab === 'semua'
								? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black'
								: 'bg-neutral-900 text-neutral-400 hover:bg-neutral-700',
						]"
						@click="activeTab = 'semua'"
					>
						Semua
					</button>
					<button
						:class="[
							'flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase transition-colors active:scale-95 lg:px-4 lg:py-2 lg:text-sm',
							activeTab === 'lucky-draw'
								? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black'
								: 'bg-neutral-900 text-neutral-400 hover:bg-neutral-700',
						]"
						@click="activeTab = 'lucky-draw'"
					>
						Lucky Draw
					</button>
				</div>
			</div>

			<!-- Lucky Draw Section -->
			<div class="space-y-3 lg:space-y-4">
				<!-- Section Header -->
				<div class="flex items-center justify-between px-2">
					<div class="flex items-center gap-2">
						<div class="h-5 w-1 rounded-full bg-yellow-400 lg:h-6"></div>
						<h2 class="text-sm font-bold text-white uppercase lg:text-lg">
							Lucky Draw
						</h2>
					</div>
					<button
						class="flex cursor-pointer items-center gap-1 text-[11px] text-yellow-400 transition-colors hover:text-yellow-300 active:scale-95 lg:text-sm"
					>
						Lihat Semua
						<Icon
							name="lucide:chevron-right"
							class="h-3.5 w-3.5 lg:h-4 lg:w-4"
						/>
					</button>
				</div>

				<!-- Lucky Draw Grid - Responsive -->
				<div
					class="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4"
				>
					<div
						v-for="item in luckyDrawItems"
						:key="item.id"
						class="group relative overflow-hidden rounded-lg bg-neutral-800 transition-all hover:scale-105 hover:shadow-xl"
					>
						<!-- Gift Icon Badge -->
						<div
							class="absolute top-1.5 left-1.5 z-10 rounded-lg bg-black/60 p-1.5 backdrop-blur-sm lg:top-2 lg:left-2 lg:p-2"
						>
							<Icon
								name="lucide:gift"
								class="h-4 w-4 text-white lg:h-6 lg:w-6"
							/>
						</div>

						<!-- Image -->
						<div class="relative aspect-square overflow-hidden">
							<img
								:src="item.image"
								:alt="item.title"
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
							/>

							<!-- Countdown Badge -->
							<div
								class="absolute bottom-1.5 left-1.5 rounded-md bg-red-600 px-1.5 py-0.5 lg:bottom-2 lg:left-2 lg:px-2 lg:py-1"
							>
								<div class="flex items-center gap-0.5 lg:gap-1">
									<Icon
										name="lucide:clock"
										class="h-2.5 w-2.5 text-white lg:h-3 lg:w-3"
									/>
									<span class="text-[10px] font-bold text-white lg:text-xs">
										{{ item.daysLeft }} Hari
									</span>
								</div>
							</div>
						</div>

						<!-- Content -->
						<div class="space-y-1.5 p-2 lg:space-y-2 lg:p-3">
							<!-- Title -->
							<h3
								class="line-clamp-2 text-[10px] leading-tight font-bold text-white uppercase lg:text-sm"
							>
								{{ item.title }}
							</h3>

							<!-- Points -->
							<div class="flex items-center gap-0.5 lg:gap-1">
								<Icon
									name="lucide:coins"
									class="h-3.5 w-3.5 text-yellow-400 lg:h-4 lg:w-4"
								/>
								<span class="text-xs font-bold text-yellow-400 lg:text-base">
									{{ item.points.toLocaleString() }}
								</span>
							</div>

							<!-- Action Button -->
							<button
								class="w-full cursor-pointer rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 py-1.5 text-[10px] font-bold text-black uppercase transition-all hover:from-yellow-600 hover:to-yellow-700 active:scale-95 lg:py-2 lg:text-sm"
							>
								Tukar Sekarang
							</button>
						</div>
					</div>
				</div>

				<!-- Empty State (if no items) -->
				<div
					v-if="luckyDrawItems.length === 0"
					class="flex flex-col items-center justify-center rounded-lg bg-neutral-800 py-12"
				>
					<Icon
						name="lucide:inbox"
						class="h-12 w-12 text-neutral-600 lg:h-16 lg:w-16"
					/>
					<p class="mt-4 text-xs text-neutral-400 lg:text-sm">
						Tidak ada Lucky Draw tersedia saat ini
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.group:hover .opacity-0 {
	animation: fadeIn 0.3s ease-in-out forwards;
}

/* Line clamp utility */
.line-clamp-2 {
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
