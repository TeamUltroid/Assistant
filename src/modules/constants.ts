import { InlineKeyboard } from "grammy/mod.ts";

export const DEVS = [
  719195224, // @xditya
  1322549723, // @danish_00
  1950319407, // @buddhhu
  1303895686, // @Sipak_OP
  611816596, // @Arnab431
  1318486004, // @sppidy
  803243487, // @hellboi_atul
  1444249738, // Devesh
];

export const UltroidSupport = -1001361294038;

export const UltroidOT = -1001451324102;

export const welcomeButtons = new InlineKeyboard()
  .url("Repository", "https://github.com/TeamUltroid/Ultroid")
  .url("Addons", "https://github.com/TeamUltroid/UltroidAddons")
  .row()
  .url("Documentation", "https://ultroid.tech")
  .row()
  .url("Tutorial (Heroku)", "https://youtu.be/0wAV7pUzhDQ")
  .url("Tutorial (VPS)", "https://www.youtube.com/watch?v=QfdZiQEWmSo");
