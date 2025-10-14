<script setup lang="ts">
const route = useRoute();
const queryTName = computed(() => route.query.t as string);
</script>

<template>
	<div class="mb-6 grid grid-cols-2 gap-4">
		<NuxtLink
			to="/account?q=main&t=summary"
			class="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-4 transition-colors hover:bg-[#141415]"
		>
			<img
				:src="
					queryTName === 'summary' ||
					queryTName === 'profile-update' ||
					queryTName === 'password-update' ||
					queryTName === 'banking-update'
						? '/images/menus/profile-active.webp'
						: '/images/menus/profile.webp'
				"
				alt="Akun Saya"
				class="mb-2 h-8 w-8"
			/>
			<span class="text-sm text-gray-300">Akun Saya</span>
		</NuxtLink>
		<NuxtLink
			to="/account?q=main&t=referral"
			class="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-4 transition-colors hover:bg-[#141415]"
		>
			<img
				:src="
					queryTName === 'referral'
						? '/images/menus/referral-active.webp'
						: '/images/menus/referral.webp'
				"
				alt="Referral"
				class="mb-2 h-8 w-8"
			/>
			<span class="text-sm text-gray-300">Referral</span>
		</NuxtLink>
	</div>
</template>
