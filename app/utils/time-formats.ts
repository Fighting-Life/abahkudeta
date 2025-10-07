export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("id-ID", {
		weekday: "short", // "Rab"
		day: "2-digit", // "24"
		month: "short", // "Sep"
		year: "numeric", // "2025"
		hour: "2-digit", // "08"
		minute: "2-digit", // "54"
		second: "2-digit", // "27"
		hour12: false, // 24 jam format
	})
		.format(date)
		.replace(/,/g, "") // Hapus koma
		.replace(/:/g, ".") // Ganti : dengan .
		.replace(/\s+/g, " "); // Normalize spaces
};
