<script setup lang="ts">
import { LoaderCircleIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const { $profileState, $refreshProfile } = useNuxtApp();
const { updateProfile } = useProfiles();
const toast = useToast();

const { handleSubmit, errors, isSubmitting, validateField } = useForm({
	validationSchema: changeProfileSchema,
	initialValues: {
		name: $profileState.value?.full_name || "",
		email: $profileState.value?.email || "",
		username: $profileState.value?.username || "",
	},
});

const { value: name } = useField<string>("name");
const { value: email } = useField<string>("email");
const { value: username } = useField<string>("username");

const submit = handleSubmit(async (values) => {
	try {
		await updateProfile($profileState.value?.id || "", {
			full_name: values.name,
			email: values.email,
			username: values.username,
		});
		await $refreshProfile();
		toast.success("Profil berhasil diubah");
	} catch (error) {
		toast.error(
			error instanceof Error ? error.message : "Gagal mengubah profil",
		);
	}
});
</script>
<template>
	<div class="w-full space-y-4 bg-neutral-900 p-2 lg:p-4">
		<div class="flex items-center border-b border-neutral-700 py-3">
			<h2 class="text-lg font-bold">UBAH PROFIL</h2>
		</div>
		<div class="flex items-center border-b border-neutral-700 py-3">
			<h4 class="text-base font-medium">Informasi Pribadi</h4>
		</div>
		<form class="grid gap-5" @submit.prevent="submit">
			<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
				<label
					for="name"
					class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
				>
					<div class="text-xs text-gray-200">Nama Lengkap</div>
					<div class="text-xs text-yellow-400">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="grid w-full">
						<!-- Input wrapper with fixed height for error -->
						<div class="min-h-[2rem]">
							<input
								v-model="name"
								type="text"
								name="name"
								class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
								autocomplete="name"
								placeholder="Nama Pengguna Anda"
								:disabled="isSubmitting"
								@blur="validateField('name')"
							/>
						</div>
						<!-- Error message container with fixed height -->
						<div class="h-5">
							<Transition name="fade-slide-down">
								<div v-if="errors.name" class="mt-1 text-xs text-red-400">
									{{ errors.name }}
								</div>
							</Transition>
						</div>
					</div>
				</div>
			</div>
			<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
				<label
					for="email"
					class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
				>
					<div class="text-xs text-gray-200">Email</div>
					<div class="text-xs text-yellow-400">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="grid w-full">
						<div class="min-h-[2rem]">
							<input
								v-model="email"
								type="email"
								name="email"
								class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
								autocomplete="email"
								placeholder="Email Anda"
								@blur="validateField('email')"
							/>
						</div>
						<div class="h-5">
							<Transition name="fade-slide-down">
								<div v-if="errors.email" class="mt-1 text-xs text-red-400">
									{{ errors.email }}
								</div>
							</Transition>
						</div>
					</div>
				</div>
			</div>
			<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
				<label
					for="username"
					class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
				>
					<div class="text-xs text-gray-200">Nama Pengguna</div>
					<div class="text-xs text-yellow-400">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="grid w-full">
						<div class="min-h-[2rem]">
							<input
								v-model="username"
								type="text"
								name="username"
								class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
								autocomplete="username"
								placeholder="Username Anda"
								@blur="validateField('username')"
							/>
						</div>
						<div class="h-5">
							<Transition name="fade-slide-down">
								<div v-if="errors.username" class="mt-1 text-xs text-red-400">
									{{ errors.username }}
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
					{{ isSubmitting ? "Harap tunggu..." : "Simpan Data Profile" }}
				</button>
			</div>
		</form>
	</div>
</template>
