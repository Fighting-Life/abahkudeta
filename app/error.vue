<script lang="ts" setup>
const error = useError();

defineProps({
	errors: Object,
});

useSeoMeta({
	title: error.value?.statusCode,
	description: error.value?.statusMessage,
	robots: "noindex,nofollow",
});
</script>

<template>
	<Error404Page
		:error-code="error?.statusCode || 404"
		error-title="Oops!"
		error-message="We couldn't process your request."
		home-url="/"
		logo-url="/images/error/logo.png"
	/>
	<div></div>
</template>
