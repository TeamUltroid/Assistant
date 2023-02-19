import { Composer, Context } from "grammy/mod.ts";

import { DEVS } from "./constants.ts";

async function isAdmin(ctx: Context) {
  const admins = await ctx.getChatAdministrators();
  return admins.some((admin) => admin.user.id === ctx.from?.id);
}

async function safetyValve(ctx: Context, userToBan: number, what: string) {
  if (DEVS.includes(userToBan)) {
    await ctx.reply(`Ayo, you can't ${what} my developer!`);
    return false;
  }
  if (userToBan == (await ctx.api.getMe()).id) {
    await ctx.reply("Joke, very funny.");
    return false;
  }
  return true;
}

const composer = new Composer();

composer
  .filter((ctx) => isAdmin(ctx))
  .command("ban", async (ctx) => {
    let userToBan;
    if (ctx.message?.reply_to_message) {
      userToBan = ctx.message?.reply_to_message.from?.id;
      // reason = ctx.message?.text.split(" ")[1] ?? "None provided.";
    }
    if (!userToBan) {
      return ctx.reply("Please reply to a message!");
    }
    if (await safetyValve(ctx, userToBan, "ban") == true) {
      try {
        await ctx.banChatMember(userToBan);
      } catch (err) {
        await ctx.reply("Insufficient perms!");
        console.error(err);
        return;
      }
      await ctx.replyWithSticker(
        "CAACAgUAAxkBAAIoXmPyJ0iEVIFqxANcFGEjZuk34cgMAAIjCAAC9q1IV2i42zjrpceeLgQ",
        {
          reply_to_message_id: ctx.message?.message_id,
        },
      );
    }
  });

composer
  .filter((ctx) => isAdmin(ctx))
  .command("mute", async (ctx) => {
    let userToMute;
    if (ctx.message?.reply_to_message) {
      userToMute = ctx.message?.reply_to_message.from?.id;
      // reason = ctx.message?.text.split(" ")[1] ?? "None provided.";
    }
    if (!userToMute) {
      return ctx.reply("Please reply to a message!");
    }
    if (await safetyValve(ctx, userToMute, "mute") == true) {
      try {
        await ctx.restrictChatMember(userToMute, { can_send_messages: false });
      } catch (err) {
        await ctx.reply("Insufficient perms!");
        console.error(err);
        return;
      }
      await ctx.reply(
        `Quite now! Muted <a href="tg://user?id=${userToMute}">${
          ctx.message?.reply_to_message?.from?.first_name ?? "him"
        }</a>.`,
        { parse_mode: "HTML" },
      );
    }
  });

composer
  .filter((ctx) => isAdmin(ctx))
  .command("unmute", async (ctx) => {
    let userToUnMute;
    if (ctx.message?.reply_to_message) {
      userToUnMute = ctx.message?.reply_to_message.from?.id;
      // reason = ctx.message?.text.split(" ")[1] ?? "None provided.";
    }
    if (!userToUnMute) {
      return ctx.reply("Please reply to a message!");
    }
    try {
      await ctx.restrictChatMember(userToUnMute, {
        can_send_messages: true,
        can_send_photos: true,
        can_send_documents: true,
        can_send_video_notes: true,
        can_send_videos: true,
      });
    } catch (err) {
      await ctx.reply("Insufficient perms!");
      console.error(err);
      return;
    }
    await ctx.reply(
      `UnMuted <a href="tg://user?id=${userToUnMute}">${
        ctx.message?.reply_to_message?.from?.first_name ?? "him"
      }</a>.`,
      { parse_mode: "HTML" },
    );
  });

export default composer;
