<script setup lang="ts">
const route = useRoute();

const queryTName = computed(() => route.query.t as string);
const topMenuItems = [
	{
		name: "Deposit",
		query: "deposit",
		link: "/account?q=finance&t=deposit",
		image: "/images/menus/deposit.webp",
		image_active: "/images/menus/deposit-active.webp",
	},
	{
		name: "Penarikan",
		query: "withdrawal",
		link: "/account?q=finance&t=withdrawal",
		image: "/images/menus/withdrawal.webp",
		image_active: "/images/menus/withdrawal-active.webp",
	},
	{
		name: "Klaim Bonus",
		query: "claim",
		link: "/account?q=finance&t=claim",
		image: "/images/menus/claim.webp",
		image_active: "/images/menus/claim-active.webp",
	},
];
</script>

<template>
	<div class="animate-page-grow rounded-lg p-0 lg:p-6">
		<div class="flex-1">
			<!-- Grid responsive dengan overflow di desktop -->
			<div class="w-full">
				<div
					class="scrollbar-thin scrollbar-thumb-[#4a5568] scrollbar-track-[#2a2a2a] grid auto-cols-[minmax(120px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3 lg:auto-cols-[minmax(140px,1fr)]"
				>
					<NuxtLink
						v-for="(menu, i) in topMenuItems"
						:key="i"
						:to="menu.link"
						class="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-4 transition-colors hover:bg-[#141415]"
					>
						<img
							:src="
								queryTName === menu.query.toLowerCase()
									? menu.image_active
									: menu.image
							"
							:alt="menu.name"
							class="mb-2 h-8 w-8"
						/>
						<span class="text-sm whitespace-nowrap text-neutral-300">{{
							menu.name
						}}</span>
					</NuxtLink>
				</div>
			</div>
		</div>
		<div v-if="queryTName === 'deposit'">
			<account-deposit-form />
		</div>
		<div v-if="queryTName === 'withdrawal'">
			<account-withdrawal-form />
		</div>
		<div v-if="queryTName === 'claim'">
			<account-claim-form />
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar styling */
.scroll-container::-webkit-scrollbar {
	height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
	background: #2a2a2a;
	border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
	background: #4a5568;
	border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
	background: #718096;
}
</style>
