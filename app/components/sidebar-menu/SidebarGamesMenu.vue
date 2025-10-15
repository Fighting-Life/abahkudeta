<script setup lang="ts">
import { TransitionExpand } from "@morev/vue-transitions";
import { cn } from "~/lib/utils";

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();
const props = defineProps<{
	open: boolean;
}>();
const isOpen = useVModel(props, "open", emits, {
	passive: true,
});
</script>

<template>
	<div>
		<button
			class="group inline-flex w-full cursor-pointer items-center justify-between rounded-md bg-black px-2 py-3 text-sm font-semibold text-white capitalize active:scale-95"
			@click="isOpen = !isOpen"
		>
			<div class="flex items-center justify-start gap-2 text-start">
				<img
					:src="
						isOpen
							? '/images/menus/games-active.svg'
							: '/images/menus/games.svg'
					"
					:class="
						cn(
							'h-5 w-auto object-center group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]',
							isOpen ? 'text-[#fbeb8c]' : '',
						)
					"
				/>
				<span
					:class="
						cn(
							'group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]',
							isOpen ? 'text-[#fbeb8c]' : '',
						)
					"
				>
					Permainan
				</span>
			</div>
			<div class="flex items-center justify-end gap-2 text-end">
				<icon
					name="bx:bxs-chevron-right"
					:class="
						cn(
							'text-xl',
							isOpen ? 'rotate-90 text-[#fbeb8c]' : 'text-neutral-100',
						)
					"
				/>
			</div>
		</button>
		<client-only>
			<transition-expand :duration="300">
				<ul
					v-if="isOpen"
					class="max-h-[60vh] list-none space-y-2 overflow-hidden overflow-y-auto"
				>
					<li
						v-for="(menu, i) in CategoriesTopMenu"
						:key="i"
						class="rounded-md bg-black py-3 ps-9"
					>
						<NuxtLink
							:to="`/${menu.slug}`"
							class="group inline-flex w-full cursor-pointer items-center justify-start gap-2 text-start text-sm font-semibold text-white capitalize active:scale-95"
						>
							<span
								class="group-hover:text-[#fbeb8c] group-active:text-[#fbeb8c]"
							>
								{{ menu.name }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</transition-expand>
		</client-only>
	</div>
</template>
