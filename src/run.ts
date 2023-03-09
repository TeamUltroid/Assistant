import config from "../env.ts";
import composer from "./modules/mod.ts";

import { serve } from "server";
import { Bot, GrammyError, HttpError, webhookCallback } from "grammy/mod.ts";
import { autoQuote } from "autoQuote";
import { serveDir } from "file_server";

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

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
  console.log("received ", req);
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
      }
    }
  }
  if (req.method == "GET") {
    const pathname = new URL(req.url).pathname;
    if (pathname.startsWith("/assets")) {
      return serveDir(req, {
        fsRoot: "./",
      });
    }
    return new Response(await Deno.readTextFile("./index.html"), {
      headers: { "content-type": "text/html" },
    });
  }
});
