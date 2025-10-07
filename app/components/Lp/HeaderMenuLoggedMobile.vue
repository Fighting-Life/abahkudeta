<script setup lang="ts">
import { cn } from "~/lib/utils";

const emits = defineEmits<{
	(e: "opensidebar", value: boolean): void;
}>();

const route = useRoute();
const router = useRouter();
const { profileBase, refreshProfile } = useProfiles();
const open = ref(false);
const isRefreshing = ref(false);

const isHiddenRoute = computed(() => {
	const hiddenRoutes = ["/loyalty/rewards", "/loyalty/benefits"];
	return hiddenRoutes.includes(route.path);
});

async function refresh() {
	if (isRefreshing.value) return;
	isRefreshing.value = true;

	try {
		await refreshProfile();
	} catch (error) {
		console.error("Refresh failed:", error);
	} finally {
		setTimeout(() => {
			isRefreshing.value = false;
		}, 500);
	}
}
</script>

<template>
	<div class="block w-full lg:hidden">
		<!-- Top Bar: Logo & Actions -->
		<div
			class="flex w-full items-center justify-between px-3 pt-1 pb-3 sm:px-4"
		>
			<!-- Back Button / Logo -->
			<button
				v-if="isHiddenRoute"
				class="flex cursor-pointer items-center justify-center p-2 active:scale-95"
				@click="router.back()"
			>
				<Icon
					name="ic:round-arrow-back"
					class="text-2xl font-bold text-white sm:text-3xl"
				/>
			</button>
			<NuxtLink v-else to="/" class="flex items-center justify-center">
				<NuxtImg
					src="/images/logo.png"
					alt="logo"
					class="h-7 w-auto object-fill sm:h-7"
				/>
			</NuxtLink>

			<!-- Actions: Notification & Menu -->
			<div class="flex items-center justify-center gap-3 sm:gap-5">
				<div class="relative">
					<NuxtLink
						to="/messages/announcement"
						class="flex cursor-pointer items-center justify-center p-2 text-white transition-all active:scale-95"
					>
						<Icon
							name="ic:baseline-notifications"
							class="text-xl font-bold sm:text-2xl"
						/>
					</NuxtLink>
					<div
						class="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-[9px] text-white sm:h-4 sm:w-4 sm:text-[10px]"
					>
						1
					</div>
				</div>
				<button
					class="flex cursor-pointer items-center justify-center p-2 text-white transition-all active:scale-95"
					@click="emits('opensidebar', true)"
				>
					<Icon name="ic:sharp-menu" class="text-xl font-bold sm:text-2xl" />
				</button>
			</div>
		</div>

		<!-- Balance Bar -->
		<div
			v-if="!isHiddenRoute"
			class="flex w-full items-center justify-between bg-gray-800 px-3 py-2 sm:px-4"
		>
			<!-- Username -->
			<div
				class="line-clamp-1 max-w-[40%] text-xs font-bold text-white uppercase sm:max-w-[50%] sm:text-sm"
			>
				{{ profileBase?.username }}
			</div>

			<!-- Balance & Refresh -->
			<div class="flex items-center justify-center gap-2 sm:gap-4">
				<!-- Balance Dropdown -->
				<DropdownMenu v-model:open="open" @update:open="(e) => (open = e)">
					<DropdownMenuTrigger as-child>
						<button
							class="flex max-w-[140px] min-w-[100px] cursor-pointer items-center justify-between rounded-sm bg-gray-950 px-2 py-1.5 text-white transition-all active:scale-95 sm:max-w-[160px] sm:min-w-[120px] sm:px-3"
						>
							<div
								class="truncate text-[11px] font-bold text-gray-100 sm:text-xs"
							>
								{{ formatBalanceWithCurrency(profileBase?.balance) }}
							</div>
							<Icon
								name="material-symbols:arrow-drop-down-rounded"
								:class="
									cn(
										'text-lg font-bold transition-transform duration-200 sm:text-xl',
										open ? 'rotate-180' : 'rotate-0',
									)
								"
							/>
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						class="w-[280px] border-2 border-solid border-yellow-400 bg-gray-950 px-4 py-2 text-gray-100 sm:w-64"
					>
						<DropdownMenuLabel as-child>
							<div class="flex items-center justify-between">
								<div class="text-base font-semibold text-yellow-400 sm:text-lg">
									SALDO KREDIT
								</div>
								<div class="text-sm font-semibold text-yellow-400 sm:text-base">
									{{ formatBalanceWithCurrency(profileBase?.balance) }}
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator class="bg-yellow-400" />
						<ScrollArea class="h-72 w-full rounded-md py-2 sm:h-92">
							<div
								v-for="(item, i) in DataBalanceVendor"
								:key="i"
								class="mb-4 grid gap-1 last:mb-0"
							>
								<div
									class="border-b border-yellow-400/30 pb-1 text-xs font-semibold text-yellow-400 uppercase sm:text-[13px]"
								>
									{{ item.category }}
								</div>
								<div
									v-for="(vendor, vi) in item.vendors"
									:key="vi"
									class="flex w-full items-center justify-between rounded px-2 py-1 text-[10px] font-semibold text-gray-100 transition-colors hover:bg-yellow-400/10 sm:text-[11px]"
								>
									<div class="flex items-center gap-2">
										<div
											class="h-1.5 w-1.5 rounded-full bg-green-500 sm:h-2 sm:w-2"
										></div>
										<span class="truncate">{{ vendor.name }}</span>
									</div>
									<div class="text-green-400">
										{{ formatBalanceShort(vendor.balance) }}
									</div>
								</div>
							</div>
						</ScrollArea>
					</DropdownMenuContent>
				</DropdownMenu>

				<!-- Refresh Button -->
				<button
					class="flex cursor-pointer items-center justify-center p-2 text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
					:disabled="isRefreshing"
					@click="refresh"
				>
					<Icon
						name="material-symbols:sync"
						:class="
							cn(
								'text-xl font-bold transition-all duration-300 sm:text-2xl',
								isRefreshing ? 'animate-spin text-yellow-400' : 'text-white',
							)
						"
					/>
				</button>
			</div>
		</div>

		<!-- Loyalty & Points Bar -->
		<div
			v-if="!isHiddenRoute"
			class="grid w-full grid-cols-12 divide-x divide-gray-700 px-2 py-2 sm:px-3"
		>
			<!-- EXP Section -->
			<NuxtLink
				to="/loyalty/benefits"
				class="col-span-5 flex cursor-pointer flex-col gap-1 pr-2 text-[10px] font-bold text-white transition-all hover:text-yellow-400 active:scale-95 sm:text-xs"
			>
				<div class="flex items-center justify-start gap-1.5 sm:gap-2">
					<img
						src="/images/badge/bronze.svg"
						class="h-5 w-5 object-fill sm:h-6 sm:w-6"
					/>
					<div>BRONZE</div>
				</div>
				<div class="flex w-full items-center justify-between gap-1 sm:gap-2">
					<div
						class="flex w-[20%] items-center justify-center rounded-md border border-gray-100 py-0.5 text-center text-[9px] sm:text-[11px]"
					>
						EXP
					</div>
					<div
						class="flex w-[60%] items-center justify-end truncate rounded-lg bg-gray-700 py-0.5 pr-1 text-right text-[9px] sm:pr-2 sm:text-[11px]"
					>
						BRONZE
					</div>
					<div class="flex w-[20%] items-center justify-center">
						<Icon
							name="material-symbols:arrow-right-rounded"
							class="text-base sm:text-lg"
						/>
					</div>
				</div>
			</NuxtLink>

			<!-- Loyalty Point Section -->
			<NuxtLink
				to="/loyalty/rewards"
				class="col-span-5 flex cursor-pointer flex-col gap-1 px-2 text-[10px] font-bold text-white transition-all hover:text-yellow-400 active:scale-95 sm:text-xs"
			>
				<div class="flex items-center justify-start gap-1.5 sm:gap-2">
					<img
						src="/images/badge/loyalty-point-icon.svg"
						class="h-3.5 w-3.5 object-fill sm:h-4 sm:w-4"
					/>
					<div>LOYALTY POINT</div>
				</div>
				<div class="flex w-full items-center justify-between gap-1 sm:gap-2">
					<div
						class="flex w-[20%] items-center justify-center rounded-md bg-amber-500 py-0.5 text-center text-[9px] sm:text-[11px]"
					>
						LP
					</div>
					<div
						class="flex w-[60%] items-center justify-start truncate rounded-lg bg-gray-700 py-0.5 pl-1 text-start text-[9px] sm:pl-2 sm:text-[11px]"
					>
						0
					</div>
					<div class="flex w-[20%] items-center justify-center">
						<Icon
							name="material-symbols:arrow-right-rounded"
							class="text-base sm:text-lg"
						/>
					</div>
				</div>
			</NuxtLink>

			<!-- Reward Section -->
			<div
				class="col-span-2 flex cursor-pointer items-center justify-center pl-2 text-[10px] font-bold text-white transition-all hover:text-yellow-400 active:scale-95 sm:text-xs"
			>
				<RewardDialog />
			</div>
		</div>
	</div>
</template>
