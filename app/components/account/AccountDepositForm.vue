<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const { $profileState } = useNuxtApp();
const { createTransaction } = useTransactions();
const toast = useToast();
const openQrisDepositModal = ref(false);
const { handleSubmit, errors, isSubmitting, resetForm } = useForm({
	validationSchema: createDepositSchema,
	initialValues: {
		payment_type: "qiris",
		amount: 50000,
		notes: "",
	},
});

const { value: payment_type } = useField<
	"bank" | "e-money" | "qiris" | "pulsa" | undefined
>("payment_type");
const { value: amount } = useField<number>("amount");
const { value: notes } = useField<string>("notes");

const submit = handleSubmit(async (values) => {
	if (!$profileState.value) {
		toast.error("Anda harus login terlebih dahulu");
		return;
	}
	try {
		await createTransaction({
			transaction_type: "deposit",
			amount: values.amount,
			payment_method:
				values.payment_type === "qiris" ? "e_wallet" : "bank_transfer",
			user_account_number:
				$profileState.value?.bank_account_number || "1234567890",
			user_account_name: $profileState.value?.bank_account_name || "John Doe",
			notes: values.notes,
		});
		try {
			await $fetch("/api/transaction/deposit", {
				method: "POST",
				body: {
					amount: values.amount,
					payment_method:
						values.payment_type === "qiris" ? "e_wallet" : "bank_transfer",
					user_account_number:
						$profileState.value?.bank_account_number || "1234567890",
					user_account_name:
						$profileState.value?.bank_account_name || "John Doe",
					notes: values.notes,
				},
			});
		} catch (error) {
			console.log(error);
		}
		openQrisDepositModal.value = true;
		toast.success("Deposit berhasil diproses");
	} catch (error) {
		toast.error("Gagal memproses deposit, coba lagi");
	}
});

const validateAmount = () => {
	const regex = /^\d+(\.\d{1,2})?$/;
	if (!regex.test(amount.value.toString())) {
		errors.value.amount = "Masukkan angka yang valid";
	}
	if (amount.value < 20000) {
		errors.value.amount = "Minimal deposit 10.000";
	}
};
const paymentMethods = [
	{
		name: "QIRIS EON",
		image: "/images/menus/QR.svg",
		value: "qiris",
		is_available: true,
	},
	{
		name: "Pulsa",
		image: "/images/menus/PULSA.svg",
		value: "pulsa",
		is_available: false,
	},
	{
		name: "E-Money",
		image: "/images/menus/EMONEY.svg",
		value: "e-money",
		is_available: false,
	},
	{
		name: "Bank Transfer",
		image: "/images/menus/BANK.svg",
		value: "bank",
		is_available: false,
	},
];
</script>
<template>
	<form
		class="w-full space-y-6 rounded-lg bg-neutral-900 p-2 lg:p-4"
		@submit.prevent="submit"
	>
		<div class="text-sm text-neutral-100">
			Metode Pembayaran <span class="text-red-500">*</span>
		</div>
		<div
			class="scrollbar-thin scrollbar-thumb-[#4a5568] scrollbar-track-[#2a2a2a] grid auto-cols-[minmax(120px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3 lg:auto-cols-[minmax(140px,1fr)]"
		>
			<label
				v-for="(method, i) in paymentMethods"
				:key="i"
				:class="
					cn(
						'relative inline-flex h-14 flex-col items-center rounded-lg p-2',
						{
							'bg-gradient-to-b from-[#fbeb8c] to-[#9d7e39] text-white':
								payment_type === method.value,
							'bg-neutral-300 text-neutral-900': payment_type !== method.value,
						},
						method.is_available ? 'cursor-pointer' : 'cursor-not-allowed',
					)
				"
			>
				<div
					v-if="!method.is_available"
					class="absolute top-0 right-0 left-0 h-full w-full bg-black/60"
				>
					<div class="flex h-full w-full items-center justify-center">
						<div class="tetx-xs font-semibold text-yellow-400">MAINTENANCE</div>
					</div>
				</div>
				<input
					v-model="payment_type"
					:value="method.value"
					type="radio"
					class="form-checkbox sr-only"
					:disabled="!method.is_available || isSubmitting"
				/>
				<img
					:src="method.image"
					:alt="method.name"
					:class="
						cn('h-6 w-6', {
							'fill-white': payment_type === method.value,
							'fill-neutral-900': payment_type !== method.value,
						})
					"
				/>
				<span class="text-xs font-semibold whitespace-nowrap">
					{{ method.name }}
				</span>
			</label>
		</div>
		<div class="h-5">
			<Transition name="fade-slide-down">
				<div v-if="errors.payment_type" class="mt-1 text-xs text-red-400">
					{{ errors.payment_type }}
				</div>
			</Transition>
		</div>
		<div class="border-b border-neutral-600 py-4 text-sm text-neutral-100">
			Informasi Deposit :
		</div>
		<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
			<label
				for="amount"
				class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
			>
				<div class="text-xs text-neutral-200">Jumlah</div>
				<div class="text-xs text-yellow-400">*</div>
			</label>
			<div class="col-span-1 lg:col-span-9">
				<div class="grid w-full">
					<div class="min-h-[2rem]">
						<input
							v-model="amount"
							type="number"
							name="amount"
							class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
							autocomplete="amount"
							placeholder="Masukkan jumlah"
							:disabled="isSubmitting"
							@input="validateAmount"
						/>
					</div>
					<div class="h-5">
						<Transition name="fade-slide-down">
							<div v-if="errors.amount" class="mt-1 text-xs text-red-400">
								{{ errors.amount }}
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</div>
		<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
			<label
				for="notes"
				class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
			>
				<div class="text-xs text-neutral-200">Keterangan</div>
				<div class="text-xs text-yellow-400">*</div>
			</label>
			<div class="col-span-1 lg:col-span-9">
				<div class="grid w-full">
					<div class="min-h-[2rem]">
						<textarea
							v-model="notes"
							name="notes"
							rows="5"
							class="w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
							autocomplete="notes"
							placeholder="Masukkan keterangan"
							:disabled="isSubmitting"
						/>
					</div>
					<div class="h-5">
						<Transition name="fade-slide-down">
							<div v-if="errors.notes" class="mt-1 text-xs text-red-400">
								{{ errors.notes }}
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
				{{ isSubmitting ? "Harap tunggu..." : "DEPOSIT SEKARANG" }}
			</button>
		</div>
	</form>
	<DialogQrisDeposit
		v-if="openQrisDepositModal"
		v-model:open="openQrisDepositModal"
		@update:open="(value) => (openQrisDepositModal = value)"
	/>
</template>
<style scoped></style>
