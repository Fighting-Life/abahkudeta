<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();
const { refreshProfile } = useProfiles();

const openSearch = ref(false);
const openLogin = ref(false);
const openSidebar = ref(false);

async function handleSignOut() {
	await supabase.auth.signOut({
		scope: "global",
	});
	await refreshProfile();
	await navigateTo("/");
}
</script>
s
<template>
	<div class="sticky top-0 right-0 left-0 z-50 min-w-screen bg-gray-950">
		<div class="container mx-auto w-full lg:max-w-[1024px]">
			<div
				class="flex w-full items-center justify-between bg-gray-900 py-2.5 lg:bg-gray-950 lg:py-5"
			>
				<nuxt-link
					to="/"
					class="hidden w-full items-center justify-start lg:flex"
				>
					<NuxtImg
						src="/images/logo.png"
						alt="logo"
						class="h-7 w-auto object-fill object-center lg:h-[60px]"
					/>
				</nuxt-link>
				<div
					v-if="user"
					class="flex w-full items-center justify-end gap-3 lg:gap-5"
				>
					<HeaderMenuLoggedDekstop
						@onsignout="handleSignOut"
						@opensearch="(e) => (openSearch = e)"
					/>
					<HeaderMenuLoggedMobile @opensidebar="(e) => (openSidebar = e)" />
				</div>
				<div
					v-else
					class="flex w-full items-center justify-between px-2 lg:justify-end lg:px-0"
				>
					<NuxtLink to="/" class="flex items-center justify-center lg:hidden">
						<NuxtImg
							src="/images/logo.png"
							alt="logo"
							class="h-7 w-auto object-fill sm:h-7"
						/>
					</NuxtLink>
					<div class="flex items-center justify-center gap-3 lg:gap-5">
						<button
							class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2b2b2b] px-5 py-1 text-[11px] font-bold text-white uppercase transition-all hover:bg-gray-50 hover:text-gray-900 active:scale-95 lg:px-10 lg:py-2 lg:text-sm"
							@click="openLogin = true"
						>
							Masuk
						</button>
						<NuxtLink
							to="/register"
							class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-solid border-[#e5d177] bg-gray-950 px-5 py-1 text-[11px] font-bold text-[#e5d177] uppercase transition-all active:scale-95 lg:px-10 lg:py-2 lg:text-sm"
						>
							Daftar
						</NuxtLink>
						<button
							class="hidden cursor-pointer items-center justify-center text-white transition-all active:scale-95 lg:flex"
							@click="openSearch = true"
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
						<button
							class="flex cursor-pointer items-center justify-center text-white transition-all active:scale-95 lg:hidden"
							@click="openSidebar = true"
						>
							<icon name="ic:sharp-menu" class="text-2xl font-bold" />
						</button>
					</div>
				</div>
			</div>
		</div>
		<HeroTop />
		<MobileSidebar
			v-model:open="openSidebar"
			@update:open="openSidebar = false"
			@open-login="openLogin = true"
			@open-search="openSearch = true"
		/>
		<login-modal v-model:open="openLogin" @update:open="openLogin = false" />
		<search-modal v-model:open="openSearch" @update:open="openSearch = false" />
	</div>
</template>
<style scoped></style>
