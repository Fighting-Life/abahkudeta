<script setup lang="ts">
const { showWarning, countdown, cancelAutoLogout } = useAutoLogout();
</script>

<template>
	<HeadlessTransitionRoot appear :show="showWarning" as="template">
		<HeadlessDialog
			as="div"
			class="relative z-[99999]"
			@close="cancelAutoLogout"
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
					class="flex min-h-full items-center justify-center p-4 text-center"
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
							class="w-full max-w-md transform overflow-hidden rounded-2xl border-2 border-yellow-400 bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all"
						>
							<!-- Icon -->
							<div class="mb-4 flex justify-center">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20"
								>
									<Icon
										name="mdi:clock-alert-outline"
										class="text-4xl text-yellow-400"
									/>
								</div>
							</div>

							<!-- Title -->
							<HeadlessDialogTitle
								as="h3"
								class="mb-2 text-center text-xl font-bold text-neutral-100"
							>
								Sesi Akan Berakhir
							</HeadlessDialogTitle>

							<!-- Description -->
							<div class="mb-6 text-center">
								<p class="mb-4 text-neutral-400">
									Anda akan logout otomatis karena tidak ada aktivitas
								</p>

								<!-- Countdown Timer -->
								<div class="mb-2 flex items-center justify-center gap-2">
									<div
										class="flex min-w-[80px] items-center justify-center rounded-lg bg-black px-4 py-3"
									>
										<span class="font-mono text-3xl font-bold text-yellow-400">
											{{
												Math.floor(countdown / 60)
													.toString()
													.padStart(2, "0")
											}}
										</span>
									</div>
									<span class="text-2xl text-yellow-400">:</span>
									<div
										class="flex min-w-[80px] items-center justify-center rounded-lg bg-black px-4 py-3"
									>
										<span class="font-mono text-3xl font-bold text-yellow-400">
											{{ (countdown % 60).toString().padStart(2, "0") }}
										</span>
									</div>
								</div>

								<p class="text-xs text-neutral-500">Menit : Detik</p>
							</div>

							<!-- Actions -->
							<div class="flex gap-3">
								<button
									class="inline-flex flex-1 items-center justify-center rounded-lg bg-neutral-700 px-4 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:bg-neutral-600 active:scale-95"
									@click="() => {}"
								>
									Biarkan Logout
								</button>
								<button
									class="inline-flex flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-yellow-500 hover:to-yellow-700 active:scale-95"
									@click="cancelAutoLogout"
								>
									Tetap Login
								</button>
							</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>
