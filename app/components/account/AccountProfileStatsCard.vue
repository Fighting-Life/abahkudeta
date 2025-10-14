<script setup lang="ts">
const { $profileState } = useNuxtApp();
</script>
<template>
	<div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-6">
			<div class="flex items-center gap-4">
				<div class="rounded-full bg-black p-3">
					<svg
						class="h-6 w-6 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
						/>
					</svg>
				</div>
				<div>
					<p class="font-bold text-white">STATUS DEPOSIT TERAKHIR</p>
					<p class="text-sm text-gray-400">Tidak ada data.</p>
				</div>
			</div>
		</div>
		<div class="rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-6">
			<div class="flex items-center gap-4">
				<div class="rounded-full bg-black p-3">
					<svg
						class="h-6 w-6 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
						/>
					</svg>
				</div>
				<div>
					<p class="font-bold text-white">STATUS PENARIKAN TERAKHIR</p>
					<p class="text-sm text-gray-400">Tidak ada data.</p>
				</div>
			</div>
		</div>
	</div>
</template>
