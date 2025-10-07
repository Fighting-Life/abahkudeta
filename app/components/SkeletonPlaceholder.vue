<script lang="ts" setup>
const progress = ref(0);
</script>

<template>
	<div class="flex min-h-screen w-full flex-col items-center justify-center">
		<div class="mx-auto">
			<div class="loader"></div>
		</div>
	</div>
</template>
<style scoped>
.loader {
	height: 8px;
	width: 130px;
	--c: no-repeat linear-gradient(#6100ee 0 0);
	background: var(--c), var(--c), #d7b8fc;
	background-size: 60% 100%;
	animation: l16 3s infinite;
}
@keyframes l16 {
	0% {
		background-position:
			-150% 0,
			-150% 0;
	}
	66% {
		background-position:
			250% 0,
			-150% 0;
	}
	100% {
		background-position:
			250% 0,
			250% 0;
	}
}
</style>
