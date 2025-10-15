<script setup lang="ts">
interface RadioItem {
	id: string | number;
	name: string;
	image: string;
	is_available: boolean;
	value: string;
}

const props = defineProps<{
	items: RadioItem[];
	modelValue?: string;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const selectedValue = ref(props.modelValue || "");

const handleSelect = (item: RadioItem) => {
	if (!item.is_available) return;

	selectedValue.value = item.value;
	emit("update:modelValue", item.value);
};

// Watch for external changes
watch(
	() => props.modelValue,
	(newValue) => {
		selectedValue.value = newValue || "";
	},
);
</script>

<template>
	<div
		class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
	>
		<div
			v-for="item in items"
			:key="item.id"
			class="relative cursor-pointer"
			:class="{
				'cursor-not-allowed opacity-60': !item.is_available,
				'cursor-pointer': item.is_available,
			}"
			@click="handleSelect(item)"
		>
			<!-- Radio Card -->
			<div
				class="relative overflow-hidden rounded-lg border-2 transition-all duration-200"
				:class="{
					'border-yellow-500 bg-yellow-500/10':
						selectedValue === item.value && item.is_available,
					'border-neutral-600 bg-neutral-800/50 hover:border-neutral-500':
						selectedValue !== item.value && item.is_available,
					'border-neutral-700 bg-neutral-900/50': !item.is_available,
				}"
			>
				<!-- Gambar -->
				<div class="relative aspect-square w-full overflow-hidden">
					<img
						:src="item.image"
						:alt="item.name"
						class="h-full w-full object-cover"
						:class="{
							'opacity-40': !item.is_available,
						}"
					/>

					<!-- Overlay Maintenance -->
					<div
						v-if="!item.is_available"
						class="absolute inset-0 flex items-center justify-center bg-black/70"
					>
						<div class="text-center">
							<div class="mx-auto mb-1 h-6 w-6">
								<svg
									class="h-6 w-6 text-red-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<span class="text-xs font-semibold text-white">MAINTENANCE</span>
						</div>
					</div>
				</div>

				<!-- Nama Item -->
				<div
					class="p-3 text-center"
					:class="{
						'text-neutral-300': item.is_available,
						'text-neutral-500': !item.is_available,
					}"
				>
					<span class="text-sm font-medium">{{ item.name }}</span>
				</div>

				<!-- Radio Indicator -->
				<div
					v-if="item.is_available"
					class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2"
					:class="{
						'border-yellow-500 bg-yellow-500': selectedValue === item.value,
						'border-neutral-400': selectedValue !== item.value,
					}"
				>
					<div
						v-if="selectedValue === item.value"
						class="h-2 w-2 rounded-full bg-white"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>
