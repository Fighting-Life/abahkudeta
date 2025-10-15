<script setup lang="ts">
import { cn } from "~/lib/utils";
import {
	LoaderCircleIcon,
	Search,
	Filter,
	CalendarIcon,
} from "lucide-vue-next";
import type { DateValue } from "@internationalized/date";
import {
	DateFormatter,
	getLocalTimeZone,
	parseDate,
	today,
} from "@internationalized/date";

const { getAllTransactions } = useTransactions();

// State
const df = new DateFormatter("id-ID", {
	dateStyle: "long",
});
const transactions = ref<TransactionHistory[]>([]);
const loading = ref(false);
const selectedType = ref<"all" | "deposit" | "withdraw">("all");
const selectedStatus = ref<
	"all" | "pending" | "completed" | "rejected" | "cancelled"
>("all");
const searchQuery = ref("");
const dateRange = ref<{
	from?: DateValue;
	to?: DateValue;
}>({
	from: undefined,
	to: undefined,
});

// Computed
const filteredTransactions = computed(() => {
	let filtered = transactions.value;

	// Filter by type
	if (selectedType.value !== "all") {
		filtered = filtered.filter(
			(t) => t.transaction_type === selectedType.value,
		);
	}

	// Filter by status
	if (selectedStatus.value !== "all") {
		filtered = filtered.filter((t) => t.status === selectedStatus.value);
	}

	// Filter by search
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(t) =>
				t.reference_number?.toLowerCase().includes(query) ||
				t.username?.toLowerCase().includes(query) ||
				t.full_name?.toLowerCase().includes(query),
		);
	}

	// Filter by date range
	if (dateRange.value.from) {
		const fromDate = dateRange.value.from.toDate(getLocalTimeZone());
		filtered = filtered.filter((t) => new Date(t.created_at) >= fromDate);
	}
	if (dateRange.value.to) {
		const toDate = dateRange.value.to.toDate(getLocalTimeZone());
		toDate.setHours(23, 59, 59, 999); // End of day
		filtered = filtered.filter((t) => new Date(t.created_at) <= toDate);
	}

	return filtered;
});

// Calculate totals
const totals = computed(() => {
	const result = {
		totalAmount: 0,
		adminFee: 0,
		grandTotal: 0,
	};

	filteredTransactions.value.forEach((t) => {
		if (t.status === "completed") {
			result.totalAmount += Number(t.amount);
		}
	});

	result.grandTotal = result.totalAmount - result.adminFee;

	return result;
});

// Format helpers
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);
};

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "completed":
			return "bg-green-500/20 text-green-400";
		case "pending":
			return "bg-yellow-500/20 text-yellow-400";
		case "rejected":
		case "cancelled":
			return "bg-red-500/20 text-red-400";
		case "processing":
			return "bg-blue-500/20 text-blue-400";
		default:
			return "bg-neutral-500/20 text-neutral-400";
	}
};

const getStatusText = (status: string) => {
	const statusMap: Record<string, string> = {
		pending: "Menunggu",
		processing: "Diproses",
		completed: "Selesai",
		cancelled: "Dibatalkan",
		rejected: "Ditolak",
	};
	return statusMap[status] || status;
};

const getTypeText = (type: string) => {
	return type === "deposit" ? "Deposit" : "Penarikan";
};

// Fetch transactions
const fetchTransactions = async () => {
	loading.value = true;
	try {
		const filters: TransactionFilters = {};

		if (selectedType.value !== "all") {
			filters.type = selectedType.value as TransactionType;
		}

		if (selectedStatus.value !== "all") {
			filters.status = selectedStatus.value as TransactionStatus;
		}

		const data = await getAllTransactions(filters);
		transactions.value = data || [];
	} catch (error) {
		console.error("Fetch transactions error:", error);
	} finally {
		loading.value = false;
	}
};

// Reset filters
const resetFilters = () => {
	selectedType.value = "all";
	selectedStatus.value = "all";
	searchQuery.value = "";
	dateRange.value = { from: undefined, to: undefined };
};

// Helper to convert Date string to DateValue
const stringToDateValue = (dateStr: string): DateValue => {
	return parseDate(dateStr);
};

// Set date range to today
const setToday = () => {
	const todayDate = today(getLocalTimeZone());
	dateRange.value = {
		from: todayDate,
		to: todayDate,
	};
};

