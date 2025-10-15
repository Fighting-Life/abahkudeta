<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
	menuItems: AccountTabMenu[];
	activeMenu?: string;
}>();

const emit = defineEmits<{
	(e: "menu-click", item: AccountTabMenu): void;
}>();

const route = useRoute();
const queryTName = computed(() => route.query.t as string);
</script>

<template>
	<div class="mb-6 border-b border-neutral-800">
		<div class="flex gap-6 overflow-x-auto">
			<nuxt-link
				v-for="(item, index) in menuItems"
				:key="index"
				:to="item.path_url"
				:class="
					cn(
						'cursor-pointer border-b-2 pb-3 font-semibold whitespace-nowrap text-white',
						{
							'border-yellow-500': item.sub_query === queryTName,
						},
					)
				"
				@click="emit('menu-click', item)"
			>
				{{ item.name }}
			</nuxt-link>
		</div>
	</div>
</template>
