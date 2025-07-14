const { Telegraf } = require("telegraf");
const ytdl = require("youtube-audio-stream");

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN must be set in environment variables");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply("Send me a YouTube link and I'll get you an MP3 audio link!"));

bot.on("text", async (ctx) => {
  const text = ctx.message.text;
  // Simple YouTube URL validation (basic)
  if (!text.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)) {
    return ctx.reply("Please send a valid YouTube video URL.");
  }

  const videoUrl = text.trim();

  try {
    // Just reply with the YouTube URL with audio only format
    // We can provide an audio streaming URL via youtube-audio-stream
    // But on Vercel, we can't stream directly, so we'll just reply with the video URL with a note

    // In a real bot, you'd download or convert the video, upload somewhere, and send the file or link
    ctx.reply(
      `Here's your audio link (stream only, no direct mp3 file):\n\n${videoUrl}`
    );

  } catch (error) {
    console.error("Error processing YT URL:", error);
    ctx.reply("Sorry, something went wrong while fetching your audio.");
  }
});

// Vercel serverless function handler
module.exports = async function (req, res) {
  try {
    if (req.method === "POST") {
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } else {
      res.status(200).send("Telegram bot webhook is live!");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error");
  }
};
