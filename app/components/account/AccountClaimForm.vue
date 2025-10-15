<script setup lang="ts">
const date = new Date("2025-10-15T12:51:40Z");
const formattedDate = date.toLocaleString("id-ID", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

const form = reactive({
	category: "semua",
	type: "semua",
});

const categoryOptions = [
	{
		label: "Semua",
		value: "semua",
	},
	{
		label: "Setiap Hari",
		value: "setiap_hari",
	},
	{
		label: "Pendaftaran",
		value: "pendaftaran",
	},
];
const typeOptions = [
	{
		label: "Semua",
		value: "semua",
	},
	{
		label: "Promosi",
		value: "promosi",
	},
	{
		label: "Bonus",
		value: "bonus",
	},
	{
		label: "Slots",
		value: "slots",
	},
	{
		label: "Arcade",
		value: "arcade",
	},
];
</script>
<template>
	<form class="w-full space-y-6 rounded-lg bg-neutral-900 p-2 lg:p-4">
		<div class="w-full space-y-3 rounded-lg bg-neutral-800 p-4">
			<h3 class="font-medium text-white">Catatan:</h3>
			<ul
				class="w-full list-inside list-decimal space-y-2 ps-2 text-sm leading-none tracking-tighter text-neutral-200"
			>
				<li>
					Promosi ini tidak bisa dikombinasikan dengan promosi lainnya dan
					promosi ini bisa kedaluarsa.
				</li>
				<li>
					Cek progress promosi dan klaim tidak tersedia dari jam 02:00 - 07:00!
				</li>
				<li>
					Bonus sedang disimpan sementara selama
					<span class="font-bold text-white">30 menit</span> dari
					<span class="font-bold text-white">{{ formattedDate }}</span>
				</li>
			</ul>
		</div>
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div class="w-full">
				<div class="w-full space-y-3 rounded-lg bg-neutral-800 p-4">
					<div class="flex w-full items-center justify-between">
						<div class="text-xs font-medium text-white">Kategori</div>
						<div class="text-xs font-medium text-white">
							<span class="text-red-500">*</span>
						</div>
					</div>
					<div class="flex w-full items-center justify-between">
						<select
							v-model="form.category"
							class="w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						>
							<option
								v-for="item in categoryOptions"
								:key="item.value"
								:value="item.value"
							>
								{{ item.label }}
							</option>
						</select>
					</div>
				</div>
			</div>
			<div class="w-full">
				<div class="w-full space-y-3 rounded-lg bg-neutral-800 p-4">
					<div class="flex w-full items-center justify-between">
						<div class="text-xs font-medium text-white">Jenis</div>
						<div class="text-xs font-medium text-white">
							<span class="text-red-500">*</span>
						</div>
					</div>
					<div class="flex w-full items-center justify-between">
						<select
							v-model="form.type"
							class="w-full rounded-md border border-neutral-600 bg-black text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						>
							<option
								v-for="item in typeOptions"
								:key="item.value"
								:value="item.value"
							>
								{{ item.label }}
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full space-y-5 border-b border-neutral-700 pb-4">
			<h1 class="text-lg font-medium text-white">Klaim Bonus</h1>
		</div>
		<div class="grid">
			<div class="flex w-full items-center justify-between">
				<div
					class="flex items-center justify-center rounded-md rounded-br-none rounded-bl-none bg-neutral-800 px-2 py-1 text-xs font-medium text-white"
				>
					Setiap Hari
				</div>
				<div
					class="flex items-center justify-center rounded-md rounded-br-none rounded-bl-none bg-amber-500 px-2 py-1 text-xs font-medium text-white"
				>
					Tidak Memenuhi Syarat
				</div>
			</div>
			<div
				class="rounded-lg rounded-tl-none rounded-tr-none bg-neutral-950 p-4"
			>
				<div class="text-sm font-medium text-white">
					BONUS DEPOSIT HARIAN
					<span class="font-bold text-yellow-400">5% (SLOTS)</span>
				</div>
				<div class="mt-5 flex w-full flex-col items-center justify-center">
					<Progress
						:max="100"
						:value="0.0"
						class="h-3 w-full rounded-full bg-neutral-700"
					></Progress>
					<div class="text-sm font-medium text-white">
						<span class="text-xs text-white"
							>Perkembangan:
							<span class="font-bold text-yellow-400">0.0%</span></span
						>
					</div>
				</div>
			</div>
		</div>
		<div class="grid">
			<div class="flex w-full items-center justify-between">
				<div
					class="flex items-center justify-center rounded-md rounded-br-none rounded-bl-none bg-neutral-800 px-2 py-1 text-xs font-medium text-white"
				>
					Pendaftaran
				</div>
				<div
					class="flex items-center justify-center rounded-md rounded-br-none rounded-bl-none bg-amber-500 px-2 py-1 text-xs font-medium text-white"
				>
					Tidak Memenuhi Syarat
				</div>
			</div>
			<div
				class="rounded-lg rounded-tl-none rounded-tr-none bg-neutral-950 p-4"
			>
				<div class="text-sm font-medium text-white">
					PROMO BONUS MEMBER BARU
					<span class="font-bold text-yellow-400">20% (SLOT & ARCADE)</span>
				</div>
				<div class="mt-5 flex w-full flex-col items-center justify-center">
					<Progress
						:max="100"
						:value="0.0"
						class="h-3 w-full rounded-full bg-neutral-700"
					></Progress>
					<div class="text-sm font-medium text-white">
						<span class="text-xs text-white"
							>Perkembangan:
							<span class="font-bold text-yellow-400">0.0%</span></span
						>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>
