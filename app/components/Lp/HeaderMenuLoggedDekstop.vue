<script setup lang="ts">
const emits = defineEmits<{
	(e: "opensidebar", value: boolean): void;
	(e: "opensearch", value: boolean): void;
	(s: "onsignout"): Promise<void>;
}>();

const { $profileState, $refreshProfile } = useNuxtApp();
</script>
<template>
	<div class="hidden justify-end space-y-4 lg:block">
		<div class="flex items-center justify-center gap-5">
			<NuxtLink
				to="/account?q=main&t=summary"
				class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
			>
				<icon
					name="material-symbols:account-circle"
					class="text-2xl font-bold"
				/>
				<div class="text-xs text-nowrap text-neutral-100">Akun Saya</div>
			</NuxtLink>
			<NuxtLink
				to="/account?q=finance&t=deposit"
				class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
			>
				<icon name="ic:round-add-card" class="text-2xl font-bold" />
				<div class="text-xs text-nowrap text-neutral-100">Deposit</div>
			</NuxtLink>
			<NuxtLink
				to="/account?q=messages&t=inbox"
				class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
			>
				<icon name="ic:baseline-mail" class="text-2xl font-bold" />
				<div class="text-xs text-nowrap text-neutral-100">Kotak Masuk</div>
			</NuxtLink>
			<NuxtLink
				to="/account?q=finance&t=withdrawal"
				class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
			>
				<icon name="ci:transfer" class="text-2xl font-bold" />
				<div class="text-xs text-nowrap text-neutral-100">Penarikan</div>
			</NuxtLink>
			<div class="relative">
				<NuxtLink
					to="/account?q=messages&t=announcement"
					class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
				>
					<icon name="ic:baseline-notifications" class="text-2xl font-bold" />
					<div class="text-xs text-nowrap text-neutral-100">Pengumuman</div>
				</NuxtLink>
				<div
					class="absolute top-0 right-6 flex h-3 w-3 items-center justify-center rounded-full bg-neutral-600 text-[10px] text-white"
				>
					0
				</div>
			</div>
			<button
				class="flex cursor-pointer flex-col items-center justify-center text-white transition-all active:scale-95"
				@click="emits('onsignout')"
			>
				<icon name="ic:round-exit-to-app" class="text-2xl font-bold" />
				<div class="text-xs text-nowrap text-neutral-100">Keluar</div>
			</button>
		</div>
		<div class="flex items-center justify-center gap-5">
			<NuxtLink
				to="/account?q=loyalty&t=benefits"
				class="flex cursor-pointer items-center justify-center gap-1 text-white transition-all active:scale-95"
			>
				<img src="/images/badge/bronze.svg" class="h-8 w-8 object-fill" />
				<div class="text-xs text-neutral-100">
					{{ $profileState?.username }}
				</div>
			</NuxtLink>
			<Saldo :profile="$profileState" @refresh="$refreshProfile" />
			<NuxtLink
				to="/account?q=loyalty&t=rewards"
				class="flex cursor-pointer items-center justify-center gap-2 text-white transition-all active:scale-95"
			>
				<div class="rounded-md bg-amber-500 px-2 text-xs font-bold">LP</div>
				<div class="text-xs text-amber-500">0</div>
			</NuxtLink>
			<RewardDialog />
			<button
				class="flex cursor-pointer items-center justify-center text-white transition-all active:scale-95"
				@click="emits('opensearch', true)"
			>
				<svg
					width="17"
					height="17"
					viewBox="0 0 17 17"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16.1211 14.1851L12.4426 10.5063C13.0676 9.51126 13.4303 8.3352 13.4303 7.07307C13.4303 3.50232 10.5356 0.608032 6.96503 0.608032C3.39442 0.608032 0.5 3.50232 0.5 7.07307C0.5 10.6439 3.39429 13.538 6.96503 13.538C8.33856 13.538 9.6108 13.1085 10.6577 12.3789L14.2924 16.0139C14.545 16.2662 14.8761 16.3918 15.2068 16.3918C15.5378 16.3918 15.8685 16.2662 16.1215 16.0139C16.6262 15.5086 16.6262 14.6902 16.1211 14.1851ZM6.96503 11.4434C4.55162 11.4434 2.59498 9.48688 2.59498 7.07333C2.59498 4.65979 4.55162 2.70315 6.96503 2.70315C9.37858 2.70315 11.3351 4.65979 11.3351 7.07333C11.3351 9.48688 9.37858 11.4434 6.96503 11.4434Z"
						fill="#fff"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>
