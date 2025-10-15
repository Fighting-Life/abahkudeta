<script lang="ts" setup>
import type { NuxtLinkProps } from "#app";

interface Props extends NuxtLinkProps {
	tabindex?: number | string;
	method?: "get" | "post" | "put" | "patch" | "delete";
	as?: string;
}

const props = defineProps<Props>();

const submitForm = (url: string, method: string) => {
	const form = document.createElement("form");
	form.method = method;
	form.action = url;
	document.body.appendChild(form);
	form.submit();
};
const handleClick = async (event: MouseEvent) => {
	if (props.method && props.method !== "get") {
		event.preventDefault();

		// Pilihan 1: Form submission (untuk navigasi)
		if (props.as === "button") {
			submitForm(props.href as string, props.method);
			return;
		}
	}
};
</script>

<template>
	<NuxtLink
		v-if="!method || method === 'get'"
		:to="props.href"
		class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:!decoration-current dark:decoration-neutral-500"
	>
		<slot />
	</NuxtLink>

	<a
		v-else
		:href="href as string"
		:tabindex="tabindex"
		class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:!decoration-current dark:decoration-neutral-500"
		@click="handleClick"
	>
		<slot />
	</a>
</template>
