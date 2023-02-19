import { Composer, InlineKeyboard } from "grammy/mod.ts";

const composer = new Composer();

composer.on("inline_query", async (ctx) => {
  await ctx.answerInlineQuery([
    {
      type: "article",
      id: "1",
      title: "Welcome to Ultroid!",
      input_message_content: {
        message_text:
          "Heya, I'm @UltroidBot - a group manager for @TeamUltroid.\nTo learn more about Ultroid, use the below buttons.",
      },
      reply_markup: new InlineKeyboard().url(
        "GitHub",
        "https://github.com/TeamUltroid",
      ).url("Telegram", "https://TeamUltroid.t.me"),
    },
  ], { cache_time: 30 * 60 });
});

export default composer;