// Set date range to this week
const setThisWeek = () => {
	const todayDate = today(getLocalTimeZone());
	const jsDate = todayDate.toDate(getLocalTimeZone());

	// Get first day of week (Sunday)
	const firstDay = new Date(jsDate);
	firstDay.setDate(jsDate.getDate() - jsDate.getDay());

	// Get last day of week (Saturday)
	const lastDay = new Date(jsDate);
	lastDay.setDate(jsDate.getDate() + (6 - jsDate.getDay()));

	const firstDayString = firstDay.toISOString().split("T")[0];
	const lastDayString = lastDay.toISOString().split("T")[0];

	if (firstDayString && lastDayString) {
		dateRange.value = {
			from: parseDate(firstDayString),
			to: parseDate(lastDayString),
		};
	}
};

// Set date range to this month
const setThisMonth = () => {
	const todayDate = today(getLocalTimeZone());
	const jsDate = todayDate.toDate(getLocalTimeZone());

	const firstDay = new Date(jsDate.getFullYear(), jsDate.getMonth(), 1);
	const lastDay = new Date(jsDate.getFullYear(), jsDate.getMonth() + 1, 0);

	const firstDayString = firstDay.toISOString().split("T")[0];
	const lastDayString = lastDay.toISOString().split("T")[0];
	if (firstDayString && lastDayString) {
		dateRange.value = {
			from: parseDate(firstDayString),
			to: parseDate(lastDayString),
		};
	}
};

// Apply filters
const applyFilters = () => {
	fetchTransactions();
};

// Load data on mount
onMounted(() => {
	fetchTransactions();
});
</script>

