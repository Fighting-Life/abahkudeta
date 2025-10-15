<script setup lang="ts">
const route = useRoute();
const queryTypeName = computed(() => route.query.t as string);
</script>

<template>
	<div class="w-full space-y-6 rounded-lg bg-neutral-950 p-2 lg:p-4">
		<div
			class="flex items-center border-b border-neutral-800 py-2 text-neutral-100"
		>
			Pengumuman
		</div>
		<div
			class="m-auto flex h-full min-h-[200px] w-full flex-col items-center justify-center"
		>
			<p class="text-sm text-neutral-300">Belum Ada Pesan</p>
		</div>
	</div>
</template>
