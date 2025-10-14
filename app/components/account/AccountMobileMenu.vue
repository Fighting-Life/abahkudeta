<script setup lang="ts">
interface Props {
	menuItems: PageMenuAccount[];
	activeMenu?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: "menu-click", item: PageMenuAccount): void;
}>();

const route = useRoute();

const queryQName = computed(() => route.query.q as string);

const handleMenuClick = (item: PageMenuAccount) => {
	emit("menu-click", item);
};
</script>

<template>
	<div class="sticky top-[60px] z-10 bg-black px-4 pb-2">
		<div
			class="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
		>
			<NuxtLink
				v-for="(item, index) in menuItems"
				:key="index"
				:to="item.path_url"
				class="w-24 flex-shrink-0 snap-start"
				@click="handleMenuClick(item)"
			>
				<div
					class="flex h-24 flex-col items-center justify-center rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#333]"
					:class="{
						'bg-gradient-to-b from-[#857b44] to-[#1c1511] text-white hover:from-[#857b44] hover:to-[#1c1511]':
							queryQName === item.main_query,
					}"
				>
					<img :src="item.icon" :alt="item.name" class="mb-2 h-8 w-8" />
					<span class="text-center text-xs leading-tight text-white">{{
						item.name
					}}</span>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
}
</style>
