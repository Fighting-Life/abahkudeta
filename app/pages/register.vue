<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const route = useRoute();

definePageMeta({
	middleware: "guest",
	layout: "default",
	name: "register",
	path: "/register",
});
useSeoMeta({
	title: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	description:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	robots: "index, follow",
	keywords:
		"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
	ogTitle: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	ogDescription:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	ogImage: "https://static.geekschip.com/data/category_images/1647524654_0.jpg",
	ogUrl: route.fullPath,
	twitterCard: "summary_large_image",
	twitterTitle: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
	twitterDescription:
		"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
	twitterImage:
		"https://static.geekschip.com/data/category_images/1647524654_0.jpg",
	twitterSite: "@kudetabet98",
	twitterCreator: "@kudetabet98",
});
useHead({
	link: [
		{
			rel: "canonical",
			href: route.fullPath,
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "32x32",
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "icon",
			href: `/favicon.png`,
			sizes: "512x512",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "192x192",
		},
		{
			rel: "apple-touch-icon",
			href: `/favicon.png`,
			sizes: "180x180",
		},
		{
			rel: "shortcut icon",
			type: "image/x-icon",
			href: `/favicon.png`,
		},
	],
	meta: [
		// Open Graph tambahan untuk social media
		{ property: "og:type", content: "website" }, // Atau "artikel" untuk halaman artikel
		{ property: "og:url", content: route.fullPath },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:image:alt", content: "KUDETABET98" },
		{ property: "og:locale", content: "en_US" },
		{ name: "author", content: "Pixel Pedia" },
		{ name: "publisher", content: "Pixel Pedia" },
		{ name: "copyright", content: "Pixel Pedia" },
		{ name: "distribution", content: "global" },
		{ name: "rating", content: "general" },
		{ name: "revisit-after", content: "7 days" },
		{ name: "category", content: "Digital Marketing" },
		{ name: "topic", content: "KUDETABET98" },
		{
			name: "summary",
			content:
				"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
		},
		{
			name: "abstract",
			content:
				"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.",
		},
		{ name: "coverage", content: "Worldwide" },
	],
	script: [
		{
			type: "application/ld+json",
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Website",
				headline: "KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia",
				name: "KUDETABET98",
				description:
					"KUDETABET98 merupakan situs Kudetabet 98 permainan online Kudeta bet 98 terpercaya resmi dengan tampilan modern dan canggih tidak lupa dengan bonus berlimpah.", // atau summary, introdution,
				image: "/app-bg.jpg",
				url: route.fullPath,
				datePublished: "2024-01-15T08:00:00+08:00", // Gunakan createdAt artikel
				dateModified: "2024-01-15T09:20:00+08:00", // Gunakan updatedAt artikel
				author: {
					"@type": "Person",
					name: "KUDETABET98",
				},
				publisher: {
					"@type": "Organization",
					name: "KUDETABET98",
					logo: {
						"@type": "ImageObject",
						url: `/favicon.png`,
					},
				},
				keywords:
					"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": route.fullPath,
				},
				inLanguage: "en-US",
				potentialAction: {
					"@type": "ReadAction",
					target: [route.fullPath],
				},
				about: {
					"@type": "Thing",
					name: "KUDETABET98",
				},
				genre:
					"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				audience: {
					"@type": "Audience",
					audienceType:
						"KUDETABET98, KUDETABET 98, KUDETA BET 98, Kudetabet98, Kudetabet 98, Kudeta Bet 98, Situs Kudetabet98, Link Alternatif Kudetabet98, Taruhan Kudetabet98, Kudetabet98 RTP, Kudetabet98 Login, SlotHoki777, SlotKing99",
				},
				isAccessibleForFree: true,
				license: `${route.fullPath}/license`,
			}),
		},
	],
});

const toast = useToast();
const { register } = useAuthRegister();
const { checkEmail, checkUsername, checkReferralCode } = useProfiles();

