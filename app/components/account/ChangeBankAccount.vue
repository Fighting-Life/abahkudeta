<script lang="ts" setup>
import { LoaderCircleIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const { $profileState, $refreshProfile } = useNuxtApp();
const { updateProfile } = useProfiles();
const toast = useToast();

const { handleSubmit, errors, isSubmitting, validateField } = useForm({
	validationSchema: changeBankAccountSchema,
	initialValues: {
		payment_type:
			($profileState.value?.payment_type as "bank" | "e-money") || "bank",
		bank_account_number: $profileState.value?.bank_account_number || "",
		bank_account_name: $profileState.value?.bank_account_name || "",
	},
});

const { value: payment_type } = useField<"bank" | "e-money">("payment_type");
const { value: payment_method } = useField<string>("payment_method");
const { value: bank_account_number } = useField<string>("bank_account_number");
const { value: bank_account_name } = useField<string>("bank_account_name");

const submit = handleSubmit(async (values) => {
	try {
		await updateProfile($profileState.value?.id || "", {
			payment_type: values.payment_type,
			bank_account_number: values.bank_account_number,
			bank_account_name: values.bank_account_name,
		});
		await $refreshProfile();
		toast.success("Bank akun berhasil diubah");
	} catch (error) {
		toast.error(
			error instanceof Error ? error.message : "Gagal mengubah bank akun",
		);
	}
});
const formatBankNumberInput = (event: Event) => {
	let value = (event.target as HTMLInputElement).value;
	value = value.replace(/[^\d+]/g, "");

	if (value.startsWith("+")) {
		value = "+" + value.slice(1).replace(/\+/g, "");
	} else {
		value = value.replace(/\+/g, "");
	}

	(event.target as HTMLInputElement).value = value;
	bank_account_number.value = value;
};
const paymentOptions = [
	{ value: "bank", label: "Bank" },
	{ value: "e-money", label: "E-Money" },
];

const bankPayments = [
	{ label: "BCA", value: "bca", active: false },
	{ label: "BNI", value: "bni", active: false },
	{ label: "BRI", value: "bri", active: false },
	{ label: "MANDIRI", value: "mandiri", active: false },
];

const eMoneyPayments = [
	{ label: "OVO", value: "ovo", active: false },
	{ label: "DANA", value: "dana", active: false },
	{ label: "LINKAJA", value: "linkaja", active: false },
	{ label: "GOPAY", value: "gopay", active: false },
	{ label: "QRIS", value: "qris", active: true },
];
</script>

<template>
	<div class="w-full space-y-4 bg-neutral-900 p-2 lg:p-4">
		<div class="flex items-center border-b border-neutral-700 py-3">
			<h2 class="text-lg font-bold">UBAH BANK AKUN</h2>
		</div>
		<div class="flex items-center border-b border-neutral-700 py-3">
			<h4 class="text-base font-medium">Informasi Bank Akun</h4>
		</div>
		<form class="grid gap-5" @submit.prevent="submit">
			<div class="grid gap-5">
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="payment_type"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-neutral-200">Metode Pembayaran</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<div class="flex w-full items-center gap-4 lg:gap-30">
									<label
										v-for="(item, i) in paymentOptions"
										:key="i"
										:for="`payment_type-${i}`"
										class="custom-radio-label group flex cursor-pointer items-center"
									>
										<!-- Hidden native radio input -->
										<input
											:id="`payment_type-${i}`"
											v-model="payment_type"
											type="radio"
											:value="item.value"
											name="payment_type"
											class="hidden-radio"
											@blur="validateField('payment_type')"
										/>

										<!-- Custom radio button -->
										<div class="custom-radio">
											<div class="custom-radio-inner"></div>
										</div>

										<!-- Label text -->
										<span class="custom-radio-text">
											{{ item.label }}
										</span>
									</label>
								</div>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div
										v-if="errors.payment_type"
										class="mt-1 text-xs text-red-400"
									>
										{{ errors.payment_type }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div
					v-if="payment_type === 'bank'"
					class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12"
				>
					<label
						for="payment_method"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-neutral-200">Bank</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<!-- Input wrapper with fixed height for error -->
							<div class="min-h-[2rem]">
								<select
									v-model="payment_method"
									name="payment_method"
									class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="on"
								>
									<option value="" disabled selected>--Pilih Bank--</option>
									<option
										v-for="(item, i) in bankPayments"
										:key="i"
										:value="item.value"
										:disabled="!item.active"
									>
										{{ item.label }}
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div
					v-if="payment_type === 'e-money'"
					class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12"
				>
					<label
						for="payment_method"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-neutral-200">E-Money</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<!-- Input wrapper with fixed height for error -->
							<div class="min-h-[2rem]">
								<select
									v-model="payment_method"
									name="payment_method"
									class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="on"
									placeholder="--Pilih E-Money--"
								>
									<option selected disabled>--Pilih E-Money--</option>
									<option
										v-for="(item, i) in eMoneyPayments"
										:key="i"
										:value="item.value"
										:disabled="!item.active"
									>
										{{ item.label }}
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div v-if="payment_method">
					<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
						<label
							for="bank_account_number"
							class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
						>
							<div class="text-xs text-neutral-200">
								Nomor {{ payment_type === "bank" ? "Rekening" : "Akun" }}
							</div>
							<div class="text-xs text-yellow-400">*</div>
						</label>
						<div class="col-span-1 lg:col-span-9">
							<div class="grid w-full">
								<!-- Input wrapper with fixed height for error -->
								<div class="min-h-[2rem]">
									<input
										v-model="bank_account_number"
										type="text"
										name="bank_account_number"
										class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
										autocomplete="on"
										:placeholder="`Nomor ${payment_type === 'bank' ? 'Rekening' : 'Akun'} Anda`"
										@blur="validateField('bank_account_number')"
										@input="formatBankNumberInput"
									/>
								</div>
								<!-- Error message container with fixed height -->
								<div class="h-5">
									<Transition name="fade-slide-down">
										<div
											v-if="errors.bank_account_number"
											class="mt-1 text-xs text-red-400"
										>
											{{ errors.bank_account_number }}
										</div>
									</Transition>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="payment_method">
					<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
						<label
							for="bank_account_name"
							class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
						>
							<div class="text-xs text-neutral-200">Nama Lengkap</div>
							<div class="text-xs text-yellow-400">*</div>
						</label>
						<div class="col-span-1 lg:col-span-9">
							<div class="grid w-full">
								<!-- Input wrapper with fixed height for error -->
								<div class="min-h-[2rem]">
									<input
										v-model="bank_account_name"
										type="text"
										name="bank_account_name"
										class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
										autocomplete="name"
										placeholder="Nama Lengkap Anda"
										@blur="validateField('bank_account_name')"
									/>
								</div>
								<!-- Error message container with fixed height -->
								<div class="h-5">
									<Transition name="fade-slide-down">
										<div
											v-if="errors.bank_account_name"
											class="mt-1 text-xs text-red-400"
										>
											{{ errors.bank_account_name }}
										</div>
									</Transition>
								</div>
							</div>
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
/* Hide native radio input */
.hidden-radio {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

/* Custom radio container */
.custom-radio {
	position: relative;
	width: 18px;
	height: 18px;
	border: 2px solid #4b5563; /* neutral-600 */
	border-radius: 50%;
	background-color: transparent;
	transition: all 0.2s ease;
	flex-shrink: 0;
}

/* Inner dot */
.custom-radio-inner {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0);
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #facc15; /* yellow-400 */
	transition: transform 0.2s ease;
}

/* Hover state */
.custom-radio-label:hover .custom-radio {
	border-color: #facc15; /* yellow-400 */
}

/* Checked state */
.hidden-radio:checked + .custom-radio {
	border-color: #facc15; /* yellow-400 */
	background-color: transparent;
}

.hidden-radio:checked + .custom-radio .custom-radio-inner {
	transform: translate(-50%, -50%) scale(1);
}

/* Focus state for accessibility */
.hidden-radio:focus + .custom-radio {
	box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
}

/* Label text */
.custom-radio-text {
	margin-left: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #e5e7eb; /* neutral-200 */
	transition: color 0.2s ease;
	user-select: none;
}

/* Hover text color */
.custom-radio-label:hover .custom-radio-text {
	color: #facc15; /* yellow-400 */
}

/* Active state */
.custom-radio-label:active .custom-radio {
	transform: scale(0.95);
}

/* Disabled state (optional) */
.hidden-radio:disabled + .custom-radio {
	border-color: #374151; /* neutral-700 */
	opacity: 0.5;
	cursor: not-allowed;
}

.hidden-radio:disabled ~ .custom-radio-text {
	color: #6b7280; /* neutral-500 */
	cursor: not-allowed;
}

/* Fade animation */
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
</style>
