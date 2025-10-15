<script setup lang="ts">
const { $listen } = useNuxtApp();

const showAlertLogin = ref(false);
const showAlertDeposit = ref(false);

$listen("alert-login", (val) => {
	showAlertLogin.value = val;
});
$listen("alert-deposit", (val) => {
	showAlertDeposit.value = val;
});
</script>
<template>
	<div class="relative min-h-screen w-full bg-neutral-950 text-neutral-50">
		<NavBar />
		<NuxtPage />
		<footer-app />
		<fab-scroll-to-top
			:show-after="500"
			:scroll-duration="1000"
			position="right"
			bottom="5rem"
			background-color="#FFA500"
			hover-background-color="#FF8C00"
			icon-color="#ffffff"
		/>
		<fab-contact-menu position="left" bottom="5rem" />
		<NavBottomMenu />
		<AlertLogin :open="showAlertLogin" @update:open="showAlertLogin = false" />
		<AlertDeposit
			:open="showAlertDeposit"
			@update:open="showAlertDeposit = false"
		/>
		<AutoLogoutWarning />
	</div>
</template>
