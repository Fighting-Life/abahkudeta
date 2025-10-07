<script setup lang="ts">
import { cn } from "~/lib/utils";

interface NavMenu {
	label: string;
	icon: string;
	link: string;
	type_link: "page" | "button" | "external";
}

const route = useRoute();
const navMenus: NavMenu[] = [
	{
		label: "Beranda",
		icon: "ic:round-home",
		link: "/",
		type_link: "page",
	},
	{
		label: "Promosi",
		icon: "tabler:gift",
		link: "/promotion",
		type_link: "page",
	},
	{
		label: "Depo/WD",
		icon: "solar:dollar-linear",
		link: "#",
		type_link: "button",
	},
	{
		label: "Live Chat",
		icon: "garden:headset-stroke-12",
		link: "https://direct.lc.chat/19100937",
		type_link: "external",
	},
	{
		label: "Akun Saya",
		icon: "ph:user-bold",
		link: "/account",
		type_link: "page",
	},
];
</script>
<template>
	<div class="block lg:hidden">
		<div
			class="fixed right-0 bottom-0 left-0 z-[9999] w-full border-t-2 border-solid border-yellow-400 bg-gray-800 pt-5 pb-3"
		>
			<div class="flex w-full items-center justify-between px-4">
				<template v-for="(menu, i) in navMenus" :key="i">
					<a
						v-if="menu.type_link === 'page'"
						:href="menu.link"
						:class="
							cn(
								'flex flex-col items-center gap-1',
								route.fullPath === menu.link ? 'text-yellow-400' : 'text-white',
							)
						"
					>
						<icon :name="menu.icon" class="text-2xl" />
						<div class="text-xs font-semibold">
							{{ menu.label }}
						</div>
					</a>
					<button
						v-else-if="menu.type_link === 'button'"
						class="flex cursor-pointer flex-col items-center gap-1"
					>
						<icon :name="menu.icon" class="text-2xl" />
						<div class="text-xs font-semibold">
							{{ menu.label }}
						</div>
					</button>
					<a
						v-else
						:href="menu.link"
						target="_blank"
						rel="noopener"
						:class="
							cn(
								'flex flex-col items-center gap-1',
								route.fullPath === menu.link ? 'text-yellow-400' : 'text-white',
							)
						"
					>
						<icon :name="menu.icon" class="text-2xl" />
						<div class="text-xs font-semibold">
							{{ menu.label }}
						</div>
					</a>
				</template>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
