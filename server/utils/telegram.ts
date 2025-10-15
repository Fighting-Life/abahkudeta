import type {  H3Event } from "h3";

export const sendTelegramNotification = async (event: H3Event,
	message: string) => {
  const config = useRuntimeConfig(event);
  const token = config.TelegramBotToken;
  const chatId = config.TelegramChatId;

  if (!token || !chatId) {
    console.warn('Telegram bot token or chat ID not configured');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await $fetch(url, {
      method: 'POST',
      body: {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    throw error;
  }
};