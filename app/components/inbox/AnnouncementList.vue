<script setup lang="ts">
import { cn } from "~/lib/utils";

interface Messages {
	id: number;
	title: string;
	description: string;
	date: string;
	type: "inbox" | "announcement";
	category: "transaction" | "promo" | "info" | "general";
}

const route = useRoute();
const queryTypeName = computed(() => route.query.t as string);
const announcementCategorySelected = ref("transaction");
const selectedMessage = ref<Messages[] | null>(null);
const date = new Date("24-Sep-2025 11:00");
const formattedDate = date.toLocaleString("id-ID", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});
const announcementItems: Messages[] = [
	{
		id: 1,
		title: "Diperlukan Verifikasi",
		description:
			"Bagi para player yang memiliki referral, wajib melakukan verifikasi ID terlebih dahulu agar komisi referral dapat ditarik. Silahkan kunjungi halaman Referral anda.",
		date: formattedDate,
		type: "announcement",
		category: "info",
	},
	{
		id: 2,
		title: "Diperlukan Verifikasi",
		description:
			"Bagi para player yang memiliki referral, wajib melakukan verifikasi ID terlebih dahulu agar komisi referral dapat ditarik. Silahkan kunjungi halaman Referral anda.",
		date: new Date(date.getTime() + 86400000).toLocaleString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}),
		type: "announcement",
		category: "info",
	},
	{
		id: 3,
		title: "Diperlukan Verifikasi",
		description:
			"Bagi para player yang memiliki referral, wajib melakukan verifikasi ID terlebih dahulu agar komisi referral dapat ditarik. Silahkan kunjungi halaman Referral anda.",
		date: new Date(date.getTime() + 86400000 * 2).toLocaleString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}),
		type: "announcement",
		category: "info",
	},
];

const announcementCategories = [
	"transaction",
	"promo",
	"info",
	"general",
] as const;
</script>

<template>
	<div class="w-full space-y-6 rounded-lg bg-neutral-950 p-2 lg:p-4">
		<div
			class="flex items-center border-b border-neutral-800 py-2 text-neutral-100"
		>
			Pengumuman
		</div>
		<div class="flex flex-wrap items-center gap-4">
			<button
				v-for="(menu, index) in announcementCategories"
				:key="index"
				:class="
					cn(
						'inline-flex cursor-pointer items-center rounded-md px-4 py-2 text-sm font-semibold capitalize transition-all duration-300 active:scale-95',
						announcementCategorySelected === menu
							? 'bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] text-neutral-100'
							: 'bg-gradient-to-br from-neutral-200 to-neutral-500 text-neutral-900',
					)
				"
				@click="
					() => {
						announcementCategorySelected = menu;
						selectedMessage = announcementItems.filter(
							(item) => item.category === menu,
						);
					}
				"
			>
				{{ menu }}
				<span class="ml-2 text-[11px]">
					({{
						announcementItems?.filter((item) => item.category === menu)
							.length || 0
					}})
				</span>
			</button>
		</div>
		<div v-if="selectedMessage?.length" class="w-full space-y-6">
			<template v-for="item in selectedMessage || []" :key="item.id">
				<div
					v-if="item.category === announcementCategorySelected"
					class="w-full space-y-2 rounded-lg border border-[#937e00] bg-[#252407] p-4"
				>
					<div class="flex w-full gap-3">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-md bg-sky-300 text-center text-neutral-100"
						>
							<Icon name="material-symbols:chat-info" class="h-6 w-6" />
						</div>

						<div class="w-full">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<div class="text-sm font-semibold text-neutral-100">
										{{ item.title }}
									</div>
									<span
										class="rounded-full bg-[#937e00] px-2 text-center text-[11px] text-neutral-100"
										>New</span
									>
									<span
										class="rounded-full bg-neutral-500 px-2 text-center text-[11px] text-white"
										>{{ item.category }}</span
									>
								</div>

								<div class="text-[11px] text-neutral-400">
									{{ item.date }}
								</div>
							</div>
							<div class="line-clamp-2 text-[11px] text-neutral-300">
								{{ item.description }}
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div
			v-else
			class="m-auto flex h-full min-h-[200px] w-full flex-col items-center justify-center"
		>
			<p class="text-sm text-neutral-300">Belum Ada Pesan</p>
		</div>
	</div>
</template>
