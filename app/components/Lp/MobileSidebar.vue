<script setup lang="ts">
import { TransitionSlide } from "@morev/vue-transitions";

type ExpandMenuType =
	| "games"
	| "kasir"
	| "pesan"
	| "profile"
	| "referral"
	| "report"
	| undefined;

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
	(e: "openLogin", value: boolean): void;
	(e: "openSearch", value: boolean): void;
}>();

const props = defineProps<{
	open: boolean;
}>();

const route = useRoute();
const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();
const { $profileState, $refreshProfile } = useNuxtApp();

const sidebarContainer = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);
const expandMenuType = ref<ExpandMenuType>(undefined);
const modelValue = useVModel(props, "open", emits, {
	passive: true,
});

// Dynamic scroll height calculation
const scrollHeight = computed(() => {
	// Jika user login: header (~200px) + padding
	// Jika guest: header (~120px) + padding
	const headerHeight = user.value ? 220 : 140;
	return `calc(100vh - ${headerHeight}px)`;
});

// Handle click outside
onClickOutside(sidebarContainer, (event) => {
	modelValue.value = false;
	expandMenuType.value = undefined;
});

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
	if (event.key === "Escape" && modelValue.value) {
		modelValue.value = false;
		expandMenuType.value = undefined;
	}
};

// Handle overlay click
const handleOverlayClick = (event: MouseEvent) => {
	if (event.target === overlayRef.value) {
		modelValue.value = false;
		expandMenuType.value = undefined;
	}
};

const handleMenuExpand = (value?: ExpandMenuType) => {
	expandMenuType.value = value;
};

onMounted(() => {
	document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleEscape);
});

async function handleSignOut() {
	await supabase.auth.signOut({
		scope: "global",
	});
	await $refreshProfile();
	await navigateTo("/");
}
</script>

