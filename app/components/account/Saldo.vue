<script setup lang="ts">
import { cn } from "~/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
	profile?: Profile | null;
}
const emits = defineEmits<{
	(event: "refresh"): Promise<void>;
}>();
const props = withDefaults(defineProps<Props>(), {
	profile: null,
});

const open = ref(false);
const isRefreshing = ref(false);

async function refresh() {
	if (isRefreshing.value) return; // Prevent multiple clicks

	isRefreshing.value = true;

	try {
		await emits("refresh");
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
	<div class="flex items-center justify-center gap-1">
		<!-- Refresh Button dengan Animasi -->
		<button
			class="flex cursor-pointer items-center justify-center text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
			:disabled="isRefreshing"
			@click="refresh"
		>
			<icon
				name="material-symbols:sync"
				:class="
					cn(
						'text-2xl font-bold transition-all duration-300',
						isRefreshing ? 'animate-spin text-yellow-400' : 'text-white',
					)
				"
			/>
		</button>

		<!-- Balance Dropdown -->
		<DropdownMenu v-model:open="open" @update:open="(e) => (open = e)">
			<DropdownMenuTrigger as-child>
				<button
					class="flex cursor-pointer items-center justify-center text-white transition-all active:scale-95"
				>
					<div class="text-xs font-bold text-gray-100">
						{{ formatBalanceWithCurrency(profile?.balance) }}
					</div>
					<icon
						name="material-symbols:arrow-drop-down-rounded"
						:class="
							cn(
								'text-xl font-bold transition-transform duration-200',
								open ? 'rotate-180' : 'rotate-0',
							)
						"
					/>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				class="w-64 border-2 border-solid border-yellow-400 bg-gray-950 px-4 py-2 text-gray-100"
			>
				<DropdownMenuLabel as-child>
					<div class="flex items-center justify-between">
						<div class="text-lg font-semibold text-yellow-400">
							SALDO KREDIT
						</div>
						<div class="text-base font-semibold text-yellow-400">
							{{ formatBalanceWithCurrency(profile?.balance) }}
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator class="bg-yellow-400" />
				<ScrollArea class="h-92 w-full rounded-md py-2">
					<div
						v-for="(item, i) in DataBalanceVendor"
						:key="i"
						class="mb-4 grid gap-1 last:mb-0"
					>
						<div
							class="border-b border-yellow-400/30 pb-1 text-[13px] font-semibold text-yellow-400 uppercase"
						>
							{{ item.category }}
						</div>
						<div
							v-for="(vendor, vi) in item.vendors"
							:key="vi"
							class="flex w-full items-center justify-between rounded px-2 py-1 text-[11px] font-semibold text-gray-100 transition-colors hover:bg-yellow-400/10"
						>
							<div class="flex items-center gap-2">
								<div class="h-2 w-2 rounded-full bg-green-500"></div>
								{{ vendor.name }}
							</div>
							<div class="text-green-400">
								{{ formatBalanceShort(vendor.balance) }}
							</div>
						</div>
					</div>
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>
