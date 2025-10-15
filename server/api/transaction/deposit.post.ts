import { H3Error, type H3Event } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import type { Database } from "~~/shared/types/database";
// import TelegramBot from 'node-telegram-bot-api';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient<Database>(event);
  const config = useRuntimeConfig(event);

  try {
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "User is not authenticated",
      });
    }

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw createError({
        statusCode: 500,
        message: "Failed to fetch user profile",
      });
    }

    if (!profile) {
      throw createError({
        statusCode: 400,
        message: "Profile is not configured",
      });
    }

    const body = await readBody<{
      amount?: number;
      payment_method?: string;
      user_account_number?: string;
      user_account_name?: string;
      notes?: string;
    }>(event);

    const { amount, payment_method, user_account_number, user_account_name, notes } = body;

    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        message: "Amount is required and must be greater than 0",
      });
    }

    if (!payment_method || !["e_wallet", "bank_transfer"].includes(payment_method)) {
      throw createError({
        statusCode: 400,
        message: "Payment method is required and must be e_wallet or bank_transfer",
      });
    }

    if (!user_account_number || !user_account_name) {
      throw createError({
        statusCode: 400,
        message: "User account number and name are required",
      });
    }

    const token = config.TelegramBotToken;
    if (!token) {
      throw createError({
        statusCode: 500,
        message: "Telegram bot token is not configured",
      });
    }

    const chatId = config.TelegramChatId; // Tambahkan chat ID di environment variables

    if (!chatId) {
      throw createError({
        statusCode: 500,
        message: "Telegram chat ID is not configured",
      });
    }

    // ✅ FIX: Gunakan bot tanpa polling (hanya send message)
    // const bot = new TelegramBot(token, { polling: false });

    // Format message
    const message = `
			💰 <b>NEW DEPOSIT REQUEST</b> 💰

			👤 <b>User:</b> ${profile.username} (${profile.full_name || 'N/A'})
			📧 <b>Email:</b> ${profile.email || 'N/A'}
			💳 <b>Amount:</b> Rp ${amount.toLocaleString('id-ID')}
			🏦 <b>Payment Method:</b> ${payment_method}
			📱 <b>Account Number:</b> ${user_account_number}
			👨‍💼 <b>Account Name:</b> ${user_account_name}
			📝 <b>Notes:</b> ${notes || 'No additional notes'}

			⏰ <i>Time:</i> ${new Date().toLocaleString('id-ID')}
    `.trim();

    // Send message to Telegram
    await sendTelegramNotification(event, message);



    return {
      success: true,
      message: "Deposit request submitted successfully",
      data: {
        amount,
        payment_method,
        user_account_number,
        user_account_name,
        notes,
      },
    };

  } catch (error) {
    console.error('Deposit API Error:', error);

    if (error instanceof H3Error) {
      throw error;
    }

    // Handle Telegram specific errors
    if (error instanceof Error) {
      if (error.message.includes('ETELEGRAM')) {
        throw createError({
          statusCode: 500,
          message: "Failed to send notification to Telegram",
        });
      }
    }

    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});