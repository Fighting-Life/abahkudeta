import { plugin as vueTransitionsPlugin } from "@morev/vue-transitions";
import "@morev/vue-transitions/styles";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(vueTransitionsPlugin);
});
