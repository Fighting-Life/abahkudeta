<script setup lang="ts">
import { cn } from "~/lib/utils";

const activeTab = ref("regular-promotion");
const selectedCategory = ref(1);
const selectedMobileFilter = ref("all-promotion");

const filterPromotion = [
	{ name: "Semua Promosi", value: "regular-promotion" },
	{ name: "Semua Event Provider", value: "provider-event" },
];

const filteredCategories = computed(() => {
	return promotionCategoryItem.filter((cat) => cat.type === activeTab.value);
});
const filteredPromotions = computed(() => {
	if (selectedCategory.value === 1 || selectedCategory.value === 6) {
		return promotionContentItem.filter((promo) => {
			const category = promotionCategoryItem.find(
				(c) => c.id === promo.category_id,
			);
			return category?.type === activeTab.value;
		});
	}
	return promotionContentItem.filter(
		(promo) => promo.category_id === selectedCategory.value,
	);
});

const handleTabChange = (type: string) => {
	activeTab.value = type;
	// Set kategori pertama dari tab yang dipilih
	const firstCategory = filteredCategories.value[0];
	if (firstCategory) {
		selectedCategory.value = firstCategory.id;
	}
};
const handleCategoryChange = (categoryId: number) => {
	selectedCategory.value = categoryId;
};
const getLabelColor = (label: string) => {
	const colors: Record<string, string> = {
		Special: "bg-gradient-to-r from-yellow-400 to-yellow-600",
		"New Member": "bg-gradient-to-r from-green-400 to-green-600",
		Event: "bg-gradient-to-r from-yellow-400 to-yellow-600",
		Poker: "bg-gradient-to-r from-purple-400 to-purple-600",
	};
	return colors[label] || "bg-gradient-to-r from-yellow-400 to-yellow-600";
};
</script>
<template>
	<div class="w-full space-y-4 py-6">
		<!-- Tabs - Desktop -->
		<div class="container mx-auto hidden gap-4 px-4 lg:grid lg:grid-cols-2">
			<button
				v-for="filter in filterPromotion"
				:key="filter.value"
				:class="
					cn(
						'cursor-pointer rounded-lg px-6 py-3 text-sm font-bold uppercase transition-all duration-300',
						activeTab === filter.value
							? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-neutral-900'
							: 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600',
					)
				"
				@click="handleTabChange(filter.value)"
			>
				{{ filter.name }}
			</button>
		</div>

		<!-- Select - Mobile -->
		<div class="container mx-auto px-4 lg:hidden">
			<select
				v-model="selectedMobileFilter"
				class="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-yellow-400 focus:outline-none"
				@change="(e) => handleTabChange((e.target as HTMLSelectElement).value)"
			>
				<option value="all-promotion">Semua Promosi</option>
				<option
					v-for="category in promotionCategoryItem"
					:key="category.id"
					:value="category.slug"
				>
					{{ category.name }}
				</option>
			</select>
		</div>

		<!-- Category Badges - Desktop -->
		<div
			class="scrollbar-hide container mx-auto hidden gap-3 overflow-x-auto px-4 pb-2 lg:flex"
		>
			<button
				v-for="category in filteredCategories"
				:key="category.id"
				:class="
					cn(
						'cursor-pointer rounded-full px-6 py-2 text-xs font-bold whitespace-nowrap uppercase transition-all duration-300',
						selectedCategory === category.id
							? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-neutral-900'
							: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700',
					)
				"
				@click="handleCategoryChange(category.id)"
			>
				{{ category.name }}
			</button>
		</div>

		<!-- Promotion Grid -->
		<div class="container mx-auto px-4">
			<div
				class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
			>
				<div
					v-for="promo in filteredPromotions"
					:key="promo.id"
					class="group relative overflow-hidden rounded-lg bg-sky-950 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20"
				>
					<!-- Image Container -->
					<div class="relative aspect-[16/6] overflow-hidden">
						<!-- Label Badge (Top Left) -->
						<div class="absolute top-0 left-0 z-10">
							<div class="relative">
								<!-- Pentagon Shape -->
								<div
									:class="
										cn(
											'px-4 py-1.5 text-xs font-bold text-white uppercase',
											getLabelColor(promo.label),
										)
									"
									style="clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%)"
								>
									{{ promo.label }}
								</div>
							</div>
						</div>

						<!-- Promotion Image -->
						<img
							:src="promo.image"
							:alt="promo.name"
							class="h-full w-auto object-fill transition-transform duration-500 group-hover:scale-110"
						/>

						<!-- Hover Overlay with Buttons -->
						<div
							class="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<NuxtLink
								v-if="promo.claim_url"
								:to="promo.claim_url"
								class="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2.5 text-sm font-bold text-neutral-900 uppercase shadow-lg transition-all duration-300 hover:from-yellow-500 hover:to-yellow-700 hover:shadow-yellow-500/50 active:scale-95"
							>
								Ambil Promo
							</NuxtLink>
							<NuxtLink
								:to="promo.detail_url"
								class="rounded-lg border-2 border-white bg-white/10 px-6 py-2.5 text-sm font-bold text-white uppercase backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-neutral-900 active:scale-95"
							>
								Detail
							</NuxtLink>
						</div>
					</div>

					<!-- Content -->
					<div class="space-y-2 px-4 py-2">
						<!-- Title with Arrow Shape Background -->
						<div class="relative">
							<div class="flex items-center gap-2">
								<div class="relative flex-1">
									<div
										class="line-clamp-2 pr-8 text-sm font-bold text-white uppercase"
									>
										{{ promo.name }}
									</div>
								</div>
							</div>
						</div>

						<!-- End Date -->
						<div class="flex items-center gap-2 text-xs text-neutral-400">
							<Icon name="mdi:clock-outline" class="text-yellow-400" />
							<span>Tanggal akhir: {{ promo.end_date ?? "-" }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Empty State -->
			<div
				v-if="filteredPromotions.length === 0"
				class="flex flex-col items-center justify-center py-16 text-center"
			>
				<Icon name="mdi:gift-outline" class="mb-4 text-6xl text-neutral-600" />
				<p class="text-lg text-neutral-400">Tidak ada promosi tersedia</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Hide scrollbar for category badges */
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* Smooth animations */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.group:hover {
	animation: fadeIn 0.3s ease-out;
}
</style>
