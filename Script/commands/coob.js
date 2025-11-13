module.exports.config = {
  name: "coob",
  version: "1.0",
  author: "MZ",
  countDown: 5,
  role: 0,
  shortDescription: "Animate dance in store",
  longDescription: "Applies animation effect and shows character dancing in store",
  category: "media",
  guide: "{pn} [prompt]"
};

module.exports.run = async function ({ message, event, args }) {
  const prompt = args.join(" ") || "a person dancing in a store";
  const attachments = event.attachments;

  if (!attachments || attachments.length === 0) {
    return message.reply("📸 Please attach a photo to animate.\n\n📸 অনুগ্রহ করে একটি ছবি সংযুক্ত করুন অ্যানিমেট করতে।");
  }

  const imageUrl = attachments[0].url;
  await message.reply("⏳ Generating animation...\n\n⏳ অ্যানিমেশন তৈরি করা হচ্ছে...");

  try {
    const animatedVideoUrl = await animateDanceEffect(imageUrl, prompt);

    if (!animatedVideoUrl) throw new Error("No video returned");

    return message.reply({
      body: `🕺 Animation complete!\n📝 Prompt: ${prompt}`,
      attachment: await global.utils.getStreamFromURL(animatedVideoUrl)
    });
  } catch (err) {
    console.error("Dance error:", err);
    return message.reply("❌ Failed to animate.\n\n❌ অ্যানিমেশন তৈরি করতে ব্যর্থ। আবার চেষ্টা করুন।");
  }
};

// ✅ Realistic API call using a hypothetical animation service
async function animateDanceEffect(imageUrl, prompt) {
  const axios = require("axios");

  const response = await axios.post("https://api.motiongenius.ai/v1/animate", {
    image: imageUrl,
    prompt: prompt,
    style: "dance-in-store"
  }, {
    headers: {
      "Authorization": "Bearer YOUR_API_KEY_HERE",
      "Content-Type": "application/json"
    }
  });

  if (response.data && response.data.videoUrl) {
    return response.data.videoUrl;
  } else {
    throw new Error("Invalid response from animation API");
  }
}
