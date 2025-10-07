<script setup lang="ts">
import { cn } from "~/lib/utils";

const isOpen = ref(false);
const toast = useToast();
const {
	getCurrentClaim,
	canClaim,
	claimDoubleExp,
	getNextClaimTime,
	deactivateExpiredClaims,
} = useDoubleExp();

const currentClaim = ref<any>(null);
const isClaimable = ref(true);
const isLoading = ref(false);
const currentTime = ref(new Date());

const isClaimed = computed(() => !!currentClaim.value?.is_active);

const expEndTime = computed(() => {
	if (!currentClaim.value?.expires_at) return null;
	return new Date(currentClaim.value.expires_at);
});

const nextClaimTime = computed(() => {
	if (!currentClaim.value?.next_claim_at) return null;
	return new Date(currentClaim.value.next_claim_at);
});

const expTimeLeft = computed(() => {
	if (!expEndTime.value) return { hours: 0, minutes: 0, seconds: 0 };

	const diff = expEndTime.value.getTime() - currentTime.value.getTime();
	if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

	return {
		hours: Math.floor(diff / (1000 * 60 * 60)),
		minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((diff % (1000 * 60)) / 1000),
	};
});

const nextClaimTimeLeft = computed(() => {
	if (!nextClaimTime.value) return { hours: 0, minutes: 0, seconds: 0 };

	const diff = nextClaimTime.value.getTime() - currentTime.value.getTime();
	if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

	return {
		hours: Math.floor(diff / (1000 * 60 * 60)),
		minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
		seconds: Math.floor((diff % (1000 * 60)) / 1000),
	};
});

const formatTime = (num: number) => num.toString().padStart(2, "0");

let timerInterval: NodeJS.Timeout;

const loadClaimData = async () => {
	try {
		await deactivateExpiredClaims();
		currentClaim.value = await getCurrentClaim();
		isClaimable.value = await canClaim();
	} catch (error) {
		console.error("Error loading claim data:", error);
	}
};

const handleClaim = async () => {
	if (isLoading.value) return;

	isLoading.value = true;
	try {
		const claim = await claimDoubleExp();
		currentClaim.value = claim;

		toast.success(
			"Double EXP berhasil diklaim! Selamat menikmati bonus 2x EXP.",
		);
	} catch (error: any) {
		console.error("Claim error:", error);

		if (error.message?.includes("wait")) {
			toast.error("Anda harus menunggu sebelum klaim lagi");
		} else {
			toast.error(error.message || "Gagal klaim Double EXP");
		}
	} finally {
		isLoading.value = false;
	}
};

const handleOpenModal = async () => {
	isOpen.value = true;
	await loadClaimData();
};

onMounted(() => {
	timerInterval = setInterval(() => {
		currentTime.value = new Date();

		// Auto reload if expired
		if (
			expTimeLeft.value.hours === 0 &&
			expTimeLeft.value.minutes === 0 &&
			expTimeLeft.value.seconds === 0
		) {
			loadClaimData();
		}
	}, 1000);
});

