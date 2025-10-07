export default defineNuxtPlugin((nuxtApp) => {
	// const { isHydrated, hydrate, ensureHydrated, loadComments } = useCommentStore();
	nuxtApp.hook("app:mounted", () => {
		// hydrate();
		// if (!isHydrated) {
		// 	ensureHydrated();
		// 	loadComments();
		// }
		// window.addEventListener("resize", checkMobile);
		// window.addEventListener("keydown", handleKeydown);
		// console.log("useSidebarState", isHydrated.value);
	});
	// nuxtApp.hook("app:beforeMount", () => {
	// 	window.removeEventListener("resize", checkMobile);
	// 	window.removeEventListener("keydown", handleKeydown);
	// });
});
