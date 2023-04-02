import { Composer, InlineKeyboard } from "grammy/mod.ts";
import { getNoteMessageId } from "../database/notesDb.ts";

import { DEVS, UltroidSupport } from "./constants.ts";

const NOTES_LOG = -1001191621079;
const reply_markup = new InlineKeyboard()
  .url("Heroku - Tutorial", "https://youtu.be/9wF7k9qA0Q4")
  .url(
    "Heroku - Deploy Link",
    "https://dashboard.heroku.com/new?template=https%3A%2F%2Fgithub.com%2Fxditya%2FSideLoad",
  )
  .row()
  .url("Okteto Tutorial", "https://youtu.be/uPCe0I8yJpg")
  .url("VPS - Tutorial", "https://youtu.be/QfdZiQEWmSo")
  .row()
  .url(
    "Host on GitHub WorkFlows",
    "https://github.com/Techierror/ultroid-cred-example",
  )
  .row()
  .url("GitHub - Repo", "https://github.com/TeamUltroid/Ultroid");

const composer = new Composer();

composer.on("message", async (ctx) => {
  // handle notes - in any chat
  // find the word with starting with #
  const noteRegex = /#(\w+)/;
  const noteMatch = noteRegex.exec(ctx.message.text!);
  if (noteMatch) {
    const noteWithHashtag = noteMatch[0];
    const ignoredNotes = ["deploy", "tutorial", "bug", "request"];
    if (!ignoredNotes.includes(noteWithHashtag)) {
      const noteName = noteMatch[1];
      const noteMsgId = await getNoteMessageId(noteName);
      if (noteMsgId) {
        await ctx.api.copyMessage(
          ctx.chat.id,
          NOTES_LOG,
          noteMsgId,
          {
            reply_to_message_id: ctx.message.reply_to_message?.message_id
              ? ctx.message.reply_to_message?.message_id
              : ctx.message.message_id,
          },
        );
      }
    }
  }

  // autoforward from UltroidNews to UltroidSupport
  if (ctx.update.message.sender_chat?.id == -1001224691620) {
    const msg = await ctx.forwardMessage(UltroidSupport);
    await ctx.api.pinChatMessage(UltroidSupport, msg.message_id);
  }

  if (ctx.chat?.id == UltroidSupport) {
    // autopaste
    if (ctx.message.text && ctx.message.text!.length > 900) {
      const res = await fetch("https://paste.xditya.me/api/v2/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: ctx.message.text,
        }),
      });
      const key = (await res.json()).id;
      await ctx.reply(
        `Hey ${ctx.from?.first_name}, your message was too long. It has been pasted, and you can find it in the link below.`,
        {
          reply_markup: new InlineKeyboard()
            .url("🔗 Paste Link", `https://paste.xditya.me/${key}`),
          reply_to_message_id: ctx.message.message_id,
        },
      );
      await ctx.deleteMessage();
    }
    if (ctx.message.text == "#deploy" || ctx.message.text == "#tutorial") {
      await ctx.reply("<b>Available tutorials for Ultroid.</b>", {
        reply_markup: reply_markup,
        parse_mode: "HTML",
      });
      return;
    }
    if (
      ctx.message.text?.startsWith("#bug") ||
      ctx.message.text?.startsWith("#request")
    ) {
      let msgId;
      if (ctx.message.text == "#bug" || ctx.message.text == "#request") {
        if (ctx.message.reply_to_message) {
          msgId = ctx.message.reply_to_message.message_id;
        } else {
          await ctx.reply("Reply to a message!");
          return;
        }
      } else msgId = ctx.message.message_id;
      const sentMsg = await ctx.api.copyMessage(
        -1001384371830, // UltroidRequests
        ctx.chat.id,
        msgId,
        {
          reply_markup: new InlineKeyboard().url(
            "View Message",
            `https://t.me/c/${
              ctx.chat?.id.toString().replace("-100", "")
            }/${ctx.message.message_id}`,
          )
            .text("Delete Message", "delmsg"),
        },
      );
      await ctx.reply(
        "Thanks for your feedback! Your message has been saved and would be looked into soon!",
        {
          reply_markup: new InlineKeyboard().url(
            "View Message",
            `https://t.me/c/${1384371830}/${sentMsg.message_id}`,
          ),
        },
      );
    }
  }
});

composer.callbackQuery("delmsg", async (ctx) => {
  if (DEVS.includes(ctx.from?.id)) {
    await ctx.deleteMessage();
  } else {
    await ctx.answerCallbackQuery("This ain't for you!!");
  }
});

export default composer;
