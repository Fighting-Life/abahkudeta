<script setup lang="ts">
const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const props = defineProps<{
	open: boolean;
}>();

const modelValue = useVModel(props, "open", emits, {
	passive: true,
});

const qrCodeUrl = ref(
	"https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png",
);

// Function untuk handle close
const handleClose = () => {
	modelValue.value = false;
};

async function downloadFileInBrowser(): Promise<void> {
	try {
		const response = await fetch(qrCodeUrl.value);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const blob = await response.blob();
		const blobUrl = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.style.display = "none";
		a.href = blobUrl;
		a.download = "qris-eon.jpg";

		document.body.appendChild(a);
		a.click();

		window.URL.revokeObjectURL(blobUrl);
		document.body.removeChild(a);
	} catch (error) {
		console.error(`Gagal mengunduh file dari ${qrCodeUrl.value}:`, error);
		alert("Gagal mengunduh gambar. Silakan coba lagi.");
	} finally {
		setTimeout(() => {
			handleClose(); // ✅ Gunakan handleClose
		}, 1000);
	}
}
</script>

<template>
	<Teleport to="body">
		<div
			v-if="modelValue"
			class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
			@click="handleClose"
		>
			<div class="relative">
				<button
					class="absolute top-4 right-4 cursor-pointer text-2xl text-white"
					@click="handleClose"
				>
					<Icon name="iconamoon:close-bold" />
				</button>
				<div class="w-full max-w-md rounded-lg bg-neutral-900 p-8" @click.stop>
					<h3 class="mb-2 text-center text-lg font-semibold text-white">
						Deposit QRIS EON
					</h3>
					<img :src="qrCodeUrl" alt="QRIS EON" class="mx-auto" />
					<div class="mt-4 text-center text-sm text-white">
						<p>
							Scan QRIS EON di atas menggunakan aplikasi bank atau e-money anda.
						</p>
					</div>
					<div class="mt-4 text-start text-sm text-white">Catatan :</div>
					<ul class="mt-4 list-decimal ps-6 text-start text-sm text-[#fbeb8c]">
						<li>
							<p>Deposit minimal 50.000</p>
						</li>
						<li>
							<p>Deposit maksimal 20.000.000</p>
						</li>
					</ul>
					<div class="mt-4 text-center text-sm text-white">
						<p>Atau</p>
					</div>
					<div class="mt-6 flex w-full items-center justify-center px-10">
						<button
							class="inline-flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] px-10 py-3 text-sm font-semibold text-white uppercase transition-colors hover:bg-yellow-500 active:scale-95"
							@click="downloadFileInBrowser()"
						>
							DOWNLOAD QRIS
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