const inputPassword = ref("password");
const inputConfirmPassword = ref("password");

const { handleSubmit, errors, isSubmitting, resetForm, validateField } =
	useForm({
		validationSchema: registerSchema,
	});

const { value: name } = useField<string>("name");
const { value: email } = useField<string>("email");
const { value: username } = useField<string>("username");
const { value: password } = useField<string>("password");
const { value: confirm_password } = useField<string>("confirm_password");
const { value: phone } = useField<string>("phone");
const { value: whatsapp } = useField<string>("whatsapp");
const { value: payment_type } = useField<"bank" | "e-money">("payment_type");
const { value: payment_method } = useField<string>("payment_method");
const { value: bank_account_number } = useField<string>("bank_account_number");
const { value: bank_account_name } = useField<string>("bank_account_name");
const { value: referral_code } = useField<string>("referral_code");

// Real-time validation states
const usernameAvailable = ref(true);
const checkingUsername = ref(false);
const emailAvailable = ref(true);
const checkingEmail = ref(false);
const referralCodeValid = ref(true);
const checkingReferral = ref(false);

// Debounce helper
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const debouncedEmailCheck = debounce(async (email: string) => {
	if (!email || !email.includes("@")) return;

	checkingEmail.value = true;
	try {
		emailAvailable.value = await checkEmail(email);

		if (!emailAvailable.value) {
			toast.warning(
				"Email Sudah Terdaftar! Silakan gunakan email lain atau login",
			);
		}
	} catch (error) {
		console.error("Email check error:", error);
	} finally {
		checkingEmail.value = false;
	}
}, 500);
const debouncedUsernameCheck = debounce(async (username: string) => {
	if (!username || username.length < 3) return;

	checkingUsername.value = true;
	try {
		usernameAvailable.value = await checkUsername(username);

		if (!usernameAvailable.value) {
			toast.warning("Username Sudah Digunakan! Silakan pilih username lain");
		}
	} catch (error) {
		console.error("Username check error:", error);
	} finally {
		checkingUsername.value = false;
	}
}, 500);
const debouncedReferralCheck = debounce(async (code: string) => {
	if (!code) {
		referralCodeValid.value = true;
		return;
	}

	checkingReferral.value = true;
	try {
		referralCodeValid.value = await checkReferralCode(code);

		if (!referralCodeValid.value) {
			toast.warning(
				"Kode Referral Tidak Valid! Periksa kembali kode referral Anda",
			);
		}
	} catch (error) {
		console.error("Referral check error:", error);
	} finally {
		checkingReferral.value = false;
	}
}, 500);

// Watchers
watch(email, (newValue) => {
	if (newValue) debouncedEmailCheck(newValue);
});

watch(username, (newValue) => {
	if (newValue) debouncedUsernameCheck(newValue);
});

// watch(referral_code, (newValue) => {
//   if (newValue) debouncedReferralCheck(newValue);
// });

watch(phone, (newPhone) => {
	if (newPhone && !whatsapp.value) {
		whatsapp.value = newPhone;
	}
});

watch([payment_type, payment_method], ([newPaymentType, newPaymentMethod]) => {
	if (newPaymentType && newPaymentMethod) {
		const validMethods =
			newPaymentType === "bank"
				? bankPayments.map((b) => b.value)
				: eMoneyPayments.map((e) => e.value);

		if (!validMethods.includes(newPaymentMethod)) {
			payment_method.value = "";
		}
	}
});

