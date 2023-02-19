import { Composer, InlineKeyboard } from "grammy/mod.ts";

import { UltroidOT, UltroidSupport, welcomeButtons } from "./constants.ts";

const composer = new Composer();

async function genCaptcha() {
  const base_url = "https://apis.xditya.me/captcha?options=9&length=4";
  const res = await fetch(base_url);
  if (res.status != 200) {
    return null;
  }
  const data = await res.json();
  return data;
}

function buildKeyboard(
  options: string[],
  correct: string,
  userId: number,
) {
  const keyboard = new InlineKeyboard();
  let c = 0;
  for (const option of options) {
    c++;
    keyboard.text(option, `cap_${option}_${correct}_${userId}`);
    if (c == 3) {
      keyboard.row();
      c = 0;
    }
  }
  return keyboard;
}

composer
  .filter((ctx) =>
    ctx.chat?.id == UltroidSupport || ctx.chat?.id == UltroidOT ||
    ctx.chat?.id == -1001151963184
  )
  .on("chat_member", async (ctx) => {
    if (
      ctx.update.chat_member.new_chat_member.status != "member"
    ) return; // send welcome message only for new member joins
    const joinedUser = ctx.update.chat_member.new_chat_member.user;
    await ctx.restrictChatMember(joinedUser.id, { can_send_messages: false });
    const captchaData = await genCaptcha();
    if (captchaData == null) {
      // this means my api is down, so, no captcha.
      await ctx.reply(
        `Hello <a href="tg://user?id=${joinedUser.id}">${joinedUser.first_name}</a>! Welcome to ${
          ctx.chat.type != "private" ? ctx.chat.title : "the group."
        }.
Below are some quick guides which would help you get started.`,
        {
          parse_mode: "HTML",
          reply_to_message_id: ctx.message?.message_id,
          reply_markup: welcomeButtons,
        },
      );
      await ctx.restrictChatMember(joinedUser.id, { can_send_messages: true });
      return;
    }
    await ctx.replyWithPhoto(
      captchaData.captcha,
      {
        caption:
          `Hi <a href="tg://user?id=${joinedUser.id}">${joinedUser.first_name}</a>! Solve the below captcha and you will be unmuted!.`,
        parse_mode: "HTML",
        reply_to_message_id: ctx.message?.message_id,
        reply_markup: buildKeyboard(
          captchaData.options,
          captchaData.correct,
          joinedUser.id,
        ),
      },
    );
  });

composer.callbackQuery(/^cap_(.*)_(.*)_(.*)$/, async (ctx) => {
  const [_, option, correct, userId] = ctx.match;
  if (ctx.from?.id != Number(userId)) {
    await ctx.answerCallbackQuery("This is not for you!");
    return;
  }
  if (option != correct) {
    await ctx.answerCallbackQuery("Wrong answer!");
    return;
  }
  await ctx.answerCallbackQuery("Correct answer!");
  await ctx.deleteMessage();
  await ctx.restrictChatMember(Number(userId), {
    can_send_messages: true,
    can_send_photos: true,
    can_send_documents: true,
    can_send_video_notes: true,
    can_send_videos: true,
  });
  await ctx.reply(
    `Hello <a href="tg://user?id=${userId}">${ctx.from?.first_name}</a>! Welcome to ${
      ctx.chat?.type != "private" ? ctx.chat?.title : "the group."
    }.
Below are some quick guides which would help you get started.`,
    {
      parse_mode: "HTML",
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: welcomeButtons,
    },
  );
});

export default composer;
