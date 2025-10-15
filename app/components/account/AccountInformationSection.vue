<script setup lang="ts">
const route = useRoute();

const { $profileState, $refreshProfile } = useNuxtApp();

const queryQName = computed(() => route.query.q as string);
const queryTName = computed(() => route.query.t as string);

const isProfileLoading = ref(false);
const activeTab = ref<string>(queryTName.value);

const accountTabMenuItems: AccountTabMenu[] = [
	{
		name: "AKUN SAYA",
		path_url: "/account?q=main&t=summary",
		main_query: "main",
		sub_query: "summary",
	},
	{
		name: "UBAH PROFIL",
		path_url: "/account?q=main&t=profile-update",
		main_query: "main",
		sub_query: "profile-update",
	},
	{
		name: "UBAH KATA SANDI",
		path_url: "/account?q=main&t=password-update",
		main_query: "main",
		sub_query: "password-update",
	},
	{
		name: "BANKING ACCOUNT",
		path_url: "/account?q=main&t=banking-update",
		main_query: "main",
		sub_query: "banking-update",
	},
];

const handleRefresh = async () => {
	isProfileLoading.value = true;
	await $refreshProfile();
	setTimeout(() => {
		isProfileLoading.value = false;
	}, 1000);
};

const handleTabClick = (item: AccountTabMenu) => {
	activeTab.value = item.sub_query;
	// console.log("Tab clicked:", activeTab.value);
};
</script>
<template>
	<div class="animate-page-grow rounded-lg p-0 lg:p-6">
		<!-- Wallet Info -->
		<div
			class="mb-6 flex items-center justify-between border-b border-neutral-800 pb-4"
		>
			<div>
				<h2 class="text-lg text-white">
					Central Wallet <span class="font-bold">(IDR)</span>
				</h2>
				<p
					class="text-xl font-bold text-yellow-500"
					:class="{ 'opacity-50': isProfileLoading }"
				>
					{{ formatBalanceWithCurrency($profileState?.balance) }}
				</p>
			</div>
			<button
				class="cursor-pointer text-yellow-500 hover:text-white active:scale-95"
				:class="{ 'animate-spin': isProfileLoading }"
				@click="handleRefresh()"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>
		</div>

		<!-- Quick Links -->
		<AccountProfileQuickLink />

		<!-- Status Cards -->
		<AccountProfileStatsCard
			v-if="
				queryTName === 'summary' ||
				queryTName === 'profile-update' ||
				queryTName === 'password-update' ||
				queryTName === 'banking-update'
			"
		/>

		<!-- Tabs -->
		<AccountTabMenu
			v-if="
				queryTName === 'summary' ||
				queryTName === 'profile-update' ||
				queryTName === 'password-update' ||
				queryTName === 'banking-update'
			"
			:menu-items="accountTabMenuItems"
			:active-menu="activeTab"
			@menu-click="handleTabClick"
		/>

		<!-- Account Info Content -->
		<div
			v-if="queryTName === 'summary'"
			class="grid grid-cols-1 gap-6 lg:grid-cols-2"
		>
			<div>
				<h3 class="mb-4 flex items-center justify-between font-bold text-white">
					INFORMASI AKUN
					<button
						class="rounded-full bg-yellow-500 px-4 py-1 text-xs font-semibold text-black hover:bg-yellow-600"
					>
						RIWAYAT PERUBAHAN
					</button>
				</h3>
				<div class="space-y-3 rounded-lg bg-[#2a2a2a] p-4">
					<div class="flex justify-between">
						<span class="text-sm font-medium text-neutral-400"
							>NAMA LENGKAP :</span
						>
						<span class="text-xs font-semibold text-white">
							{{ $profileState?.full_name }}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-neutral-400">EMAIL :</span>
						<div class="flex items-center gap-2">
							<span
								v-if="!$profileState?.email"
								class="rounded bg-red-600 px-2 py-1 text-xs text-white"
								>⚠ Alamat email belum di buat</span
							>
							<span v-else class="text-xs font-semibold text-white">{{
								$profileState?.email
							}}</span>
						</div>
					</div>
					<div class="flex justify-between">
						<span class="text-sm font-medium text-neutral-400"
							>NAMA PENGGUNA :</span
						>
						<span class="text-xs font-semibold text-white">{{
							$profileState?.username
						}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-sm font-medium text-neutral-400"
							>MATA UANG :</span
						>
						<span class="text-xs font-semibold text-white">IDR</span>
					</div>
				</div>
			</div>

			<div>
				<h3 class="mb-4 font-bold text-white">Detail Perbankan</h3>
				<div class="rounded-lg bg-[#2a2a2a] p-4">
					<div class="mb-4 flex items-start justify-between">
						<div>
							<p class="mb-1 text-sm text-neutral-400">
								{{ $profileState?.bank_account_name }}
							</p>
							<p class="font-mono text-2xl tracking-wider text-white">
								{{ $profileState?.bank_account_number }}
							</p>
						</div>
						<button class="text-neutral-400 hover:text-white">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
								<path
									d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"
								/>
							</svg>
						</button>
					</div>
					<div
						class="border-t border-neutral-700 pt-3 text-sm font-bold text-yellow-500 uppercase"
					>
						{{ $profileState?.payment_type }}
					</div>
				</div>
			</div>
		</div>
		<ChangeProfileInfo v-if="queryTName === 'profile-update'" />
		<ChangePassword v-if="queryTName === 'password-update'" />
		<ChangeBankAccount v-if="queryTName === 'banking-update'" />

		<div
			v-if="queryTName === 'referral'"
			class="flex w-full flex-col gap-5 rounded-lg bg-neutral-900 p-2 lg:p-5"
		>
			<img
				src="/images/account/banner-referral-01.webp"
				alt=""
				class="w-full"
			/>
			<div class="text-sm text-neutral-50">
				Sekali ID Anda terverifikasi, Anda dapat menikmati manfaat penuh dari
				program referral kami:
			</div>
			<div class="grid gap-3">
				<div class="flex items-center gap-2">
					<div
						class="h-8 w-8 rounded-md bg-gradient-to-l from-[#fbeb8c] to-[#9d7e39] p-1.5"
					>
						<img src="/images/account/referral-commission.svg" alt="" />
					</div>
					<div class="space-y-1">
						<div class="text-sm font-medium text-neutral-50">
							Komisi Referral
						</div>
						<p class="text-xs text-[#e5d177]">
							Tarik komisi dari referral yang sudah Anda miliki sebelumnya dan
							nikmati hasilnya.
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<div
						class="h-8 w-8 rounded-md bg-gradient-to-l from-[#fbeb8c] to-[#9d7e39] p-1.5"
					>
						<img src="/images/account/referral-sharing.svg" alt="" />
					</div>
					<div class="space-y-1">
						<div class="text-sm font-medium text-neutral-50">
							Kemudahan Berbagi Referral
						</div>
						<p class="text-xs text-[#e5d177]">
							Berbagi kode referral Anda ke player lain dengan mudah dan cepat.
						</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<div
						class="h-8 w-8 rounded-md bg-gradient-to-l from-[#fbeb8c] to-[#9d7e39] p-1.5"
					>
						<img src="/images/account/referral-sharing.svg" alt="" />
					</div>
					<div class="space-y-1">
						<div class="text-sm font-medium text-neutral-50">
							Ringkasan Referral
						</div>
						<p class="text-xs text-[#e5d177]">
							Lihat ringkasan mengenai progress dari hasil referral Anda.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