const submit = handleSubmit(async (values) => {
	// Pre-submit validation
	if (!emailAvailable.value) {
		toast.error("Email Sudah Terdaftar! Silakan gunakan email lain atau login");
		return;
	}

	if (!usernameAvailable.value) {
		toast.error("Username Sudah Digunakan! Silakan pilih username lain");
		return;
	}

	if (values.referral_code && !referralCodeValid.value) {
		toast.error(
			"Kode Referral Tidak Valid! Periksa kembali kode referral Anda",
		);
		return;
	}

	try {
		await register({
			email: values.email,
			username: values.username,
			password: values.password,
			name: values.name,
			phone: values.phone,
			whatsapp: values.whatsapp,
			payment_type: values.payment_type,
			payment_method: values.payment_method,
			bank_account_number: values.bank_account_number,
			bank_account_name: values.bank_account_name,
			referral_code: values.referral_code,
		});

		toast.success(
			"Registrasi Berhasil! Silakan cek email Anda untuk verifikasi.",
		);

		resetForm();
		await navigateTo("/");
	} catch (error: any) {
		let errorMessage = "Terjadi kesalahan saat registrasi";

		if (error.message?.includes("already registered")) {
			errorMessage = "Email sudah terdaftar!";
		} else if (error.message?.includes("Invalid email")) {
			errorMessage = "Format email tidak valid!";
		} else if (error.message?.includes("Password")) {
			errorMessage = "Password minimal 6 karakter!";
		} else if (error.message) {
			errorMessage = error.message;
		}

		toast.error(errorMessage);
	}
});
const formatPhoneInput = (event: Event) => {
	let value = (event.target as HTMLInputElement).value;
	value = value.replace(/[^\d+]/g, "");

	if (value.startsWith("+")) {
		value = "+" + value.slice(1).replace(/\+/g, "");
	} else {
		value = value.replace(/\+/g, "");
	}

	(event.target as HTMLInputElement).value = value;
	phone.value = value;
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

// Payment options
const paymentOptions = [
	{ value: "bank", label: "Bank" },
	{ value: "e-money", label: "E-Money" },
];

const bankPayments = [
	{ label: "BCA", value: "bca", active: false },
	{ label: "BNI", value: "bni", active: false },
	{ label: "BRI", value: "bri", active: false },
	{ label: "MANDIRI", value: "mandiri", active: false },
];

const eMoneyPayments = [
	{ label: "OVO", value: "ovo", active: false },
	{ label: "DANA", value: "dana", active: false },
	{ label: "LINKAJA", value: "linkaja", active: false },
	{ label: "GOPAY", value: "gopay", active: false },
	{ label: "QRIS", value: "qris", active: true },
];
</script>
<template>
	<div class="w-full space-y-3 pt-12 pb-5">
		<form
			class="container mx-auto max-w-[1024px] space-y-4 rounded-lg bg-gray-900 px-5 py-8 lg:px-10"
			@submit.prevent="submit"
		>
			<div class="border-b border-gray-600 py-3">
				<div class="text-gray-200">Informasi Pribadi</div>
			</div>

			<div class="grid gap-5">
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="name"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Nama Lengkap</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<!-- Input wrapper with fixed height for error -->
							<div class="min-h-[2rem]">
								<input
									v-model="name"
									type="text"
									name="name"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="name"
									placeholder="Nama Pengguna Anda"
									@blur="validateField('name')"
								/>
							</div>
							<!-- Error message container with fixed height -->
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.name" class="mt-1 text-xs text-red-400">
										{{ errors.name }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="email"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Email</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="email"
									type="email"
									name="email"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="email"
									placeholder="Email Anda"
									@blur="validateField('email')"
								/>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.email" class="mt-1 text-xs text-red-400">
										{{ errors.email }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="username"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Nama Pengguna</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="username"
									type="text"
									name="username"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="username"
									placeholder="Username Anda"
									@blur="validateField('username')"
								/>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.username" class="mt-1 text-xs text-red-400">
										{{ errors.username }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="password"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Kata Sandi</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="relative min-h-[2rem]">
								<input
									v-model="password"
									:type="inputPassword"
									name="password"
									class="h-8 w-full rounded-md border border-gray-600 bg-black pr-10 text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="current-password"
									placeholder="Kata Sandi Anda"
									@blur="validateField('password')"
								/>
								<button
									type="button"
									class="absolute top-1/2 right-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center text-yellow-400 active:scale-95"
									@click="
										inputPassword =
											inputPassword === 'password' ? 'text' : 'password'
									"
								>
									<Icon
										:name="
											inputPassword === 'password'
												? 'mdi:eye-outline'
												: 'mdi:eye-off-outline'
										"
										class="text-xl"
									/>
								</button>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.password" class="mt-1 text-xs text-red-400">
										{{ errors.password }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="confirm_password"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Ulangi Kata Sandi</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="relative min-h-[2rem]">
								<input
									v-model="confirm_password"
									:type="inputConfirmPassword"
									name="confirm_password"
									class="h-8 w-full rounded-md border border-gray-600 bg-black pr-10 text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="current-password"
									placeholder="Ulangi Kata Sandi Anda"
									@blur="validateField('confirm_password')"
								/>
								<button
									type="button"
									class="absolute top-1/2 right-2 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center text-yellow-400 active:scale-95"
									@click="
										inputConfirmPassword =
											inputConfirmPassword === 'password' ? 'text' : 'password'
									"
								>
									<Icon
										:name="
											inputConfirmPassword === 'password'
												? 'mdi:eye-outline'
												: 'mdi:eye-off-outline'
										"
										class="text-xl"
									/>
								</button>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div
										v-if="errors.confirm_password"
										class="mt-1 text-xs text-red-400"
									>
										{{ errors.confirm_password }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="phone"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Nomer Kontak</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="phone"
									type="tel"
									name="phone"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="tel"
									placeholder="Nomer Kontak Anda"
									@blur="validateField('phone')"
									@input="formatPhoneInput"
								/>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.phone" class="mt-1 text-xs text-red-400">
										{{ errors.phone }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="whatsapp"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">WhatsApp</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="whatsapp"
									type="tel"
									name="whatsapp"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="tel"
									placeholder="Nomer Whatsapp Anda"
									@blur="validateField('whatsapp')"
									@input="formatPhoneInput"
								/>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div v-if="errors.whatsapp" class="mt-1 text-xs text-red-400">
										{{ errors.whatsapp }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="referral_code"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Kode Referral</div>
						<div class="text-xs text-yellow-400"></div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<input
									v-model="referral_code"
									type="text"
									name="referral_code"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="on"
									placeholder="Kode Referral"
									@blur="validateField('referral_code')"
								/>
							</div>
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div
										v-if="errors.referral_code"
										class="mt-1 text-xs text-red-400"
									>
										{{ errors.referral_code }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="border-b border-gray-600 py-3">
				<div class="text-gray-200">Informasi Pembayaran</div>
			</div>
			<div class="grid gap-5">
				<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
					<label
						for="payment_type"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Metode Pembayaran</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<div class="min-h-[2rem]">
								<div class="flex w-full items-center gap-4 lg:gap-30">
									<label
										v-for="(item, i) in paymentOptions"
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
											@blur="validateField('payment_type')"
										/>

										<!-- Custom radio button -->
										<div class="custom-radio">
											<div class="custom-radio-inner"></div>
										</div>

										<!-- Label text -->
										<span class="custom-radio-text">
											{{ item.label }}
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
				<div
					v-if="payment_type === 'bank'"
					class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12"
				>
					<label
						for="payment_method"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">Bank</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<!-- Input wrapper with fixed height for error -->
							<div class="min-h-[2rem]">
								<select
									v-model="payment_method"
									name="payment_method"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="on"
									@blur="validateField('payment_method')"
								>
									<option value="" disabled selected>--Pilih Bank--</option>
									<option
										v-for="(item, i) in bankPayments"
										:key="i"
										:value="item.value"
										:disabled="!item.active"
									>
										{{ item.label }}
									</option>
								</select>
							</div>
							<!-- Error message container with fixed height -->
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div
										v-if="errors.payment_method"
										class="mt-1 text-xs text-red-400"
									>
										{{ errors.payment_method }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div
					v-if="payment_type === 'e-money'"
					class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12"
				>
					<label
						for="payment_method"
						class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
					>
						<div class="text-xs text-gray-200">E-Money</div>
						<div class="text-xs text-yellow-400">*</div>
					</label>
					<div class="col-span-1 lg:col-span-9">
						<div class="grid w-full">
							<!-- Input wrapper with fixed height for error -->
							<div class="min-h-[2rem]">
								<select
									v-model="payment_method"
									name="payment_method"
									class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
									autocomplete="on"
									placeholder="--Pilih E-Money--"
									@blur="validateField('payment_method')"
								>
									<option selected disabled>--Pilih E-Money--</option>
									<option
										v-for="(item, i) in eMoneyPayments"
										:key="i"
										:value="item.value"
										:disabled="!item.active"
									>
										{{ item.label }}
									</option>
								</select>
							</div>
							<!-- Error message container with fixed height -->
							<div class="h-5">
								<Transition name="fade-slide-down">
									<div
										v-if="errors.payment_method"
										class="mt-1 text-xs text-red-400"
									>
										{{ errors.payment_method }}
									</div>
								</Transition>
							</div>
						</div>
					</div>
				</div>
				<div v-if="payment_method">
					<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
						<label
							for="bank_account_number"
							class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
						>
							<div class="text-xs text-gray-200">
								Nomor {{ payment_type === "bank" ? "Rekening" : "Akun" }}
							</div>
							<div class="text-xs text-yellow-400">*</div>
						</label>
						<div class="col-span-1 lg:col-span-9">
							<div class="grid w-full">
								<!-- Input wrapper with fixed height for error -->
								<div class="min-h-[2rem]">
									<input
										v-model="bank_account_number"
										type="text"
										name="bank_account_number"
										class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
										autocomplete="on"
										:placeholder="`Nomor ${payment_type === 'bank' ? 'Rekening' : 'Akun'} Anda`"
										@blur="validateField('bank_account_number')"
										@input="formatBankNumberInput"
									/>
								</div>
								<!-- Error message container with fixed height -->
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
				<div v-if="payment_method">
					<div class="grid w-full grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-12">
						<label
							for="bank_account_name"
							class="col-span-1 flex items-start justify-between pt-2 lg:col-span-3"
						>
							<div class="text-xs text-gray-200">Nama Lengkap</div>
							<div class="text-xs text-yellow-400">*</div>
						</label>
						<div class="col-span-1 lg:col-span-9">
							<div class="grid w-full">
								<!-- Input wrapper with fixed height for error -->
								<div class="min-h-[2rem]">
									<input
										v-model="bank_account_name"
										type="text"
										name="bank_account_name"
										class="h-8 w-full rounded-md border border-gray-600 bg-black text-xs text-gray-100 ring-0 outline-none placeholder:text-gray-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
										autocomplete="name"
										placeholder="Nama Lengkap Anda"
										@blur="validateField('bank_account_name')"
									/>
								</div>
								<!-- Error message container with fixed height -->
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
					{{ isSubmitting ? "Harap tunggu..." : "DAFTAR" }}
				</button>
			</div>
			<div class="pt-3 text-center text-xs">
				Dengan klik tombol DAFTAR, saya menyatakan bahwa saya berumur diatas 18
				tahun. Saya telah membaca dan menyetujui Syarat dan Ketentuan dari
				KUDETABET98.
			</div>
			<nuxt-link
				to="/"
				class="flex items-center justify-center text-center font-semibold text-yellow-400 uppercase"
			>
				SYARAT & KETENTUAN
			</nuxt-link>
		</form>
	</div>
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
	border: 2px solid #4b5563; /* gray-600 */
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
	color: #e5e7eb; /* gray-200 */
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
	border-color: #374151; /* gray-700 */
	opacity: 0.5;
	cursor: not-allowed;
}

.hidden-radio:disabled ~ .custom-radio-text {
	color: #6b7280; /* gray-500 */
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