<template>
	<client-only>
		<TransitionSlide :duration="300" direction="right">
			<div
				v-if="open"
				ref="overlayRef"
				class="fixed inset-0 z-[9999] flex justify-end bg-black/30 backdrop-blur-sm"
				@click="handleOverlayClick"
			>
				<div
					v-if="open"
					ref="sidebarContainer"
					class="flex h-full w-[80%] max-w-sm flex-col bg-neutral-900 shadow-2xl"
					@click.stop
				>
					<div class="flex-shrink-0 px-3 py-4 sm:px-4">
						<nav class="space-y-2">
							<div v-if="user" class="grid gap-3">
								<div class="flex items-center justify-between">
									<div
										class="max-w-[60%] truncate text-sm font-bold text-[#e5d177] lowercase"
									>
										{{ $profileState?.username }}
									</div>
									<div
										class="flex items-center justify-center gap-1.5 sm:gap-2"
									>
										<img
											src="/images/badge/bronze.svg"
											class="h-5 w-5 object-fill sm:h-6 sm:w-6"
										/>
										<div class="level-bronze text-xs font-bold sm:text-sm">
											BRONZE
										</div>
									</div>
								</div>
								<div class="grid w-full gap-2 sm:gap-3">
									<div
										class="inline-flex w-full items-center justify-start rounded-md bg-black px-3 py-2 text-sm font-medium text-neutral-100 sm:text-base"
									>
										{{ formatBalanceWithCurrency($profileState?.balance) }}
									</div>
									<NuxtLink
										to="/account?q=loyalty&t=benefits"
										class="inline-flex w-full items-center justify-start gap-3 rounded-md bg-black px-3 py-2 text-sm font-medium text-neutral-100 sm:gap-4"
									>
										<div
											class="flex items-center justify-center rounded-md bg-amber-500 px-2 py-0.5 text-xs sm:text-sm"
										>
											LP
										</div>
										<div class="text-sm text-amber-500 sm:text-base">0</div>
									</NuxtLink>
									<NuxtLink
										to="/account?q=loyalty&t=rewards"
										class="inline-flex w-full items-center justify-start gap-3 rounded-md bg-black px-3 py-2 text-sm font-medium text-neutral-100 sm:gap-4"
									>
										<div
											class="flex items-center justify-center rounded-md border border-neutral-300 px-2 py-0.5 text-xs sm:text-sm"
										>
											EXP
										</div>
										<div class="text-sm sm:text-base">0</div>
									</NuxtLink>
									<div class="flex w-full items-center justify-center">
										<button
											class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-neutral-700 px-6 py-2 text-xs font-semibold text-neutral-200 uppercase shadow-xl transition-all active:scale-95 sm:text-sm"
											@click="handleSignOut"
										>
											KELUAR
										</button>
									</div>
								</div>
							</div>
							<div v-else class="grid gap-2 sm:gap-3">
								<button
									class="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-neutral-300 py-3 text-xs font-semibold text-white uppercase active:scale-95 sm:text-sm"
									@click="
										() => {
											emits('openLogin', true);
											handleMenuExpand(undefined);
										}
									"
								>
									MASUK
								</button>
								<NuxtLink
									href="/register"
									class="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-neutral-300 bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] py-3 text-xs font-semibold text-white uppercase active:scale-95 sm:text-sm"
								>
									DAFTAR
								</NuxtLink>
							</div>
						</nav>
					</div>
					<ScrollArea
						class="flex-1 px-3 sm:px-4"
						:style="{ maxHeight: scrollHeight }"
					>
						<div class="grid gap-1 pb-4">
							<button
								class="group inline-flex w-full cursor-pointer items-center justify-start gap-2 rounded-md bg-black px-3 py-3 text-start text-sm font-semibold text-white capitalize active:scale-95"
								@click="
									() => {
										emits('openSearch', true);
										handleMenuExpand(undefined);
									}
								"
							>
								<Icon
									name="mingcute:search-2-fill"
									class="text-xl text-neutral-400 transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								/>
								<span
									class="transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								>
									Pencarian
								</span>
							</button>
							<NuxtLink
								to="/"
								class="group inline-flex w-full cursor-pointer items-center justify-start gap-2 rounded-md bg-black px-3 py-3 text-start text-sm font-semibold text-white capitalize active:scale-95"
								:class="route.name === 'home' ? 'sidebar-active' : ''"
							>
								<Icon
									name="material-symbols:home-outline"
									class="text-xl transition-colors group-hover:text-[#fbeb8c]"
									:class="
										route.name === 'home'
											? 'text-[#fbeb8c]'
											: 'text-neutral-400'
									"
								/>
								<span
									class="transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								>
									Beranda
								</span>
							</NuxtLink>
							<SidebarGamesMenu
								:open="expandMenuType === 'games'"
								@click="handleMenuExpand('games')"
							/>
							<NuxtLink
								to="/account?q=loyalty&t=rewards"
								class="group inline-flex w-full cursor-pointer items-center justify-start gap-2 rounded-md bg-black px-3 py-3 text-start text-sm font-semibold text-white capitalize active:scale-95"
								:class="
									route.name === 'loyalty-rewards' ? 'sidebar-active' : ''
								"
							>
								<Icon
									name="solar:medal-ribbon-star-bold"
									class="text-xl transition-colors group-hover:text-[#fbeb8c]"
									:class="
										route.name === 'loyalty-rewards'
											? 'text-[#fbeb8c]'
											: 'text-neutral-400'
									"
								/>
								<span
									class="transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								>
									Hadiah Loyalitas
								</span>
							</NuxtLink>
							<SidebarKasirMenu
								v-if="user"
								:open="expandMenuType === 'kasir'"
								@click="handleMenuExpand('kasir')"
							/>
							<SidebarMessageMenu
								v-if="user"
								:open="expandMenuType === 'pesan'"
								@click="handleMenuExpand('pesan')"
							/>
							<SidebarProfileMenu
								v-if="user"
								:open="expandMenuType === 'profile'"
								@click="handleMenuExpand('profile')"
							/>
							<button
								class="group inline-flex w-full cursor-pointer items-center justify-start gap-2 rounded-md bg-black px-3 py-3 text-start text-sm font-semibold text-white capitalize active:scale-95"
								@click="modelValue = false"
							>
								<Icon
									name="ic:outline-exit-to-app"
									class="text-xl text-neutral-400 transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								/>
								<span
									class="transition-colors group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
								>
									Tutup
								</span>
							</button>
						</div>
					</ScrollArea>
				</div>
			</div>
		</TransitionSlide>
	</client-only>
</template>

<style scoped>
.level-bronze {
	background: -webkit-linear-gradient(#d18a6d, #744a3b);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.sidebar-active {
	background-image: linear-gradient(to right, #857b44 0%, #101010 100%);
}
</style>
