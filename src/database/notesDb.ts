import { db } from "./connect.ts";

import { ObjectId } from "mongo";

interface NotesSchema {
  _id: ObjectId;
  keyword: string;
  message_id: number;
}
const notes = db.collection<NotesSchema>("notes");

export async function addNote(keyword: string, message_id: number) {
  if (!await notes.findOne({ keyword: keyword })) {
    await notes.insertOne({ keyword, message_id });
  }
}

export async function removeNote(keyword: string) {
  await notes.deleteOne({ keyword: keyword });
}

export async function getNotes() {
  const allNotes = await notes.find({ keyword: { $exists: true } }).toArray();
  const allNoteKeys = [];
  for (const note of allNotes) {
    allNoteKeys.push(note.keyword);
  }
  return allNoteKeys;
}

export async function getNoteMessageId(keyword: string) {
  const thisNote = await notes.findOne({ keyword: keyword });
  if (notes) {
    return thisNote?.message_id;
  }
  return null;
}
