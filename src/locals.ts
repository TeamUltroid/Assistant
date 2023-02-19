import { Bot, GrammyError, HttpError } from "grammy/mod.ts";
import { autoQuote } from "autoQuote";
import config from "../env.ts";
import composer from "./modules/mod.ts";

const bot = new Bot(config.BOT_TOKEN);
await bot.init();
console.info(`Started as @${bot.botInfo.username}`);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.use(autoQuote);
bot.use(composer);

bot.start({
  drop_pending_updates: true,
  allowed_updates: ["message", "callback_query", "chat_member"],
});

Deno.addSignalListener("SIGINT", () => bot.stop());
if (Deno.build.os != "windows") {
  Deno.addSignalListener("SIGTERM", () => bot.stop());
}
