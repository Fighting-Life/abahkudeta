<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const props = defineProps<{
	open: boolean;
}>();

const { login } = useAuth();
const toast = useToast();

const passwordInput = ref<"password" | "text">("password");
const modelValue = useVModel(props, "open", emits, {
	passive: true,
});

const { handleSubmit, errors, isSubmitting, resetForm, validateField } =
	useForm({
		validationSchema: loginSchema,
	});

const { value: identifier } = useField<string>("identifier");
const { value: password } = useField<string>("password");

// Helper to detect if input is email
const isEmailFormat = computed(() => {
	return (
		identifier.value?.includes("@") &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.value)
	);
});

const submit = handleSubmit(async (values) => {
	try {
		await login(values.identifier, values.password);

		// toast.success("Login berhasil! Selamat datang kembali.");

		resetForm();
		modelValue.value = false;

		await navigateTo("/");
	} catch (error: any) {
		console.error("Login error:", error);

		let errorMessage =
			"Login gagal. Periksa kembali email/username dan password Anda.";

		if (error.message?.includes("Invalid login credentials")) {
			errorMessage = "Email/Username atau password salah!";
		} else if (error.message?.includes("Email not confirmed")) {
			errorMessage = "Email belum diverifikasi. Silakan cek inbox Anda.";
		} else if (error.message?.includes("tidak ditemukan")) {
			errorMessage = error.message;
		} else if (error.message) {
			errorMessage = error.message;
		}

		toast.error(errorMessage);
	}
});
</script>

<template>
	<HeadlessTransitionRoot appear :show="modelValue" as="template">
		<HeadlessDialog
			as="div"
			class="relative z-[9999]"
			@close="() => (modelValue = false)"
		>
			<HeadlessTransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/25" />
			</HeadlessTransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center px-4 text-center"
				>
					<HeadlessTransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<HeadlessDialogPanel
							class="w-full transform overflow-hidden rounded-2xl bg-gray-900 px-5 py-6 text-left align-middle text-gray-50 shadow-xl transition-all lg:max-w-lg"
						>
							<div class="relative w-full">
								<div class="absolute top-0 right-0 z-40">
									<button
										class="inline-flex cursor-pointer items-center justify-center bg-transparent text-white active:scale-95"
										@click="() => (modelValue = false)"
									>
										<icon name="ph:x-bold" class="text-xl font-bold" />
									</button>
								</div>

								<div class="flex h-full w-full flex-col gap-5">
									<div
										class="flex w-full items-center justify-center font-semibold"
									>
										<div class="text-white uppercase">MASUK</div>
									</div>

									<Separator class="bg-gray-600" />

									<form class="grid" @submit.prevent="submit">
										<!-- Email or Username Field -->
										<div class="grid gap-2 pb-4">
											<Label for="identifier">Email atau Username</Label>
											<div class="relative">
												<input
													v-model="identifier"
													type="text"
													name="identifier"
													class="block w-full rounded-md border border-gray-600 bg-black text-gray-50 ring-0 outline-none placeholder:text-sm placeholder:text-gray-400 hover:border-2 hover:border-yellow-400/40 focus:border-2 focus:border-yellow-400/40 active:border-2 active:border-yellow-400/40"
													autocomplete="username"
													placeholder="Email atau Username"
													@blur="validateField('identifier')"
												/>
												<!-- Indicator badge -->
												<div
													v-if="identifier"
													class="absolute top-1/2 right-3 -translate-y-1/2"
												>
													<span
														:class="
															cn(
																'rounded-full px-2 py-0.5 text-xs',
																isEmailFormat
																	? 'bg-yellow-400/10 text-yellow-400'
																	: 'bg-blue-400/10 text-blue-400',
															)
														"
													>
														{{ isEmailFormat ? "Email" : "Username" }}
													</span>
												</div>
											</div>
											<div class="h-5">
												<Transition name="fade-slide-down">
													<div
														v-if="errors.identifier"
														class="mt-1 text-xs text-red-400"
													>
														{{ errors.identifier }}
													</div>
												</Transition>
											</div>
										</div>

										<!-- Password Field -->
										<div class="grid w-full">
											<div class="relative grid gap-2">
												<Label for="password">Kata Sandi</Label>
												<input
													v-model="password"
													:type="passwordInput"
													name="password"
													class="block w-full rounded-md border border-gray-600 bg-black text-gray-50 ring-0 outline-none placeholder:text-sm placeholder:text-gray-400 hover:border-2 hover:border-yellow-400/40 focus:border-2 focus:border-yellow-400/40 active:border-2 active:border-yellow-400/40"
													autocomplete="current-password"
													placeholder="Kata Sandi"
													@blur="validateField('password')"
												/>
												<button
													type="button"
													class="absolute top-8 right-3 inline-flex cursor-pointer items-center justify-center text-yellow-400 hover:text-yellow-300 active:scale-95"
													@click="
														passwordInput =
															passwordInput === 'password' ? 'text' : 'password'
													"
												>
													<Icon
														:name="
															passwordInput === 'password'
																? 'iconamoon:eye-bold'
																: 'iconamoon:eye-off-bold'
														"
														class="text-2xl"
													/>
												</button>
											</div>
											<div class="h-5">
												<Transition name="fade-slide-down">
													<div
														v-if="errors.password"
														class="mt-1 text-xs text-red-400"
													>
														{{ errors.password }}
													</div>
												</Transition>
											</div>
										</div>

										<!-- Forgot Password Link -->
										<div class="flex items-center justify-end pt-2">
											<NuxtLink
												to="/forgot"
												class="cursor-pointer text-sm font-semibold text-gray-100 transition-colors hover:text-yellow-400"
											>
												Lupa Kata Sandi?
											</NuxtLink>
										</div>

										<!-- Submit Button -->
										<div
											class="flex w-full flex-col items-center justify-center gap-3 px-3 pt-4 lg:px-8"
										>
											<button
												type="submit"
												:class="
													cn(
														'inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 py-3 font-semibold text-white shadow-xl transition-all hover:from-yellow-500 hover:to-yellow-700 active:scale-95',
														isSubmitting
															? 'cursor-not-allowed opacity-70'
															: 'cursor-pointer',
													)
												"
												:disabled="isSubmitting"
											>
												<LoaderCircleIcon
													v-if="isSubmitting"
													class="animate-spin"
												/>
												{{ isSubmitting ? "Harap tunggu..." : "MASUK" }}
											</button>

											<div class="text-sm text-gray-400">
												Belum punya akun?
												<NuxtLink
													to="/register"
													class="font-semibold text-yellow-400 transition-colors hover:text-yellow-300 hover:underline"
													@click="modelValue = false"
												>
													Daftar Sekarang
												</NuxtLink>
											</div>
										</div>
									</form>
								</div>
							</div>
						</HeadlessDialogPanel>
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<style scoped>
/* Fade slide down animation for error messages */
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
	transition: all 0.2s ease;
}

.fade-slide-down-enter-from {
	opacity: 0;
	transform: translateY(-4px);
}

.fade-slide-down-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}

.fade-slide-down-enter-to,
.fade-slide-down-leave-from {
	opacity: 1;
	transform: translateY(0);
}
</style>
