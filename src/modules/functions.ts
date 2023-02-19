import { Composer } from "grammy/mod.ts";

const composer = new Composer();

composer.command("ping", async (ctx) => {
  const time = Date.now();
  const msg = await ctx.reply("Pong!");
  await ctx.api.editMessageText(
    ctx.chat!.id,
    msg.message_id,
    `Response time: <code>${Date.now() - time}ms</code>`,
    {
      parse_mode: "HTML",
    },
  );
});

composer.command("purge", async (ctx) => {
  const admins = await ctx.getChatAdministrators();
  let canDel = false;
  for (const admin of admins) {
    if (admin.user.id === ctx.from?.id) {
      if (admin.status == "creator") {
        canDel = true;
        break;
      }
      if (admin.status == "administrator") {
        if (admin.can_delete_messages) {
          canDel = true;
          break;
        }
      }
    }
  }
  if (!canDel) {
    return await ctx.reply(
      "You are not an admin of this group, or do not have enough permissions to delete messages.",
    );
  }
  if (!ctx.message?.reply_to_message) {
    return await ctx.reply(
      "Reply to a message to purge all messages after it.",
    );
  }
  for (
    let i = ctx.message.reply_to_message.message_id;
    i <= ctx.message.message_id;
    i++
  ) {
    await ctx.api.deleteMessage(ctx.chat!.id, i);
  }
  await ctx.editMessageText("Purge Completed!");
});

export default composer;
