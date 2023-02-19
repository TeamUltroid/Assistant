import { Composer, InlineKeyboard } from "grammy/mod.ts";

const helptext = `
**Ultroid Assistant - Help Menu**
- <code>/start</code>: Start the bot.
- <code>/ping</code>: Check the response time of the bot.
- <code>/purge</code>: Purge messages from the replied message.
- <code>/paste</code>: Paste the long text.
Notes
- <code>/addnote</code>: Save a note.
- <code>/notes</code>: Get all notes.
- <code>/clear</code>: Delete a note.
<b>Note:</b> <i>These commands work only in groups.</i>
`;

const composer = new Composer();

composer.callbackQuery("helpmenu", async (ctx) => {
  await ctx.editMessageText(helptext, {
    reply_markup: new InlineKeyboard()
      .text("◀️ Back", "back")
      .text("Close ✂️", "close"),
    parse_mode: "HTML",
  });
});

composer.callbackQuery("back", async (ctx) => {
  await ctx.editMessageText(
    "Hello, I'm Ultroid Assistant - a simple group managing bot to manage @TeamUltroid's Network.",
    {
      reply_markup: new InlineKeyboard()
        .text("Help Menu 🔐", "helpmenu")
        .url("Support 🆘", "https://t.me/TeamUltroid")
        .row()
        .text("Close ✂️", "close"),
    },
  );
});

composer.callbackQuery("close", async (ctx) => {
  await ctx.deleteMessage();
});

export default composer;