onUnmounted(() => {
	if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
	<button
		class="flex cursor-pointer items-center justify-center gap-1 text-white transition-all active:scale-95"
		@click="handleOpenModal"
	>
		<img
			:src="
				isClaimed
					? '/images/badge/chest-open.webp'
					: '/images/badge/chest-claimed.webp'
			"
			class="h-7 w-7 object-fill"
		/>
	</button>

	<HeadlessTransitionRoot appear :show="isOpen" as="template">
		<HeadlessDialog
			as="div"
			class="relative z-[9999]"
			@close="() => (isOpen = false)"
		>
			<HeadlessTransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
			</HeadlessTransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center px-4 text-center"
				>
					<HeadlessTransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<HeadlessDialogPanel
							class="w-full max-w-lg transform overflow-hidden rounded-2xl shadow-2xl transition-all"
						>
							<!-- Header -->
							<div
								class="relative bg-gradient-to-br from-yellow-400 to-yellow-600 px-5 py-4"
							>
								<button
									:class="
										cn(
											'absolute inline-flex cursor-pointer items-center justify-center text-white transition-colors hover:text-gray-200 active:scale-95',
											isClaimed ? 'top-0 right-4' : 'top-4 right-4',
										)
									"
									@click="() => (isOpen = false)"
								>
									<Icon
										name="material-symbols:close-small-outline"
										class="text-3xl"
									/>
								</button>
							</div>

							<!-- Content -->
							<div class="bg-gray-950 px-6 py-10 lg:px-10">
								<!-- Chest Animation -->
								<div class="mb-6 flex justify-center">
									<div class="relative">
										<img
											:src="
												isClaimed
													? '/images/badge/chest-open.webp'
													: '/images/badge/chest-close.webp'
											"
											:class="
												cn(
													'h-32 w-auto transition-all duration-500',
													!isClaimed && 'animate-bounce',
												)
											"
										/>
										<div
											v-if="!isClaimed"
											class="absolute inset-0 -z-10 rounded-full bg-yellow-400 opacity-50 blur-2xl"
										/>
									</div>
								</div>

								<!-- Claimed Badge -->
								<Transition name="fade-scale">
									<div
										v-if="isClaimed"
										class="mb-6 flex items-center justify-center gap-3"
									>
										<div class="text-3xl font-bold text-green-400">+DOUBLE</div>
										<div
											class="rounded-lg border border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800 px-3 py-1.5 text-lg font-semibold text-gray-100"
										>
											EXP
										</div>
									</div>
								</Transition>

								<!-- Description -->
								<div
									class="mb-6 text-center text-sm leading-relaxed text-gray-300"
								>
									<template v-if="!isClaimed">
										Double EXP adalah event yang dapat diikuti agar dapat
										memperoleh tambahan dua kali lipat EXP pada periode
										tertentu.
									</template>
									<template v-else>
										Selamat! Anda telah mengaktifkan Double EXP. Nikmati bonus
										pengalaman 2x lipat!
									</template>
								</div>

								<!-- Timer Box -->
								<div
									class="mb-8 rounded-xl border border-yellow-600/30 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-6"
								>
									<div
										class="mb-3 text-center text-sm font-medium text-yellow-400"
									>
										{{
											isClaimed
												? "Double EXP aktif selama:"
												: "EXP ganda akan berakhir dalam:"
										}}
									</div>

									<!-- Digital Timer -->
									<div class="mb-4 flex items-center justify-center gap-2">
										<div
											class="flex min-w-[80px] items-center justify-center rounded-lg bg-black px-4 py-3"
										>
											<span
												class="font-mono text-3xl font-bold text-yellow-400"
											>
												{{ formatTime(expTimeLeft.hours) }}
											</span>
										</div>
										<span class="text-2xl text-yellow-400">:</span>
										<div
											class="flex min-w-[80px] items-center justify-center rounded-lg bg-black px-4 py-3"
										>
											<span
												class="font-mono text-3xl font-bold text-yellow-400"
											>
												{{ formatTime(expTimeLeft.minutes) }}
											</span>
										</div>
										<span class="text-2xl text-yellow-400">:</span>
										<div
											class="flex min-w-[80px] items-center justify-center rounded-lg bg-black px-4 py-3"
										>
											<span
												class="font-mono text-3xl font-bold text-yellow-400"
											>
												{{ formatTime(expTimeLeft.seconds) }}
											</span>
										</div>
									</div>

									<!-- Labels -->
									<div class="flex items-center justify-center gap-12">
										<span class="text-xs font-semibold text-gray-400 uppercase"
											>JAM</span
										>
										<span class="text-xs font-semibold text-gray-400 uppercase"
											>MENIT</span
										>
										<span class="text-xs font-semibold text-gray-400 uppercase"
											>DETIK</span
										>
									</div>
								</div>

								<!-- Claim Button -->
								<div class="space-y-4">
									<button
										:class="
											cn(
												'inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold tracking-wide uppercase shadow-lg transition-all',
												isClaimed || !isClaimable || isLoading
													? 'cursor-not-allowed border border-gray-600 bg-gray-700 text-gray-400'
													: 'cursor-pointer bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-yellow-500/50 hover:from-yellow-500 hover:to-yellow-700 active:scale-95',
											)
										"
										:disabled="isClaimed || !isClaimable || isLoading"
										@click="handleClaim"
									>
										<Icon
											v-if="isLoading"
											name="svg-spinners:ring-resize"
											class="text-xl"
										/>
										<template v-if="isLoading"> MEMPROSES... </template>
										<template v-else>
											{{ isClaimed ? "SUDAH DIKLAIM" : "CLAIM SEKARANG" }}
										</template>
									</button>

									<!-- Next Claim Countdown -->
									<Transition name="fade-slide-down">
										<div v-if="isClaimed && nextClaimTime" class="text-center">
											<p class="mb-2 text-sm text-gray-400">
												Klaim hadiah lagi dalam:
											</p>
											<div
												class="flex items-center justify-center gap-1 font-mono font-semibold text-red-400"
											>
												<Icon name="mdi:clock-outline" class="text-lg" />
												<span>{{ formatTime(nextClaimTimeLeft.hours) }}</span>
												<span>:</span>
												<span>{{ formatTime(nextClaimTimeLeft.minutes) }}</span>
												<span>:</span>
												<span>{{ formatTime(nextClaimTimeLeft.seconds) }}</span>
											</div>
										</div>
									</Transition>

									<!-- Not Claimable Info -->
									<Transition name="fade-slide-down">
										<div
											v-if="!isClaimed && !isClaimable"
											class="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-center"
										>
											<p class="text-sm text-orange-400">
												<Icon
													name="mdi:information-outline"
													class="inline text-base"
												/>
												Anda harus menunggu sebelum bisa klaim lagi
											</p>
										</div>
									</Transition>
								</div>
							</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<style scoped>
/* Fade scale transition */
.fade-scale-enter-active,
.fade-scale-leave-active {
	transition: all 0.3s ease;
}

.fade-scale-enter-from {
	opacity: 0;
	transform: scale(0.8);
}

.fade-scale-leave-to {
	opacity: 0;
	transform: scale(0.8);
}

/* Fade slide down transition */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
	transition: all 0.3s ease;
}

.fade-slide-down-enter-from {
	opacity: 0;
	transform: translateY(-10px);
}

.fade-slide-down-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Bounce animation */
@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

.animate-bounce {
	animation: bounce 2s infinite;
}
</style>
