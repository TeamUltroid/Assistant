import { Composer } from "grammy/mod.ts";
import { addNote, getNotes, removeNote } from "../database/notesDb.ts";
import { DEVS } from "./constants.ts";

const NOTES_LOG = -1001191621079;

const composer = new Composer();

composer.command("notes", async (ctx) => {
  const allNotes = await getNotes();
  if (allNotes.length === 0) {
    await ctx.reply("No notes found in this chat.");
    return;
  }
  let noteList = "<b>List of Notes:</b>\n\n";
  for (const note of allNotes) {
    noteList += `<code>#${note}</code>\n`;
  }
  noteList += "\nUse <code>#note_name</code> to retrive the note.";
  await ctx.reply(noteList, { parse_mode: "HTML" });
});

composer
  .filter((ctx) => DEVS.includes(ctx.from!.id))
  .command("addnote", async (ctx) => {
    const noteName = ctx.message!.text.split(" ")[1];
    if (!noteName) {
      await ctx.reply("Please provide a name for the note.");
      return;
    }
    const noteMessage = ctx.message!.reply_to_message;
    if (!noteMessage) {
      await ctx.reply("Please reply to a message to save as a note.");
      return;
    }
    const msg = await ctx.api.copyMessage(
      NOTES_LOG,
      ctx.chat.id,
      noteMessage.message_id,
    );
    await addNote(noteName, msg.message_id);
    await ctx.reply(`Note <code>#${noteName}</code> saved successfully!`, {
      parse_mode: "HTML",
    });
  });

composer
  .filter((ctx) => DEVS.includes(ctx.from!.id))
  .command("clear", async (ctx) => {
    const noteName = ctx.message!.text.split(" ")[1];
    if (!noteName) {
      await ctx.reply("Please provide a name for the note.");
      return;
    }
    await removeNote(noteName);
    await ctx.reply(`Note <code>#${noteName}</code> cleared successfully!`, {
      parse_mode: "HTML",
    });
  });

export default composer;
