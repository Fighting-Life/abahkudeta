<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const route = useRoute();
const { $profileState } = useNuxtApp();
const { createTransaction } = useTransactions();
const toast = useToast();

const queryTName = computed(() => route.query.t as string);
const openQrisDepositModal = ref(false);

const { handleSubmit, errors, isSubmitting, resetForm } = useForm({
	validationSchema: createDepositSchema,
	initialValues: {
		payment_type: "qiris",
		amount: 20000,
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
			user_account_number: $profileState.value?.id || "1234567890",
			user_account_name: $profileState.value?.full_name || "John Doe",
			notes: values.notes,
		});
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
const topMenuItems = [
	{
		name: "Deposit",
		query: "deposit",
		link: "/account?q=finance&t=deposit",
		image: "/images/menus/deposit.webp",
		image_active: "/images/menus/deposit-active.webp",
	},
	{
		name: "Penarikan",
		query: "withdrawal",
		link: "/account?q=finance&t=withdrawal",
		image: "/images/menus/withdrawal.webp",
		image_active: "/images/menus/withdrawal-active.webp",
	},
	{
		name: "Klaim Bonus",
		query: "claim",
		link: "/account?q=finance&t=claim",
		image: "/images/menus/claim.webp",
		image_active: "/images/menus/claim-active.webp",
	},
];
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
	<div class="animate-page-grow rounded-lg p-0 lg:p-6">
		<div class="flex-1">
			<!-- Grid responsive dengan overflow di desktop -->
			<div class="w-full">
				<div
					class="scrollbar-thin scrollbar-thumb-[#4a5568] scrollbar-track-[#2a2a2a] grid auto-cols-[minmax(120px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3 lg:auto-cols-[minmax(140px,1fr)]"
				>
					<NuxtLink
						v-for="(menu, i) in topMenuItems"
						:key="i"
						:to="menu.link"
						class="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-4 transition-colors hover:bg-[#141415]"
					>
						<img
							:src="
								queryTName === menu.query.toLowerCase()
									? menu.image_active
									: menu.image
							"
							:alt="menu.name"
							class="mb-2 h-8 w-8"
						/>
						<span class="text-sm whitespace-nowrap text-gray-300">{{
							menu.name
						}}</span>
					</NuxtLink>
				</div>
			</div>
		</div>
		<div v-if="queryTName === 'deposit'">
			<account-deposit-form />
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar styling */
.scroll-container::-webkit-scrollbar {
	height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
	background: #2a2a2a;
	border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
	background: #4a5568;
	border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
	background: #718096;
}
</style>
