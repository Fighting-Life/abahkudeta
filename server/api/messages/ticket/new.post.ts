import { H3Error, type H3Event } from "h3";
import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Database } from "~~/shared/types/database";

export default defineEventHandler(async (event) => {
	const user = await serverSupabaseUser(event);
	const client = await serverSupabaseClient<Database>(event);
	const config = useRuntimeConfig(event);

	try {
		if (!user) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			});
		}

		const { data: profile, error: profileError } = await client
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (!profile) {
			throw createError({
				statusCode: 400,
				message: "Profile not found",
			});
		}

		if (profileError) {
			throw createError({
				statusCode: 400,
				message: "Internal server error",
			});
		}

		const formDataParts = await readMultipartFormData(event);
		if (!formDataParts?.length) {
			throw createError({
				statusCode: 400,
				message: "No form data provided",
			});
		}

		let subject: string | null = null;
		let type: string | null = null;
		let message: string | null = null;
		const attachments: {
			filename: string;
			content: Uint8Array;
			contentType?: string;
		}[] = [];

		// Parse form data
		for (const part of formDataParts) {
			if (part.name === "subject") {
				subject = part.data.toString("utf-8");
			} else if (part.name === "type") {
				type = part.data.toString("utf-8");
			} else if (part.name === "message") {
				message = part.data.toString("utf-8");
			} else if (part.name === "attachment") {
				// Handle multiple attachments
				const filename = part.filename || `attachment-${Date.now()}`;
				const contentType = part.type || "application/octet-stream";

				attachments.push({
					filename: filename,
					content: part.data,
					contentType: contentType,
				});
			}
		}

		// Validation
		if (!subject || !type || !message) {
			throw createError({
				statusCode: 400,
				message: "Subject, type, and message are required",
			});
		}

		console.log("📧 Sending email with attachments:", attachments.length);

		const options: SentMessageInfo = {
			to: [...config.SmtpRecipients.split(",")],
			subject: subject,
			from: config.SmtpFrom,
			replyTo: config.SmtpReplyTo,
			text: message,
			html: createHtmlEmail(event, subject, message, profile, attachments.length),
			attachments: attachments.length > 0 ? attachments : undefined,
		};

		await emailWithNodemailerService(
			config.SmtpFrom,
			config.SmtpPass,
			config.SmtpHost,
			options,
		);

		return {
			status: 201,
			success: true,
			message: "Ticket created successfully",
			data: {
				attachmentCount: attachments.length,
			},
		};
	} catch (error) {
		console.error("❌ Error creating ticket:", error);
		throw createError({
			statusCode: 400,
			message:
				error instanceof H3Error ? error.message : "Internal server error",
		});
	}
});
async function emailWithNodemailerService(
	sender: string,
	password: string,
	service: string,
	options: SentMessageInfo,
): Promise<true> {
	if (!service) {
		throw createError({
			statusCode: 500,
			statusMessage: "Internal server error",
			data: {
				code: "SERVER_ERROR",
			},
		});
	}

	if (!sender) {
		throw createError({
			statusCode: 500,
			statusMessage: "Sender credential not specified. Aborting email send.",
			data: {
				code: "SERVER_ERROR",
			},
		});
	}

	if (!password) {
		throw createError({
			statusCode: 500,
			statusMessage: "Sender credential not specified. Aborting email send.",
			data: {
				code: "SERVER_ERROR",
			},
		});
	}

	const transporter = nodemailer.createTransport({
		service: service,
		auth: {
			user: sender,
			pass: password,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	// Verify connection
	try {
		await transporter.verify();
		console.log("✅ SMTP connection verified");
	} catch (error) {
		console.error("❌ SMTP verification failed:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to connect to email server",
			data: {
				code: "SMTP_CONNECTION_ERROR",
			},
		});
	}

	// Prepare email options
	const emailOptions = {
		from: options.from,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: options.html,
		attachments: options.attachments,
	};

	// Send email
	try {
		const info = await transporter.sendMail(emailOptions);
		console.log("✅ Email sent successfully:", info.messageId);
		console.log("📎 Attachments sent:", options.attachments?.length || 0);
		return true;
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to send email",
			data: {
				code: "EMAIL_SEND_ERROR",
			},
		});
	}
}
function createHtmlEmail(
	event: H3Event,
	subject: string,
	message: string,
	profile: Database["public"]["Tables"]["profiles"]["Row"],
	attachmentCount: number = 0,
) {
	const origin = event.headers.get("origin") || event.node.req.headers.origin || "https://kudetabet.com";

	return `
		<!doctype html>
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

		<head>
				<title>${subject}</title>
				<!--[if !mso]><!-- -->
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<!--<![endif]-->
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<style type="text/css">
						#outlook a {
								padding: 0;
						}

						.ReadMsgBody {
								width: 100%;
						}

						.ExternalClass {
								width: 100%;
						}

						.ExternalClass * {
								line-height: 100%;
						}

						body {
								margin: 0;
								padding: 0;
								-webkit-text-size-adjust: 100%;
								-ms-text-size-adjust: 100%;
						}

						table,
						td {
								border-collapse: collapse;
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
						}

						img {
								border: 0;
								height: auto;
								line-height: 100%;
								outline: none;
								text-decoration: none;
								-ms-interpolation-mode: bicubic;
						}

						p {
								display: block;
								margin: 13px 0;
						}
				</style>
				<!--[if !mso]><!-->
				<style type="text/css">
						@media only screen and (max-width:480px) {
								@-ms-viewport {
										width: 320px;
								}
								@viewport {
										width: 320px;
								}
						}
				</style>
				<!--<![endif]-->
				<!--[if mso]>
						<xml>
						<o:OfficeDocumentSettings>
							<o:AllowPNG/>
							<o:PixelsPerInch>96</o:PixelsPerInch>
						</o:OfficeDocumentSettings>
						</xml>
						<![endif]-->
				<!--[if lte mso 11]>
						<style type="text/css">
							.outlook-group-fix { width:100% !important; }
						</style>
						<![endif]-->

				<style type="text/css">
						@media only screen and (min-width:480px) {
								.mj-column-per-100 {
										width: 100% !important;
								}
						}
				</style>

				<style type="text/css">
				</style>

		</head>

		<body style="background-color:#f9f9f9;">

				<div style="background-color:#f9f9f9;">

						<!--[if mso | IE]>
					<table
						align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
					>
						<tr>
							<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
					<![endif]-->

						<div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">

								<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
										<tbody>
												<tr>
														<td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
																<!--[if mso | IE]>
											<table role="presentation" border="0" cellpadding="0" cellspacing="0">
						<tr>
						</tr>
											</table>
										<![endif]-->
														</td>
												</tr>
										</tbody>
								</table>

						</div>

						<!--[if mso | IE]>
							</td>
						</tr>
					</table>

					<table
						align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
					>
						<tr>
							<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
					<![endif]-->

						<div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">

								<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
										<tbody>
												<tr>
														<td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
																<!--[if mso | IE]>
											<table role="presentation" border="0" cellpadding="0" cellspacing="0">
						<tr>
								<td style="vertical-align:bottom;width:600px;">
							<![endif]-->

																<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

																		<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">

																				<tr>
																						<td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																								<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
																										<tbody>
																												<tr>
																														<td style="width:64px;">
																																<img height="auto" src="https://i.imgur.com/KO1vcE9.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
																														</td>
																												</tr>
																										</tbody>
																								</table>
																						</td>
																				</tr>

																				<tr>
																						<td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
																								<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
																										${subject}
																								</div>
																						</td>
																				</tr>

																				<tr>
																						<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																								<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
																										Kepada Kudetabet Teams!<br><br>
																										${message.replace(/\n/g, '<br>')}
																								</div>
																						</td>
																				</tr>

																				${attachmentCount > 0 ? `
																				<tr>
																						<td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:10px;word-break:break-word;">
																								<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:center;color:#666;">
																										📎 <strong>${attachmentCount}</strong> file(s) attached
																								</div>
																						</td>
																				</tr>
																				` : ''}

																				<tr>
																						<td align="left" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
																								<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
																										<strong>Informasi Pengirim:</strong><br>
																										Nama: ${profile.full_name || 'N/A'}<br>
																										Username: ${profile.username || 'N/A'}<br>
																										Email: ${profile.email || 'N/A'}<br>
																										Phone: ${profile.phone || 'N/A'}<br>
																										WhatsApp: ${profile.whatsapp || 'N/A'}
																								</div>
																						</td>
																				</tr>

																				<tr>
																						<td align="left" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
																								<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
																										Best regards,<br><br>
																										${profile.full_name || profile.username}<br>
																										<a href="${origin}" style="color:#2F67F6">${origin}</a>
																								</div>
																						</td>
																				</tr>

																		</table>

																</div>

																<!--[if mso | IE]>
								</td>
						</tr>
											</table>
										<![endif]-->
														</td>
												</tr>
										</tbody>
								</table>

						</div>

						<!--[if mso | IE]>
							</td>
						</tr>
					</table>

					<table
						align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
					>
						<tr>
							<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
					<![endif]-->

						<div style="Margin:0px auto;max-width:600px;">

								<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
										<tbody>
												<tr>
														<td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
																<!--[if mso | IE]>
											<table role="presentation" border="0" cellpadding="0" cellspacing="0">
						<tr>
								<td style="vertical-align:bottom;width:600px;">
							<![endif]-->

																<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

																		<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																				<tbody>
																						<tr>
																								<td style="vertical-align:bottom;padding:0;">
																										<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">

																												<tr>
																														<td align="center" style="font-size:0px;padding:0;word-break:break-word;">
																																<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
																																		Kudetabet Support Team
																																</div>
																														</td>
																												</tr>

																												<tr>
																														<td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
																																<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
																																		© ${new Date().getFullYear()} Kudetabet. All rights reserved.
																																</div>
																														</td>
																												</tr>

																										</table>
																								</td>
																						</tr>
																				</tbody>
																		</table>

																</div>

																<!--[if mso | IE]>
								</td>
						</tr>
											</table>
										<![endif]-->
														</td>
												</tr>
										</tbody>
								</table>

						</div>

						<!--[if mso | IE]>
							</td>
						</tr>
					</table>
					<![endif]-->

				</div>

		</body>

		</html>
	`;
}