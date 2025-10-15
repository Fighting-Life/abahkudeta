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
	<div class="sticky top-[60px] w-64 flex-shrink-0 self-start">
		<div class="overflow-hidden rounded-lg bg-neutral-900">
			<div
				class="flex items-center justify-center border-b border-yellow-400 py-7"
			>
				<h2 class="text-lg font-semibold text-white">Informasi Akun</h2>
			</div>
			<nav class="py-2">
				<NuxtLink
					v-for="(item, index) in menuItems"
					:key="index"
					:to="item.path_url"
					class="flex items-center gap-3 px-6 py-3 text-neutral-300 transition-colors hover:bg-[#2a2a2a]"
					:class="{
						'bg-gradient-to-r from-[#857b44] to-[#1c1511] text-white hover:from-[#857b44] hover:to-[#1c1511]':
							queryQName === item.main_query,
					}"
					@click="handleMenuClick(item)"
				>
					<img :src="item.icon" :alt="item.name" class="h-5 w-5" />
					<span class="text-sm">{{ item.name }}</span>
					<span
						v-if="item.name === 'Kotak Masuk'"
						class="ml-auto rounded-full bg-neutral-700 px-2 py-0.5 text-xs"
					>
						(0)
					</span>
					<span
						v-if="item.name === 'Pengumuman'"
						class="ml-auto rounded-full bg-neutral-700 px-2 py-0.5 text-xs"
					>
						(1)
					</span>
				</NuxtLink>
			</nav>
		</div>
	</div>
</template>

<style scoped lang="css">
@reference "tailwindcss";
</style>
