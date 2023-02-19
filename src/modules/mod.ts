import { Composer } from "grammy/mod.ts";

import start from "./start.ts";
import help from "./help.ts";
import functions from "./functions.ts";
import notes from "./notes.ts";
import messageHandler from "./messageHandlers.ts";
import welcomes from "./welcomes.ts";
import admins from "./admins.ts";

const composer = new Composer();

// !WARN: keep messsageHandler last or else it'd break.
composer.use(start, help, functions, notes, welcomes, admins, messageHandler);

export default composer;
