import config from "../env.ts";
import composer from "./modules/mod.ts";

import { Application, Router } from "oak";
import { Bot, GrammyError, HttpError, webhookCallback } from "grammy/mod.ts";
import { autoQuote } from "autoQuote";

const bot = new Bot(config.BOT_TOKEN);
await bot.init();
bot.use(autoQuote);
bot.use(composer);
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

const router = new Router();
// const handleUpdate = webhookCallback(bot, "oak");

router
  .get("/", (ctx) => {
    ctx.response.body = "Hello World!";
  });

const app = new Application();
app.use(webhookCallback(bot, "oak"));
app.use(router.routes());
app.use(router.allowedMethods());
app.addEventListener("error", (e) => console.log(e));

console.log("> Started listeneing on PORT 80!");