<template>
	<div class="animate-page-grow space-y-4 rounded-lg p-0 lg:p-6">
		<!-- Header -->
		<div class="rounded-lg bg-neutral-900 px-4 py-3">
			<h2 class="text-lg font-semibold text-white">Riwayat Transaksi</h2>
		</div>

		<!-- Filters -->
		<div class="space-y-4 rounded-lg bg-neutral-900 p-4">
			<!-- Desktop Filters -->
			<div class="hidden gap-4 lg:grid lg:grid-cols-12">
				<!-- Type Filter -->
				<div class="col-span-3">
					<label class="mb-2 block text-xs text-neutral-400"
						>Tipe Transaksi</label
					>
					<select
						v-model="selectedType"
						class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-yellow-400"
						@change="applyFilters"
					>
						<option value="all">Semua</option>
						<option value="deposit">Deposit</option>
						<option value="withdraw">Penarikan</option>
					</select>
				</div>

				<!-- Status Filter -->
				<div class="col-span-3">
					<label class="mb-2 block text-xs text-neutral-400">Status</label>
					<select
						v-model="selectedStatus"
						class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-sm text-neutral-100 outline-none focus:border-yellow-400"
						@change="applyFilters"
					>
						<option value="all">Semua</option>
						<option value="pending">Menunggu</option>
						<option value="processing">Diproses</option>
						<option value="completed">Selesai</option>
						<option value="cancelled">Dibatalkan</option>
						<option value="rejected">Ditolak</option>
					</select>
				</div>

				<!-- Search -->
				<div class="col-span-6">
					<label class="mb-2 block text-xs text-neutral-400">Cari</label>
					<div class="relative">
						<Search
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400"
						/>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Cari nomor tiket, nama, atau username..."
							class="w-full rounded-md border border-neutral-600 bg-black py-2 pr-3 pl-10 text-sm text-neutral-100 outline-none focus:border-yellow-400"
						/>
					</div>
				</div>

				<!-- Date Range FROM -->
				<div class="col-span-5">
					<label class="mb-2 block text-xs text-neutral-400"
						>Dari Tanggal</label
					>
					<Popover>
						<PopoverTrigger as-child>
							<Button
								variant="outline"
								:class="
									cn(
										'w-full justify-start rounded-md border border-neutral-600 bg-black px-3 py-2 text-left text-sm font-normal text-neutral-100 outline-none hover:bg-neutral-900 hover:text-neutral-100 focus:border-yellow-400 focus:bg-black focus:text-neutral-100 active:bg-black active:text-neutral-100',
										!dateRange.from && 'text-neutral-400',
									)
								"
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{{
									dateRange.from
										? df.format(dateRange.from.toDate(getLocalTimeZone()))
										: "Pilih tanggal"
								}}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							class="w-auto border border-neutral-600 bg-neutral-900 p-0 text-neutral-100"
						>
							<Calendar v-model="dateRange.from as DateValue" initial-focus />
						</PopoverContent>
					</Popover>
				</div>

				<!-- Date Range TO -->
				<div class="col-span-5">
					<label class="mb-2 block text-xs text-neutral-400"
						>Sampai Tanggal</label
					>
					<Popover>
						<PopoverTrigger as-child>
							<Button
								variant="outline"
								:class="
									cn(
										'w-full justify-start rounded-md border border-neutral-600 bg-black px-3 py-2 text-left text-sm font-normal text-neutral-100 outline-none hover:bg-neutral-900 hover:text-neutral-100 focus:border-yellow-400 focus:bg-black focus:text-neutral-100 active:bg-black active:text-neutral-100',
										!dateRange.to && 'text-neutral-400',
									)
								"
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{{
									dateRange.to
										? df.format(dateRange.to.toDate(getLocalTimeZone()))
										: "Pilih tanggal"
								}}
							</Button>
						</PopoverTrigger>
						<PopoverContent
							class="w-auto border border-neutral-600 bg-neutral-900 p-0 text-neutral-100"
						>
							<Calendar v-model="dateRange.to as DateValue" initial-focus />
						</PopoverContent>
					</Popover>
				</div>

				<!-- Action Buttons -->
				<div class="col-span-2 flex items-end gap-2">
					<button
						class="flex-1 cursor-pointer rounded-md bg-gradient-to-br from-yellow-500 to-yellow-600 px-4 py-2 text-sm font-semibold text-black transition-all hover:from-yellow-600 hover:to-yellow-700 active:scale-95"
						@click="applyFilters"
					>
						Filter
					</button>
				</div>
			</div>

			<!-- Mobile Filters -->
			<div class="space-y-3 lg:hidden">
				<!-- Type & Status -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-xs text-neutral-400">Tipe</label>
						<select
							v-model="selectedType"
							class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-xs text-neutral-100"
							@change="applyFilters"
						>
							<option value="all">Semua</option>
							<option value="deposit">Deposit</option>
							<option value="withdraw">Penarikan</option>
						</select>
					</div>
					<div>
						<label class="mb-1 block text-xs text-neutral-400">Status</label>
						<select
							v-model="selectedStatus"
							class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-xs text-neutral-100"
							@change="applyFilters"
						>
							<option value="all">Semua</option>
							<option value="pending">Menunggu</option>
							<option value="completed">Selesai</option>
						</select>
					</div>
				</div>

				<!-- Search -->
				<div class="relative">
					<Search
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Cari..."
						class="w-full rounded-md border border-neutral-600 bg-black py-2 pr-3 pl-10 text-xs text-neutral-100"
					/>
				</div>

				<!-- Date Range Mobile -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-xs text-neutral-400">Dari</label>
						<Popover>
							<PopoverTrigger as-child>
								<Button
									variant="outline"
									:class="
										cn(
											'w-full justify-start rounded-md border border-neutral-600 bg-black px-3 py-2 text-left text-xs font-normal text-neutral-100',
											!dateRange.from && 'text-neutral-400',
										)
									"
								>
									<CalendarIcon class="mr-2 h-3 w-3" />
									{{
										dateRange.from
											? new Date(
													dateRange.from.toDate(getLocalTimeZone()),
												).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "short",
												})
											: "Pilih"
									}}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								class="w-auto border border-neutral-600 bg-neutral-900 p-0 text-neutral-100"
							>
								<Calendar v-model="dateRange.from as DateValue" initial-focus />
							</PopoverContent>
						</Popover>
					</div>
					<div>
						<label class="mb-1 block text-xs text-neutral-400">Sampai</label>
						<Popover>
							<PopoverTrigger as-child>
								<Button
									variant="outline"
									:class="
										cn(
											'w-full justify-start rounded-md border border-neutral-600 bg-black px-3 py-2 text-left text-xs font-normal text-neutral-100',
											!dateRange.to && 'text-neutral-400',
										)
									"
								>
									<CalendarIcon class="mr-2 h-3 w-3" />
									{{
										dateRange.to
											? new Date(
													dateRange.to.toDate(getLocalTimeZone()),
												).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "short",
												})
											: "Pilih"
									}}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								class="w-auto border border-neutral-600 bg-neutral-900 p-0 text-neutral-100"
							>
								<Calendar v-model="dateRange.to as DateValue" initial-focus />
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-2">
					<button
						class="flex-1 cursor-pointer rounded-md bg-gradient-to-br from-yellow-500 to-yellow-600 px-4 py-2 text-xs font-semibold text-black transition-all hover:from-yellow-600 hover:to-yellow-700 active:scale-95"
						@click="applyFilters"
					>
						Filter
					</button>
					<button
						class="flex-1 cursor-pointer rounded-md border border-neutral-600 px-4 py-2 text-xs font-semibold text-neutral-300 transition-all hover:border-yellow-400 hover:text-yellow-400 active:scale-95"
						@click="resetFilters"
					>
						Reset
					</button>
				</div>
			</div>

			<!-- Quick Filters -->
			<div class="flex flex-wrap gap-2">
				<button
					class="cursor-pointer rounded-md border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-yellow-400 hover:text-yellow-400 active:scale-95"
					@click="setToday"
				>
					Hari Ini
				</button>
				<button
					class="cursor-pointer rounded-md border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-yellow-400 hover:text-yellow-400 active:scale-95"
					@click="setThisWeek"
				>
					Minggu Ini
				</button>
				<button
					class="cursor-pointer rounded-md border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-yellow-400 hover:text-yellow-400 active:scale-95"
					@click="setThisMonth"
				>
					Bulan Ini
				</button>
				<button
					class="cursor-pointer rounded-md border border-neutral-600 px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-red-400 hover:text-red-400 active:scale-95"
					@click="resetFilters"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Loading State -->
		<div
			v-if="loading"
			class="flex items-center justify-center rounded-lg bg-neutral-900 py-20"
		>
			<LoaderCircleIcon class="h-8 w-8 animate-spin text-yellow-500" />
		</div>

		<!-- Table Desktop -->
		<div
			v-else
			class="hidden overflow-hidden rounded-lg bg-neutral-900 lg:block"
		>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="border-b border-neutral-700 bg-neutral-800">
						<tr>
							<th
								class="px-4 py-3 text-left text-xs font-semibold text-neutral-300"
							>
								Nomor Tiket
							</th>
							<th
								class="px-4 py-3 text-left text-xs font-semibold text-neutral-300"
							>
								Tipe Pembayaran
							</th>
							<th
								class="px-4 py-3 text-right text-xs font-semibold text-neutral-300"
							>
								Jumlah Yang Diminta
							</th>
							<th
								class="px-4 py-3 text-right text-xs font-semibold text-neutral-300"
							>
								Biaya Admin
							</th>
							<th
								class="px-4 py-3 text-right text-xs font-semibold text-neutral-300"
							>
								Bonus
							</th>
							<th
								class="px-4 py-3 text-right text-xs font-semibold text-neutral-300"
							>
								Jumlah
							</th>
							<th
								class="px-4 py-3 text-center text-xs font-semibold text-neutral-300"
							>
								Tanggal/Waktu WIB
							</th>
							<th
								class="px-4 py-3 text-center text-xs font-semibold text-neutral-300"
							>
								Status
							</th>
							<th
								class="px-4 py-3 text-center text-xs font-semibold text-neutral-300"
							>
								Alasan
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="transaction in filteredTransactions"
							:key="transaction.id"
							class="border-b border-neutral-800 transition-colors hover:bg-neutral-800/50"
						>
							<td class="px-4 py-3 text-xs text-neutral-300">
								{{ transaction.reference_number }}
							</td>
							<td class="px-4 py-3 text-xs text-neutral-300">
								{{ getTypeText(transaction.transaction_type) }}
							</td>
							<td class="px-4 py-3 text-right text-xs text-neutral-300">
								{{ formatCurrency(transaction.amount) }}
							</td>
							<td class="px-4 py-3 text-right text-xs text-neutral-300">
								0.00
							</td>
							<td class="px-4 py-3 text-right text-xs text-neutral-300">
								0.00
							</td>
							<td class="px-4 py-3 text-right text-xs font-semibold text-white">
								{{ formatCurrency(transaction.amount) }}
							</td>
							<td class="px-4 py-3 text-center text-xs text-neutral-300">
								{{ formatDate(transaction.created_at) }}
							</td>
							<td class="px-4 py-3 text-center">
								<span
									:class="
										cn(
											'inline-block rounded-full px-3 py-1 text-xs font-semibold',
											getStatusColor(transaction.status),
										)
									"
								>
									{{ getStatusText(transaction.status) }}
								</span>
							</td>
							<td class="px-4 py-3 text-center text-xs text-neutral-400">
								{{ transaction.admin_notes || "-" }}
							</td>
						</tr>

						<!-- Empty State -->
						<tr v-if="filteredTransactions.length === 0">
							<td colspan="9" class="px-4 py-12 text-center">
								<div class="text-sm text-neutral-400">
									Tidak ada data transaksi
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Totals -->
			<div class="border-t border-neutral-700 bg-neutral-800 px-4 py-3">
				<div class="flex items-center justify-between text-sm">
					<div class="flex gap-8">
						<div>
							<span class="text-neutral-400">SUB TOTAL:</span>
							<span class="ml-2 font-semibold text-white">
								{{ formatCurrency(totals.totalAmount) }}
							</span>
						</div>
						<div>
							<span class="text-neutral-400">GRAND TOTAL:</span>
							<span class="ml-2 font-semibold text-yellow-400">
								{{ formatCurrency(totals.grandTotal) }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer Info -->
			<div class="bg-neutral-800 px-4 py-3 text-xs text-neutral-400">
				Laporan ini menunjukkan data dari pukul
				<span class="font-semibold text-white">{{
					formatDate(new Date().toISOString())
				}}</span>
				pada tanggal
				<span class="font-semibold text-white">
					{{ new Date().toLocaleDateString("id-ID") }}
				</span>
			</div>
		</div>

		<!-- Cards Mobile -->
		<div class="space-y-3 lg:hidden">
			<div
				v-for="transaction in filteredTransactions"
				:key="transaction.id"
				class="rounded-lg border border-neutral-700 bg-neutral-900 p-4"
			>
				<div class="mb-3 flex items-start justify-between">
					<div>
						<div class="text-xs text-neutral-400">Nomor Tiket</div>
						<div class="font-mono text-sm font-semibold text-white">
							{{ transaction.reference_number }}
						</div>
					</div>
					<span
						:class="
							cn(
								'inline-block rounded-full px-3 py-1 text-xs font-semibold',
								getStatusColor(transaction.status),
							)
						"
					>
						{{ getStatusText(transaction.status) }}
					</span>
				</div>

				<div class="space-y-2">
					<div class="flex justify-between text-xs">
						<span class="text-neutral-400">Tipe:</span>
						<span class="font-medium text-white">
							{{ getTypeText(transaction.transaction_type) }}
						</span>
					</div>
					<div class="flex justify-between text-xs">
						<span class="text-neutral-400">Jumlah:</span>
						<span class="font-semibold text-yellow-400">
							{{ formatCurrency(transaction.amount) }}
						</span>
					</div>
					<div class="flex justify-between text-xs">
						<span class="text-neutral-400">Tanggal:</span>
						<span class="text-white">{{
							formatDate(transaction.created_at)
						}}</span>
					</div>
					<div
						v-if="transaction.admin_notes"
						class="flex justify-between text-xs"
					>
						<span class="text-neutral-400">Alasan:</span>
						<span class="text-white">{{ transaction.admin_notes }}</span>
					</div>
				</div>
			</div>

			<!-- Empty State Mobile -->
			<div
				v-if="filteredTransactions.length === 0"
				class="rounded-lg bg-neutral-900 py-12 text-center"
			>
				<div class="text-sm text-neutral-400">Tidak ada data transaksi</div>
			</div>

			<!-- Totals Mobile -->
			<div class="rounded-lg bg-neutral-800 p-4">
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-neutral-400">SUB TOTAL:</span>
						<span class="font-semibold text-white">
							{{ formatCurrency(totals.totalAmount) }}
						</span>
					</div>
					<div class="flex justify-between border-t border-neutral-700 pt-2">
						<span class="text-neutral-400">GRAND TOTAL:</span>
						<span class="font-semibold text-yellow-400">
							{{ formatCurrency(totals.grandTotal) }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
	height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: #1a1a1a;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: #4a5568;
	border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
	background: #718096;
}
</style>
