import { z } from "zod";

export const register = z
	.object({
		name: z
			.string({ required_error: "Name harus diisi" })
			.min(3, "Nama harus minimal 3 karakter")
			.nonempty("Name harus diisi"),
		email: z
			.string({ required_error: "Email harus diisi" })
			.email("Email tidak valid")
			.nonempty("Email harus diisi"),
		username: z
			.string({ required_error: "Username harus diisi" })
			.min(3, "Nama pengguna harus minimal 3 karakter")
			.regex(
				/^[a-z0-9]+$/,
				"Nama pengguna harus berupa huruf kecil dan angka saja, tanpa spasi",
			)
			.nonempty("Username harus diisi"),

		password: z
			.string({ required_error: "Password harus diisi" })
			.min(1, { message: "Password harus diisi" })
			.min(6, { message: "Kata sandi harus minimal 6 karakter" })
			.regex(/[A-Z]/, {
				message: "Harus mengandung setidaknya satu huruf kapital",
			})
			.regex(/[0-9]/, { message: "Harus mengandung setidaknya satu nomor" })
			.transform((value) => value.replaceAll(/\s+/g, "")),

		confirm_password: z
			.string({ required_error: "Konfirmasi kata sandi harus diisi" })
			.nonempty({ message: "Konfirmasi kata sandi harus diisi" }),

		phone: z
			.string({ required_error: "Phone harus diisi" })
			.regex(
				/^\+\d{1,4}\d{6,14}$/,
				"Telepon harus dimulai dengan kode negara (misalnya, +62) dan hanya berisi angka",
			)
			.min(8, "Nomor telepon terlalu pendek")
			.max(16, "Nomor telepon terlalu panjang"),

		whatsapp: z
			.string({ required_error: "WhatsApp harus diisi" })
			.regex(
				/^\+\d{1,4}\d{6,14}$/,
				"WhatsApp harus dimulai dengan kode negara (misalnya, +62) dan hanya berisi angka",
			)
			.min(8, "WhatsApp telepon terlalu pendek")
			.max(16, "WhatsApp telepon terlalu panjang"),

		referral_code: z.string().optional().or(z.literal("")),
		payment_type: z.enum(["bank", "e-money"]).default("bank"),
		payment_method: z
			.string({ required_error: "Metode pembayaran harus diisi" })
			.min(2, "Nama harus minimal 2 karakter")
			.nonempty("Metode pembayaran harus diisi"),
		bank_account_number: z
			.string()
			.regex(/^\d+$/, "Nomor rekening harus berupa angka")
			.min(5, "Nomor rekening terlalu pendek")
			.max(20, "Nomor rekening terlalu panjang"),
		bank_account_name: z
			.string({
				required_error: "Nama lengkap hanya boleh berisi karakter alfanumerik.",
			})
			.min(2, "Nama harus minimal 2 karakter")
			.nonempty("Nama akun bank harus diisi"),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirm_password) {
			ctx.addIssue({
				path: ["confirm_password"],
				code: z.ZodIssueCode.custom,
				message: "Konfirmasi kata sandi tidak cocok",
			});
		}
		if (data.payment_type === "bank") {
			// Validasi bank account number harus angka
			if (data.bank_account_number) {
				if (!/^\d+$/.test(data.bank_account_number)) {
					ctx.addIssue({
						path: ["bank_account_number"],
						code: z.ZodIssueCode.custom,
						message: "Nomor rekening harus berupa angka",
					});
				}

				if (data.bank_account_number.length < 5) {
					ctx.addIssue({
						path: ["bank_account_number"],
						code: z.ZodIssueCode.custom,
						message: "Nomor rekening terlalu pendek",
					});
				}

				if (data.bank_account_number.length > 20) {
					ctx.addIssue({
						path: ["bank_account_number"],
						code: z.ZodIssueCode.custom,
						message: "Nomor rekening terlalu panjang",
					});
				}
			} else {
				ctx.addIssue({
					path: ["bank_account_number"],
					code: z.ZodIssueCode.custom,
					message: "Nomor rekening harus diisi untuk transfer bank",
				});
			}

			// Validasi bank account name harus sama dengan name
			if (data.bank_account_name) {
				if (
					data.bank_account_name.trim().toLowerCase() !==
					data.name.trim().toLowerCase()
				) {
					ctx.addIssue({
						path: ["bank_account_name"],
						code: z.ZodIssueCode.custom,
						message:
							"Nama pemilik rekening harus sama dengan nama lengkap Anda",
					});
				}
			} else {
				ctx.addIssue({
					path: ["bank_account_name"],
					code: z.ZodIssueCode.custom,
					message: "Nama pemilik rekening harus diisi untuk transfer bank",
				});
			}
		}
	});

const login = z.object({
	// Identifier bisa email atau username
	identifier: z
		.string({ required_error: "Email atau Username harus diisi" })
		.min(3, "Email atau Username minimal 3 karakter")
		.nonempty("Email atau Username harus diisi"),

	password: z
		.string({ required_error: "Password harus diisi" })
		.min(1, { message: "Password harus diisi" })
		.min(6, { message: "Kata sandi harus minimal 6 karakter" })
		.transform((value) => value.replaceAll(/\s+/g, "")),
});

export const loginSchema = toTypedSchema(login);
export const registerSchema = toTypedSchema(register);

export type LoginSchema = z.infer<typeof login>;
export type RegisterSchema = z.infer<typeof register>;
