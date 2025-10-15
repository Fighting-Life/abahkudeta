<script setup lang="ts">
const { $profileState } = useNuxtApp();
const { getAllTransactions } = useTransactions();

const transactions = ref<TransactionHistory[]>([]);
const isMounted = ref(false);

const lastDeposit = computed(() => {
	const deposits = transactions.value.filter(
		(transaction) => transaction.transaction_type === "deposit",
	);

	if (deposits.length === 0) return null;

	return deposits.reduce((prev, current) =>
		prev.created_at > current.created_at ? prev : current,
	);
});

const lastWithdrawal = computed(() => {
	const withdrawals = transactions.value.filter(
		(transaction) => transaction.transaction_type === "withdraw",
	);

	if (withdrawals.length === 0) return null;

	return withdrawals.reduce((prev, current) =>
		prev.created_at > current.created_at ? prev : current,
	);
});

const lastTransaction = computed(() => {
	if (transactions.value.length === 0) return null;

	return transactions.value.reduce((prev, current) =>
		prev.created_at > current.created_at ? prev : current,
	);
});

onMounted(async () => {
	isMounted.value = true;
	try {
		transactions.value = (await getAllTransactions()) as TransactionHistory[];
	} catch (error) {
		console.error("Failed to load transactions:", error);
		transactions.value = [];
	}
});

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
</script>

<template>
	<div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
		<!-- Last Deposit Status -->
		<div class="rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-6">
			<div class="flex items-center gap-4">
				<div class="rounded-full bg-black p-3">
					<svg
						class="h-6 w-6 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm leading-none font-bold tracking-tighter text-white">
						STATUS DEPOSIT TERAKHIR
					</p>
					<p v-if="!isMounted" class="text-xs text-neutral-400">
						Memuat data...
					</p>
					<p v-else-if="!lastDeposit" class="text-xs text-neutral-400">
						Tidak ada data.
					</p>
					<p v-else class="text-xs text-neutral-400">
						{{ formatDate(lastDeposit.created_at) }}
					</p>
				</div>
			</div>
		</div>

		<!-- Last Withdrawal Status -->
		<div class="rounded-lg bg-gradient-to-b from-[#2e2e2e] to-[#141415] p-6">
			<div class="flex items-center gap-4">
				<div class="rounded-full bg-black p-3">
					<svg
						class="h-6 w-6 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm leading-none font-bold tracking-tighter text-white">
						STATUS PENARIKAN TERAKHIR
					</p>
					<p v-if="!isMounted" class="text-xs text-neutral-400">
						Memuat data...
					</p>
					<p v-else-if="!lastWithdrawal" class="text-xs text-neutral-400">
						Tidak ada data.
					</p>
					<p v-else class="text-xs text-neutral-400">
						{{ formatDate(lastWithdrawal.created_at) }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
