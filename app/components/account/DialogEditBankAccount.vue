<script setup lang="ts">
const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
	(e: "updatepayment", value: ChangeBankAccountSchema): void;
}>();
const props = withDefaults(
	defineProps<{
		open?: boolean;
	}>(),
	{
		open: false,
	},
);

const openModal = useVModel(props, "open", emits, {
	passive: true,
});

const { handleSubmit, errors, isSubmitting, setValues } = useForm({
	validationSchema: changeBankAccountSchema,
	initialValues: {
		payment_type: "bank",
		bank_account_number: "",
		bank_account_name: "",
	},
});

const { value: payment_type } = useField<"bank" | "e-money" | undefined>(
	"payment_type",
);
const { value: bank_account_number } = useField<string>("bank_account_number");
const { value: bank_account_name } = useField<string>("bank_account_name");

const submit = handleSubmit(async (values) => {
	emits("updatepayment", values);
	openModal.value = false;
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
const bankPayments = [
	{ label: "BCA", value: "bca", active: false },
	{ label: "BNI", value: "bni", active: false },
	{ label: "BRI", value: "bri", active: false },
	{ label: "MANDIRI", value: "mandiri", active: false },
];
const emoneyPayments = [
	{ label: "OVO", value: "ovo", active: false },
	{ label: "DANA", value: "dana", active: false },
	{ label: "LINKAJA", value: "linkaja", active: false },
	{ label: "GOPAY", value: "gopay", active: false },
	{ label: "QRIS", value: "qris", active: true },
];
</script>

<template>
	<Dialog v-model:open="openModal">
		<DialogContent class="border-neutral-800 bg-neutral-950 sm:max-w-md">
			<DialogHeader>
				<DialogTitle class="text-xl font-bold text-white">
					Edit Bank Akun
				</DialogTitle>
				<DialogDescription class="text-sm text-neutral-300">
					Edit informasi bank akun Anda di sini. Klik simpan setelah selesai.
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="grid gap-4">
					<Label
						for="payment_type"
						class="flex items-start justify-center gap-5"
					>
						<div class="text-neutral-200">Metode Pembayaran</div>
						<div class="text-yellow-400">*</div>
					</Label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<div class="flex w-full items-center gap-4 lg:gap-30">
									<label
										v-for="(item, i) in paymentMethods"
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
										/>

										<!-- Custom radio button -->
										<div class="custom-radio">
											<div class="custom-radio-inner"></div>
										</div>

										<!-- Label text -->
										<span class="custom-radio-text">
											{{ item.name }}
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
				<div v-if="payment_type === 'bank'" class="grid gap-4">
					<Label class="flex items-start gap-5">
						<div class="text-neutral-200">Jenis Bank</div>
						<div class="text-yellow-400">*</div>
					</Label>
					<Select required>
						<SelectTrigger
							class="h-10 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						>
							<SelectValue placeholder="Pilih Bank" />
						</SelectTrigger>
						<SelectContent
							class="border border-neutral-800 bg-neutral-950 text-neutral-50"
						>
							<SelectGroup>
								<SelectItem
									v-for="bank in bankPayments"
									:key="bank.value"
									:value="bank.value"
									class="uppercase"
								>
									{{ bank.label }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div v-if="payment_type === 'e-money'" class="grid gap-4">
					<Label class="flex items-start gap-5">
						<div class="text-neutral-200">Jenis E-Money</div>
						<div class="text-yellow-400">*</div>
					</Label>
					<Select required>
						<SelectTrigger
							class="h-10 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						>
							<SelectValue placeholder="Pilih E-Money" />
						</SelectTrigger>
						<SelectContent
							class="border border-neutral-800 bg-neutral-950 text-neutral-50"
						>
							<SelectGroup>
								<SelectItem
									v-for="emoney in emoneyPayments"
									:key="emoney.value"
									:value="emoney.value"
									class="uppercase"
								>
									{{ emoney.label }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div v-if="payment_type !== undefined" class="grid gap-4">
					<div class="grid gap-4">
						<Label for="bank_account_name" class="flex items-start gap-5">
							<div class="text-neutral-200">Nama Akun Bank</div>
							<div class="text-yellow-400">*</div>
						</Label>
						<input
							v-model="bank_account_name"
							name="bank_account_name"
							class="h-10 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
							autocomplete="bank_account_name"
							placeholder="Masukkan nama akun bank"
							:disabled="isSubmitting"
						/>
						<div class="-mt-3 h-5">
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
					<div class="grid gap-4">
						<Label for="bank_account_number" class="flex items-start gap-5">
							<div class="text-neutral-200">Nomor Akun Bank</div>
							<div class="text-yellow-400">*</div>
						</Label>
						<input
							v-model="bank_account_number"
							name="bank_account_number"
							class="h-10 w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
							autocomplete="bank_account_number"
							placeholder="Masukkan nomor akun bank"
							:disabled="isSubmitting"
							@input="formatBankNumberInput"
						/>
						<div class="-mt-3 h-5">
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
			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					class="cursor-pointer transition-all duration-300 active:scale-95"
					@click="submit"
				>
					Simpan Perubahan
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
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
