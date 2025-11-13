module.exports = {
  name: "zcoov2",
  alias: [],
  desc: "Animate a photo with store dance effect using AI",
  category: "media",
  usage: "zcoov2 [prompt]",
  cooldown: 5,
  code: async ({ msg, args }) => {
    const prompt = args.join(" ") || "a person dancing in a store";
    const attachments = msg.messageReply?.attachments || msg.attachments;

    if (!attachments || attachments.length === 0) {
      return msg.reply(
        "📸 Please attach a photo to animate.\n\n📸 অনুগ্রহ করে একটি ছবি সংযুক্ত করুন অ্যানিমেট করতে।"
      );
    }

    const imageUrl = attachments[0].url;
    await msg.reply("⏳ Generating animation...\n\n⏳ অ্যানিমেশন তৈরি করা হচ্ছে...");

    try {
      const animatedVideoUrl = await animateZcoov2Effect(imageUrl, prompt);

      if (!animatedVideoUrl) throw new Error("No video returned");

      return msg.reply({
        body: `🕺 Animation complete!\n📝 Prompt: ${prompt}`,
        attachment: await global.utils.getStreamFromURL(animatedVideoUrl)
      });
    } catch (err) {
      console.error("Zcoov2 error:", err.response?.data || err.message);
      return msg.reply(
        "❌ Failed to animate.\n\n❌ অ্যানিমেশন তৈরি করতে ব্যর্থ। আবার চেষ্টা করুন।"
      );
    }
  }
};

// 🔧 Animation API integration
async function animateZcoov2Effect(imageUrl, prompt) {
  const axios = require("axios");

  const response = await axios.post(
    "https://api.motiongenius.ai/v1/animate",
    {
      image: imageUrl,
      prompt: prompt,
      style: "dance-in-store"
    },
    {
      headers: {
        Authorization: "Bearer YOUR_API_KEY_HERE", // 🔑 Replace with your real API key
        "Content-Type": "application/json"
      }
    }
  );

  return response.data?.videoUrl || null;
}
