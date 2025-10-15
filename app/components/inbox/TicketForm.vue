<script setup lang="ts">
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-vue-next";

const toast = useToast();

const { errors, handleSubmit, isSubmitting, resetForm, setFieldValue } =
	useForm({
		validationSchema: createNewTicketSchema,
		initialValues: {
			subject: "",
			type: "game",
			message: "",
			attachment: [],
			attachmentPreview: [],
		},
	});

const submit = handleSubmit(async (values) => {
	try {
		const formData = new FormData();
		formData.append("subject", values.subject);
		formData.append("type", values.type);
		formData.append("message", values.message);

		// Append files dari uploadedFiles.value
		if (uploadedFiles.value.length > 0) {
			uploadedFiles.value.forEach((item, index) => {
				formData.append("attachment", item.file);
			});
		}

		const { success, message, data } = await $fetch(
			"/api/messages/ticket/new",
			{
				method: "POST",
				body: formData,
			},
		);

		if (success) {
			// Reset form dan uploaded files
			uploadedFiles.value = [];
			resetForm();
			toast.success("Ticket berhasil dibuat");
		} else {
			toast.error(message || "Gagal membuat ticket");
		}
	} catch (error) {
		console.error("Submit error:", error);
		toast.error(
			error instanceof Error ? error.message : "Gagal membuat ticket",
		);
	}
});

const { value: subject } = useField<string>("subject");
const { value: type } = useField<"game" | "transaction" | "other">("type");
const { value: message } = useField<string>("message");

const isUploading = ref(false);
const uploadedFiles = ref<{ file: File; preview: string }[]>([]);

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
};

async function handleAttachmentChange(event: Event) {
	const target = event.target as HTMLInputElement;
	const files = target.files;

	if (!files || files.length === 0) return;

	const currentCount = uploadedFiles.value.length;
	const newCount = files.length;

	if (currentCount + newCount > 5) {
		toast.error("Batas maksimal upload sebanyak 5 gambar.");
		target.value = ""; // Reset input
		return;
	}

	const validTypes = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/jpg",
		"application/pdf",
	];
	const maxSize = 2 * 1024 * 1024; // 2MB

	isUploading.value = true;

	try {
		const newFiles: { file: File; preview: string }[] = [];

		for (const file of Array.from(files)) {
			// Validasi file type
			if (!validTypes.includes(file.type)) {
				toast.error(
					`File ${file.name} tidak valid. Harus berformat JPEG, PNG, WebP, atau PDF.`,
				);
				continue;
			}

			// Validasi file size
			if (file.size > maxSize) {
				toast.error(`File ${file.name} terlalu besar. Maksimal 2MB.`);
				continue;
			}

			// Validasi total files
			if (uploadedFiles.value.length + newFiles.length >= 5) {
				toast.error("Batas maksimal 5 file telah tercapai.");
				break;
			}

			// Create preview untuk images
			let preview = "";
			if (file.type.startsWith("image/")) {
				preview = await fileToBase64(file);
			} else {
				// Untuk PDF atau file non-image
				preview = "pdf-icon"; // Akan di-handle dengan icon
			}

			newFiles.push({
				file: file,
				preview: preview,
			});
		}

		// Tambahkan file baru ke uploadedFiles
		uploadedFiles.value = [...uploadedFiles.value, ...newFiles];

		// Update form field values
		updateFormFields();

		if (newFiles.length > 0) {
			toast.success(`Berhasil menambahkan ${newFiles.length} file`);
		}
	} catch (error) {
		console.error("Error processing files:", error);
		toast.error("Terjadi kesalahan saat memproses file");
	} finally {
		isUploading.value = false;
		target.value = ""; // Reset input untuk allow upload file yang sama
	}
}

function updateFormFields() {
	// Update form fields dengan data terbaru menggunakan setFieldValue
	const files = uploadedFiles.value.map((item) => item.file);
	const previews = uploadedFiles.value.map((item) => item.preview);

	setFieldValue("attachment", files);
	setFieldValue("attachmentPreview", previews);
}

function removeAttachment(index: number) {
	uploadedFiles.value.splice(index, 1);
	updateFormFields();
	toast.success("File berhasil dihapus");
}

function getFileIcon(fileType: string) {
	if (fileType.includes("pdf")) return "lucide:file-text";
	if (fileType.includes("image")) return "lucide:image";
	return "lucide:file";
}

