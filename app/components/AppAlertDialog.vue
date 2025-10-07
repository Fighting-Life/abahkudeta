<script setup lang="ts">
import { cn } from "~/lib/utils";

interface Props {
	open?: boolean;
	type?: "success" | "error" | "warning" | "info";
	title?: string;
	message?: string;
	enableAction?: boolean;
	labelAction?: string;
	labelClose?: string;
}
const emit = defineEmits(["onclose", "onaction"]);
const props = withDefaults(defineProps<Props>(), {
	open: false,
	type: "info",
	title: "Modal Title",
	message: "Modal Message",
	enableAction: false,
	labelAction: "OK",
	labelClose: "CLOSE",
});
const openDialog = computed({
	get: () => props.open,
	set: (val: boolean) => {
		if (!val) {
			onclose();
		}
	},
});
function onclose() {
	emit("onclose");
}
function onaction() {
	emit("onaction");
}
</script>
<template>
	<AlertDialog v-model="openDialog">
		<AlertDialogContent
			class="mx-auto flex w-[448px] flex-col items-center justify-center gap-10 bg-gray-100 py-12 dark:bg-gray-800"
			@close-auto-focus="
				(e) => {
					e.preventDefault();
					onclose();
				}
			"
			@open-auto-focus="(e) => e.preventDefault()"
		>
			<AlertDialogHeader>
				<AlertDialogTitle class="flex w-full flex-col items-center">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full p-[1px]"
					>
						<Icon
							v-if="type === 'warning'"
							name="fluent-color:warning-48"
							class="h-full w-full"
						/>
						<Icon
							v-else-if="type === 'info'"
							name="flat-color-icons:info"
							class="h-full w-full"
						/>
						<Icon
							v-else-if="type === 'error'"
							name="fluent-color:dismiss-circle-48"
							class="h-full w-full"
						/>
						<Icon
							v-else-if="type === 'success'"
							name="fluent-color:checkmark-circle-48"
							class="h-full w-full"
						/>
						<Icon v-else name="flat-color-icons:info" class="h-full w-full" />
					</div>
				</AlertDialogTitle>
				<AlertDialogDescription>
					<div class="flex w-full flex-col items-center">
						<div
							:class="
								cn(
									'text-center text-xl font-bold',
									type === 'warning'
										? 'text-yellow-500'
										: type === 'info'
											? 'text-blue-600'
											: type === 'error'
												? 'text-red-600'
												: type === 'success'
													? 'text-green-600'
													: 'text-blue-600',
								)
							"
						>
							{{ title }}
						</div>
						<div
							class="line-clamp-3 max-w-[320px] text-center text-sm text-gray-600 dark:text-gray-200"
						>
							{{ message }}
						</div>
					</div>
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter class="max-w-[448px]">
				<div class="flex max-w-[448px] items-center justify-center gap-2">
					<AlertDialogCancel class="w-full" @click="onclose">
						{{ labelClose }}
					</AlertDialogCancel>
					<AlertDialogCancel
						v-if="enableAction"
						class="w-full"
						@click="onaction"
					>
						{{ labelAction }}
					</AlertDialogCancel>
				</div>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
<style scoped></style>
