import mitt from "mitt";

interface typeShow {
	value: boolean;
}
type ApplicationEvent = {
	"search:open": typeShow;
	"login:open": typeShow;
	"alert-login": boolean;
	"alert-deposit": boolean;
};

export default defineNuxtPlugin(() => {
	const emitter = mitt<ApplicationEvent>();

	return {
		provide: {
			event: emitter.emit,
			listen: emitter.on,
			off: emitter.off,
		},
	};
});