function getFileTypeText(fileType: string) {
	if (fileType.includes("pdf")) return "PDF";
	if (fileType.includes("jpeg") || fileType.includes("jpg")) return "JPG";
	if (fileType.includes("png")) return "PNG";
	if (fileType.includes("webp")) return "WEBP";
	return "File";
}

function formatFileSize(bytes: number) {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Clear all attachments
function clearAllAttachments() {
	uploadedFiles.value = [];
	updateFormFields();
	toast.success("Semua file berhasil dihapus");
}

const typeOptions = [
	{
		label: "Permainan",
		value: "game",
	},
	{
		label: "Transaksi",
		value: "transaction",
	},
	{
		label: "Lainnya",
		value: "other",
	},
];
</script>

<template>
	<form
		class="w-full space-y-6 rounded-lg bg-neutral-950 p-2 lg:p-4"
		@submit.prevent="submit"
	>
		<div
			class="flex items-center border-b border-neutral-800 py-2 text-neutral-100"
		>
			TULIS PESAN
		</div>
		<div class="grid w-full gap-4 rounded-lg bg-neutral-800 p-4">
			<!-- Type Selection -->
			<div class="w-full space-y-3">
				<label for="type" class="text-xs font-medium text-white"
					>Perihal <span class="ml-2 text-red-500">*</span></label
				>
				<div class="flex w-full items-center justify-between">
					<select
						v-model="type"
						class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						:disabled="isSubmitting"
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
				<div class="-mt-2 h-5">
					<Transition name="fade-slide-down">
						<div v-if="errors.type" class="mt-1 text-xs text-red-400">
							{{ errors.type }}
						</div>
					</Transition>
				</div>
			</div>

			<!-- Subject -->
			<div class="-mt-5 w-full space-y-3">
				<label for="subject" class="text-xs font-medium text-white"
					>Subject <span class="ml-2 text-red-500">*</span></label
				>
				<div class="min-h-[2rem]">
					<input
						v-model="subject"
						type="text"
						name="subject"
						class="h-8 w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						autocomplete="subject"
						placeholder="Masukkan subject"
						:disabled="isSubmitting"
					/>
				</div>
				<div class="-mt-2 h-5">
					<Transition name="fade-slide-down">
						<div v-if="errors.subject" class="mt-1 text-xs text-red-400">
							{{ errors.subject }}
						</div>
					</Transition>
				</div>
			</div>

			<!-- Message -->
			<div class="-mt-5 w-full space-y-3">
				<label for="message" class="text-xs font-medium text-white"
					>Pesan <span class="ml-2 text-red-500">*</span></label
				>
				<div class="min-h-[2rem]">
					<textarea
						v-model="message"
						name="message"
						class="w-full rounded-md border border-neutral-600 bg-black px-3 py-2 text-xs text-neutral-100 ring-0 outline-none placeholder:text-neutral-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none active:border-yellow-400"
						autocomplete="message"
						rows="6"
						placeholder="Masukkan pesan"
						:disabled="isSubmitting"
					/>
				</div>
				<div class="-mt-2 h-5">
					<Transition name="fade-slide-down">
						<div v-if="errors.message" class="mt-1 text-xs text-red-400">
							{{ errors.message }}
						</div>
					</Transition>
				</div>
			</div>

			<!-- Attachment Upload -->
			<div class="-mt-5 space-y-3">
				<div class="text-xs font-medium text-white">
					Unggah Bukti
					<span class="ml-2 text-xs text-neutral-400">
						({{ uploadedFiles.length }}/5 file)
					</span>
				</div>

				<!-- Upload Button -->
				<label
					for="attachment"
					:class="
						cn(
							'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-10 py-2 text-sm font-semibold uppercase transition-colors active:scale-95',
							uploadedFiles.length >= 5 || isUploading
								? 'cursor-not-allowed bg-neutral-600 text-neutral-400'
								: 'bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] text-white hover:from-[#9d7e39] hover:to-[#fbeb8c]',
						)
					"
				>
					<LoaderCircleIcon v-if="isUploading" class="h-4 w-4 animate-spin" />
					<Icon v-else name="lucide:upload" class="h-5 w-5" />
					<span>
						{{
							isUploading
								? "Memproses..."
								: uploadedFiles.length >= 5
									? "Batas Maksimal"
									: "Pilih File"
						}}
					</span>
					<input
						id="attachment"
						type="file"
						name="attachment"
						class="hidden"
						multiple
						accept=".jpg,.jpeg,.png,.webp,.pdf"
						:disabled="isSubmitting || uploadedFiles.length >= 5 || isUploading"
						@change="handleAttachmentChange"
					/>
				</label>

				<!-- Upload Guidelines -->
				<ul
					class="list-disc rounded-md bg-neutral-950 p-2 ps-6 text-xs text-neutral-400"
				>
					<li>Format file: JPG, JPEG, PNG, WebP, PDF</li>
					<li>Ukuran maksimum: 2MB per file</li>
					<li>Batas maksimal: 5 file</li>
				</ul>

				<!-- Uploaded Files Preview -->
				<div v-if="uploadedFiles.length > 0" class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs text-neutral-400">
							File terpilih: {{ uploadedFiles.length }}
						</span>
						<button
							type="button"
							class="cursor-pointer text-xs text-red-400 transition-colors hover:text-red-300 active:scale-95"
							:disabled="isUploading"
							@click="clearAllAttachments"
						>
							Hapus Semua
						</button>
					</div>

					<div
						class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
					>
						<div
							v-for="(item, index) in uploadedFiles"
							:key="index"
							class="group relative rounded-lg border border-neutral-600 bg-neutral-900 p-3 transition-all hover:border-neutral-400"
						>
							<!-- File Preview -->
							<div class="flex flex-col items-center space-y-2">
								<!-- Image Preview -->
								<div
									v-if="item.file.type.startsWith('image/')"
									class="relative h-20 w-full overflow-hidden rounded-md"
								>
									<img
										:src="item.preview"
										:alt="item.file.name"
										class="h-full w-full object-cover"
									/>
								</div>

								<!-- PDF/File Icon -->
								<div v-else class="relative">
									<div
										class="flex h-20 w-full items-center justify-center rounded-md bg-neutral-800"
									>
										<Icon
											:name="getFileIcon(item.file.type)"
											class="h-10 w-10 text-red-400"
										/>
									</div>
								</div>

								<!-- File Info -->
								<div class="w-full space-y-0.5 text-center">
									<p
										class="truncate text-xs font-medium text-white"
										:title="item.file.name"
									>
										{{ item.file.name }}
									</p>
									<p class="text-[10px] text-neutral-400">
										{{ getFileTypeText(item.file.type) }} •
										{{ formatFileSize(item.file.size) }}
									</p>
								</div>
							</div>

							<!-- Remove Button -->
							<button
								type="button"
								class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-red-600 active:scale-95"
								:disabled="isSubmitting || isUploading"
								@click="removeAttachment(index)"
							>
								<Icon name="lucide:x" class="h-3.5 w-3.5" />
							</button>
						</div>
					</div>
				</div>

				<!-- Loading State -->
				<div v-if="isUploading" class="flex items-center justify-center py-4">
					<div class="flex items-center gap-2 text-neutral-400">
						<LoaderCircleIcon class="h-4 w-4 animate-spin" />
						<span class="text-xs">Memproses file...</span>
					</div>
				</div>

				<!-- Error State -->
				<div v-if="errors.attachment" class="text-xs text-red-400">
					{{ errors.attachment }}
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex items-center justify-center pt-4">
				<button
					type="submit"
					:class="
						cn(
							'inline-flex items-center justify-center gap-4 rounded-md bg-gradient-to-br from-[#fbeb8c] to-[#9d7e39] px-8 py-2 text-sm font-semibold text-white uppercase transition-colors hover:from-[#9d7e39] hover:to-[#fbeb8c] active:scale-95 lg:px-32',
							isSubmitting || isUploading
								? 'cursor-not-allowed opacity-70'
								: 'cursor-pointer',
						)
					"
					:disabled="isSubmitting || isUploading"
				>
					<LoaderCircleIcon v-if="isSubmitting" class="h-4 w-4 animate-spin" />
					{{ isSubmitting ? "Mengirim..." : "KIRIM PESAN" }}
				</button>
			</div>
		</div>
	</form>
</template>

<style scoped>
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
	transition: all 0.3s ease;
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
