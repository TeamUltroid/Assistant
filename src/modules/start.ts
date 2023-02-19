import { Composer, InlineKeyboard } from "grammy/mod.ts";

import { UltroidSupport } from "./constants.ts";

const WRK_GRPS = [
  -1001237141420,
  -1001327032795,
  -1001451324102,
  -1001208954059,
  -1001336090217,
  -1001313492028,
  -1001224691620,
  UltroidSupport,
  -1001151963184, // test chat
];

const composer = new Composer();

composer
  .command("start", async (ctx) => {
    if (ctx.chat.type == "private") {
      await ctx.reply(
        `Hi ${
          ctx.from!.first_name
        }!\nI'm Ultroid Assistant - a fully fledged assistant for @TheUltroid.`,
        // #TODO: database manager, heroku deployer buttons
      );
      return;
    }
    if (!WRK_GRPS.includes(ctx.chat.id)) {
      await ctx.reply("See you in @TheUltroid, bye!");
      await ctx.leaveChat();
      return;
    }
    await ctx.reply(
      `Hi ${
        ctx.from!.first_name
      }, I am Ultroid Assistant.\nI guide people in @TeamUltroid and help new ones to deploy their bot`,
      {
        reply_markup: new InlineKeyboard()
          .url("🔗 Repository", "https://github.com/TeamUltroid/Ultroid")
          .url("Support 🆘", "https://t.me/TeamUltroid")
          .row()
          .text("Help Menu 🔐", "helpmenu"),
      },
    );
  });

export default composer;
