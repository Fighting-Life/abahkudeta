<script setup lang="ts">
import { LoaderCircleIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const { $profileState, $refreshProfile } = useNuxtApp();
const client = useSupabaseClient<Database>();
const { updateProfile } = useProfiles();
const toast = useToast();

const inputPassword = ref("password");
const inputConfirmPassword = ref("password");

const { handleSubmit, errors, isSubmitting, validateField } = useForm({
	validationSchema: changePasswordSchema,
});
const { value: password } = useField<string>("password");
const { value: confirmPassword } = useField<string>("confirm_password");

const submit = handleSubmit(async (values) => {
	try {
		const { error } = await client.auth.updateUser({
			password: values.password,
		});
		if (error) {
			throw new Error(error.message);
		}
		await $refreshProfile();
		toast.success("Profil berhasil diubah");
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Gagal mengubah profil";
		toast.error(errorMessage);
	}
});
</script>

<template>
	<div class="w-full space-y-4 bg-neutral-900 p-2 lg:p-4">
		<div class="flex items-center border-b border-neutral-700 py-3">
			<h2 class="text-lg font-bold">UBAH KATA SANDI</h2>
		</div>
		<div class="flex flex-col rounded-lg bg-neutral-700 p-2 lg:p-4">
			<h4 class="text-base font-medium text-yellow-400">Catatan:</h4>
			<ul class="ml-5 list-decimal text-sm text-neutral-200">
				<li>
					Kata sandi harus memiliki minimal 8 karakter dan maksimal 20 karakter.
				</li>
				<li>
					Kata sandi harus mengandung minimal 1 huruf besar, 1 huruf small, 1
					angka, dan 1 karakter khusus.
				</li>
				<li>Kata Sandi tidak boleh mengandung username.</li>
				<li>Kata Sandi tidak boleh mengandung simbol &amp;, &lt;, atau &gt;</li>
			</ul>
		</div>
		<form class="grid gap-5" @submit.prevent="submit">
			<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
				<label
					for="password"
					class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
				>
					<div class="text-xs text-neutral-200">Kata Sandi</div>
					<div class="text-xs text-yellow-400">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="grid w-full">
						<div class="relative min-h-[2rem]">
							<input
								v-model="password"
								:type="inputPassword"
								name="password"
								class="h-8 w-full rounded-md border border-neutral-600 bg-black pr-10 text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
								autocomplete="current-password"
								placeholder="Kata Sandi Anda"
								@blur="validateField('password')"
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center text-yellow-400 active:scale-95"
								@click="
									inputPassword =
										inputPassword === 'password' ? 'text' : 'password'
								"
							>
								<Icon
									:name="
										inputPassword === 'password'
											? 'mdi:eye-outline'
											: 'mdi:eye-off-outline'
									"
									class="text-xl"
								/>
							</button>
						</div>
						<div class="h-5">
							<Transition name="fade-slide-down">
								<div v-if="errors.password" class="mt-1 text-xs text-red-400">
									{{ errors.password }}
								</div>
							</Transition>
						</div>
					</div>
				</div>
			</div>
			<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
				<label
					for="confirm_password"
					class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
				>
					<div class="text-xs text-neutral-200">Ulangi Kata Sandi</div>
					<div class="text-xs text-yellow-400">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="grid w-full">
						<div class="relative min-h-[2rem]">
							<input
								v-model="confirmPassword"
								:type="inputConfirmPassword"
								name="confirm_password"
								class="h-8 w-full rounded-md border border-neutral-600 bg-black pr-10 text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
								autocomplete="current-password"
								placeholder="Ulangi Kata Sandi Anda"
								@blur="validateField('confirm_password')"
							/>
							<button
								type="button"
								class="absolute top-1/2 right-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center text-yellow-400 active:scale-95"
								@click="
									inputConfirmPassword =
										inputConfirmPassword === 'password' ? 'text' : 'password'
								"
							>
								<Icon
									:name="
										inputConfirmPassword === 'password'
											? 'mdi:eye-outline'
											: 'mdi:eye-off-outline'
									"
									class="text-xl"
								/>
							</button>
						</div>
						<div class="h-5">
							<Transition name="fade-slide-down">
								<div
									v-if="errors.confirm_password"
									class="mt-1 text-xs text-red-400"
								>
									{{ errors.confirm_password }}
								</div>
							</Transition>
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-center">
				<button
					type="submit"
					:class="
						cn(
							'inline-flex items-center justify-center gap-4 rounded-md bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] px-30 py-2 text-sm font-semibold text-white uppercase transition-colors hover:bg-yellow-500 active:scale-95 lg:px-52',
							isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
						)
					"
					:disabled="isSubmitting"
				>
					<LoaderCircleIcon v-if="isSubmitting" class="animate-spin" />
					{{ isSubmitting ? "Harap tunggu..." : "Ubah Kata Sandi" }}
				</button>
			</div>
		</form>
	</div>
</template>
