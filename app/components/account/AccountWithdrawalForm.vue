<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const { $profileState, $gameHistoryState } = useNuxtApp();
const { createTransaction } = useTransactions();
const toast = useToast();
const openEditBank = ref(false);
const warningLimitBalance = ref<string | undefined>(undefined);
const currentUserBalance = computed(() =>
	parseInt($profileState.value?.balance || "0"),
);

const { handleSubmit, errors, isSubmitting, resetForm } = useForm({
	validationSchema: createWithdrawSchema,
	initialValues: {
		payment_type: "bank",
		amount: currentUserBalance.value,
		bank_account_number: "",
		bank_account_name: "",
	},
});

const { value: payment_type } = useField<"bank" | "e-money" | undefined>(
	"payment_type",
);
const { value: amount } = useField<number>("amount");
const { value: bank_account_number } = useField<string>("bank_account_number");
const { value: bank_account_name } = useField<string>("bank_account_name");

const submit = handleSubmit(async (values) => {
	if (!$profileState.value) {
		toast.error("Anda harus login terlebih dahulu");
		return;
	}
	if (currentUserBalance.value < 50000) {
		warningLimitBalance.value =
			"Saldo tidak mencukupi untuk melakukan penarikan. Minimal saldo harus Rp 50.000";
		return;
	}
	if (!$gameHistoryState.value?.length) {
		warningLimitBalance.value =
			"Anda harus bermain game setidaknya 1 permainan terlebih dahulu untuk melakukan penarikan";
		return;
	}
	try {
		await createTransaction({
			transaction_type: "withdraw",
			amount: values.amount,
			payment_method:
				values.payment_type === "e-money" ? "e_wallet" : "bank_transfer",
			user_account_number: values.bank_account_number,
			user_account_name: values.bank_account_name,
		});
		toast.success("Deposit berhasil diproses");
	} catch (error) {
		toast.error("Gagal memproses deposit, coba lagi");
	}
});
const checkBalanceLimit = () => {
	const balance = parseInt($profileState.value?.balance || "0");

	if (balance < 50000) {
		warningLimitBalance.value =
			"Saldo tidak mencukupi untuk melakukan penarikan. Minimal saldo harus Rp 50.000";
		return false;
	} else {
		warningLimitBalance.value = undefined;
		return true;
	}
};

onMounted(() => {
	setTimeout(() => {
		checkBalanceLimit();
	}, 1000);
});
watch(
	() => $profileState.value,
	(newProfile) => {
		if (newProfile) {
			setTimeout(() => {
				checkBalanceLimit();
			}, 500);
		}
	},
	{ deep: true, immediate: true },
);
watch(
	() => $profileState.value?.balance,
	(newBalance) => {
		if (newBalance !== undefined) {
			setTimeout(() => {
				checkBalanceLimit();
			}, 300);
		}
	},
);

const handlePaymentAccountChange = (value: ChangeBankAccountSchema) => {
	payment_type.value = value.payment_type;
	bank_account_number.value = value.bank_account_number;
	bank_account_name.value = value.bank_account_name;
};
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
		name: "E-Money",
		image: "/images/menus/EMONEY.svg",
		value: "e-money",
		is_available: true,
	},
	{
		name: "Bank Transfer",
		image: "/images/menus/BANK.svg",
		value: "bank",
		is_available: true,
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
		<div>
			<div class="border-b border-neutral-600 py-4 text-sm text-neutral-100">
				Informasi Penerima :
			</div>
			<div class="grid gap-4">
				<label for="amount" class="flex items-start gap-2 pt-2">
					<div class="text-xs text-neutral-200">Jumlah</div>
					<div class="text-xs text-red-500">*</div>
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
			<div class="grid gap-4">
				<label for="bank_account_name" class="flex items-start gap-2 pt-2">
					<div class="text-xs text-neutral-200">Nama Akun Bank</div>
					<div class="text-xs text-red-500">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="flex items-center justify-between gap-3">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="bank_account_name"
									type="text"
									name="bank_account_name"
									class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="bank_account_name"
									placeholder="Masukkan nama akun bank"
									:disabled="isSubmitting"
								/>
							</div>
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
						<button
							type="button"
							class="-mt-4 inline-flex h-[30px] cursor-pointer items-center justify-center gap-2 rounded-md bg-yellow-400 px-2 text-xl font-semibold text-white uppercase transition-colors hover:bg-yellow-500 active:scale-95"
							@click="openEditBank = true"
						>
							<Icon name="material-symbols:add-2-rounded" />
						</button>
					</div>
				</div>
			</div>
			<div class="grid gap-4">
				<label for="bank_account_number" class="flex items-start gap-2 pt-2">
					<div class="text-xs text-neutral-200">Nomor Akun Bank</div>
					<div class="text-xs text-red-500">*</div>
				</label>
				<div class="col-span-1 lg:col-span-9">
					<div class="flex items-center justify-between gap-3">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="bank_account_number"
									type="text"
									name="bank_account_number"
									class="h-8 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="bank_account_number"
									placeholder="Masukkan nomor akun bank"
									:disabled="isSubmitting"
									@input="formatBankNumberInput"
								/>
							</div>
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
		</div>
		<Accordion
			type="single"
			class="-mt-6 w-full rounded-md bg-neutral-800 text-neutral-100"
			collapsible
		>
			<AccordionItem value="item-1">
				<AccordionTrigger as-child>
					<div
						class="flex w-full cursor-pointer items-center justify-between px-4"
					>
						<div class="text font-bold">Jumlah yang ditransfer</div>
						<div class="font-bold text-[#e5d177]">
							{{ formatBalanceWithCurrency(amount) }}
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent class="grid gap-4 bg-neutral-950 p-4">
					<div class="border-b border-neutral-700 py-2">
						<p class="text-xs font-bold text-neutral-100">Rincian Penarikan</p>
					</div>
					<div
						class="flex w-full cursor-pointer items-center justify-between border-b border-neutral-700 pb-2"
					>
						<div class="text-xs font-bold text-neutral-400">
							Jumlah yang ditransfer
						</div>
						<div class="text-xs font-bold text-neutral-400">
							{{ formatBalanceWithCurrency(amount) }}
						</div>
					</div>
					<div
						class="flex w-full cursor-pointer items-center justify-between border-b border-neutral-700 pb-2"
					>
						<div class="text-xs font-bold text-neutral-400">Sisa Saldo</div>
						<div class="text-xs font-bold text-neutral-400">
							{{ formatBalanceWithCurrency(currentUserBalance - amount) }}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
		<div
			class="flex items-center gap-2 rounded-md border border-[#857b44] bg-[#1c1511] p-3 text-neutral-100"
		>
			<Icon name="mingcute:warning-line" class="text-[#857b44]" />
			<p class="text-xs">
				Biaya admin akan diinfokan ketika proses transaksi telah selesai di
				proses
			</p>
		</div>
		<div v-if="payment_type" class="flex items-center justify-center">
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
		<DialogEditBankAccount
			v-if="openEditBank"
			v-model:open="openEditBank"
			@updatepayment="handlePaymentAccountChange"
			@update:open="(val) => (openEditBank = val)"
		/>
		<AppAlertDialog
			v-if="warningLimitBalance"
			:open="!!warningLimitBalance"
			type="warning"
			title="Warning!"
			:message="warningLimitBalance"
			@onclose="() => (warningLimitBalance = undefined)"
		/>
	</form>
</template>
