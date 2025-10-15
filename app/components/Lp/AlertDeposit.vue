<script setup lang="ts">
const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const props = defineProps<{
	open: boolean;
}>();
const modelValue = useVModel(props, "open", emits, {
	passive: true,
});
</script>
<template>
	<HeadlessTransitionRoot appear :show="modelValue" as="template">
		<HeadlessDialog
			as="div"
			class="relative z-[9999]"
			@close="() => (modelValue = false)"
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
				<div class="fixed inset-0 bg-black/25" />
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
							class="w-full transform overflow-hidden rounded-2xl bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] text-left align-middle text-white shadow-xl transition-all lg:max-w-lg"
						>
							<div class="relative flex w-full items-center px-5 py-6">
								<div class="absolute top-3 right-3 z-40">
									<button
										class="inline-flex cursor-pointer items-center justify-center bg-transparent text-white active:scale-95"
										@click="() => (modelValue = false)"
									>
										<icon name="ph:x-bold" class="text-lg font-bold" />
									</button>
								</div>
								<div class="flex h-full w-full flex-col gap-5">
									<div class="flex w-full items-center justify-center">
										<Icon
											name="mdi:alert-circle-outline"
											class="text-7xl text-white"
										/>
									</div>
								</div>
							</div>
							<div
								class="flex flex-col items-center gap-10 bg-neutral-950 py-10"
							>
								<div class="text-sm">
									Silahkan deposit terlebih dahulu untuk melanjutkan permainan.
								</div>
								<button
									class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] px-10 py-1 text-sm font-semibold uppercase active:scale-95"
									@click="modelValue = false"
								>
									OK
								</button>
							</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>
<style scoped></style>
