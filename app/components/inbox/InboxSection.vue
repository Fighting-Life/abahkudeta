<script setup lang="ts">
import { cn } from "~/lib/utils";

const route = useRoute();

const queryTName = computed(() => route.query.t as string);
const topMenuItems = [
	{
		name: "Kotak Masuk",
		query: "inbox",
		link: "/account?q=messages&t=inbox",
		icon: "ic:round-email",
	},
	{
		name: "Pengumuman",
		query: "announcement",
		link: "/account?q=messages&t=announcement",
		icon: "ic:baseline-notifications",
	},
	{
		name: "Ticket",
		query: "ticket",
		link: "/account?q=messages&t=ticket",
		icon: "mingcute:send-plane-fill",
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
						<Icon
							:name="menu.icon"
							:class="
								cn(
									'mb-2 text-3xl',
									queryTName === menu.query.toLowerCase()
										? 'text-[#e5d177]'
										: 'text-neutral-300',
								)
							"
						/>
						<span class="text-sm whitespace-nowrap text-neutral-300">
							{{ menu.name }}
						</span>
					</NuxtLink>
				</div>
			</div>
		</div>
		<div v-if="queryTName === 'inbox'">
			<InboxList />
		</div>
		<div v-else-if="queryTName === 'announcement'">
			<AnnouncementList />
		</div>
		<div v-else-if="queryTName === 'ticket'">
			<TicketForm />
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
