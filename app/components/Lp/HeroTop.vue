<script setup lang="ts">
import { TransitionExpand } from "@morev/vue-transitions";
import { cn } from "~/lib/utils";

const route = useRoute();
const openMenuOverly = ref(false);
const menuSelected = ref<SubMenu[] | undefined>([]);
const menuContainer = ref<HTMLElement | null>(null);
const { launchGame } = useGameLauncher();

const scrollLeft = () => {
	if (!import.meta.client) return;
	const container = document.querySelector("#scroll-container");
	if (container) {
		container.scrollBy({ left: -200, behavior: "smooth" });
	}
};

const scrollRight = () => {
	if (!import.meta.client) return;
	const container = document.querySelector("#scroll-container");
	if (container) {
		container.scrollBy({ left: 200, behavior: "smooth" });
	}
};

const onMouseEnterMenu = (menu?: SubMenu[]) => {
	if (menu?.length) {
		menuSelected.value = menu;
		openMenuOverly.value = true;
	} else {
		menuSelected.value = undefined;
		openMenuOverly.value = false;
	}
};

const onMouseLeaveMenu = (event: MouseEvent) => {
	// Cek apakah mouse benar-benar keluar dari container utama
	if (!menuContainer.value) return;

	const relatedTarget = event.relatedTarget as HTMLElement;

	// Jika relatedTarget null atau tidak berada dalam container menu
	if (!relatedTarget || !menuContainer.value.contains(relatedTarget)) {
		menuSelected.value = undefined;
		openMenuOverly.value = false;
	}
};

// Optional: Timer untuk smooth transition
let closeTimer: NodeJS.Timeout;

const delayedClose = () => {
	closeTimer = setTimeout(() => {
		menuSelected.value = undefined;
		openMenuOverly.value = false;
	}, 150); // Delay 150ms untuk mencegah accidental close
};

const cancelClose = () => {
	if (closeTimer) {
		clearTimeout(closeTimer);
	}
};

function getIcon(slug: string, url: string) {
	if (route.path.replaceAll("/", "") === slug) {
		return url.replace(".svg", "-active.svg");
	}
	return url;
}
</script>
<template>
	<!-- Container utama yang membungkus trigger dan overlay -->
	<div
		ref="menuContainer"
		class="relative w-full"
		@mouseleave="onMouseLeaveMenu"
	>
		<!-- Trigger Menu -->
		<div
			class="-mt-1.5 w-full border-b border-b-gray-700 bg-gray-950 py-4 lg:-mt-4 lg:border-none lg:bg-gray-800"
		>
			<div class="container mx-auto w-full lg:max-w-[1024px]">
				<div class="flex w-full items-center justify-center gap-3">
					<button
						class="hidden cursor-pointer items-center justify-center active:scale-95 lg:flex"
						@click="scrollLeft"
					>
						<Icon
							name="mdi:chevron-left-circle"
							class="text-2xl text-gray-50"
						/>
					</button>
					<div
						id="scroll-container"
						class="scrollbar-hidden flex w-full items-center overflow-hidden overflow-x-auto"
						style=""
					>
						<NuxtLink
							v-for="(category, i) in CategoriesTopMenu"
							:key="i"
							:to="{
								name: 'category-game',
								params: { category: category.slug },
							}"
							class="group flex w-full min-w-min cursor-pointer flex-col items-center justify-center gap-2 px-6 font-bold text-gray-50 uppercase lg:flex-row lg:border-r lg:border-r-gray-600"
							@mouseenter="onMouseEnterMenu(category.sub)"
							@mouseleave="cancelClose"
						>
							<img
								:src="getIcon(category.slug, category.icon)"
								:alt="category.name"
								class="h-7 w-7 object-fill group-hover:text-[#e5d177] lg:h-4 lg:w-4"
							/>
							<div
								:class="
									cn(
										'text-[10px] text-nowrap group-hover:text-[#e5d177] lg:text-xs',
										route.fullPath.replaceAll('/', '') === category.slug
											? 'text-[#e5d177]'
											: 'text-gray-50',
									)
								"
							>
								{{ category.name }}
							</div>
							<div
								:class="
									cn(
										'hidden items-center justify-center group-hover:rotate-180 group-hover:text-[#e5d177] lg:flex',
										route.fullPath.replaceAll('/', '') === category.slug
											? 'text-[#e5d177]'
											: 'text-gray-50',
									)
								"
							>
								<Icon name="solar:alt-arrow-down-bold" class="text-lg" />
							</div>
						</NuxtLink>
						<button
							v-for="(category, i) in CategoriesTopMenu"
							:key="i"
							class="group flex w-full min-w-min cursor-pointer flex-col items-center justify-center gap-2 px-6 font-bold text-gray-50 uppercase lg:hidden lg:flex-row lg:border-r lg:border-r-gray-600"
							style="display: none"
							@mouseenter="onMouseEnterMenu(category.sub)"
							@mouseleave="cancelClose"
						>
							<img
								:src="category.icon"
								:alt="category.name"
								class="h-7 w-7 object-fill group-hover:text-[#e5d177] lg:h-4 lg:w-4"
							/>
							<div
								class="text-[10px] text-nowrap group-hover:text-[#e5d177] lg:text-xs"
							>
								{{ category.name }}
							</div>
							<div
								class="hidden items-center justify-center group-hover:rotate-180 group-hover:text-[#e5d177] lg:flex"
							>
								<Icon name="solar:alt-arrow-down-bold" class="text-lg" />
							</div>
						</button>
					</div>
					<button
						class="hidden cursor-pointer items-center justify-center active:scale-95 lg:flex"
						@click="scrollRight"
					>
						<Icon
							name="mdi:chevron-right-circle"
							class="text-2xl text-gray-50"
						/>
					</button>
				</div>
			</div>
		</div>

		<!-- Overlay Menu -->
		<ClientOnly>
			<TransitionExpand :duration="300">
				<div
					v-if="openMenuOverly"
					class="absolute top-full left-0 z-50 hidden w-full border-b-8 border-b-[#e5d177] bg-gray-950 py-5 lg:block"
					@mouseenter="cancelClose"
					@mouseleave="delayedClose"
				>
					<div class="container mx-auto w-full lg:max-w-[1024px]">
						<div
							class="scrollbar-thin scrollbar-track-gray-500 scrollbar-thumb-gray-900 flex max-h-[60vh] flex-wrap items-center justify-center gap-12 overflow-x-auto overflow-y-auto"
						>
							<button
								v-for="(sub, i) in menuSelected"
								:key="i"
								class="flex cursor-pointer flex-col items-center justify-center gap-2"
								@click.stop="launchGame(sub.link)"
							>
								<img
									:src="sub.icon"
									:alt="sub.name"
									class="h-24 w-auto object-fill object-center"
								/>
								<div class="text-xs font-bold text-gray-100">
									{{ sub.name }}
								</div>
							</button>
						</div>
					</div>
				</div>
			</TransitionExpand>
		</ClientOnly>
	</div>
</template>
<style scoped>
.scrollbar-hidden {
	::-webkit-scrollbar {
		display: none;
		width: 0px;
		background: transparent;
	}
	::-webkit-scrollbar-button {
		display: none;
		width: 0px;
		background: transparent;
	}
	::-moz-scrollbar {
		display: none;
		width: 0px;
		background: transparent;
	}
}
</style>
