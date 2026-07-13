export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, discord, service } = req.body;

  const webhook = "https://discord.com/api/webhooks/1526354373733777519/eAfHllYs2Q1-6-SRNmHRHWP_fs18ul8HZJ_9s8qotm6Cs7FPud89z6hHSYYMPzeknpOx";

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "📦 新訂單",
        color: 0x00eaff,
        fields: [
          { name: "玩家", value: name || "未填", inline: true },
          { name: "Discord", value: discord || "未填", inline: true },
          { name: "方案", value: service || "未填" }
        ],
        timestamp: new Date()
      }]
    })
  });

  res.status(200).json({ success: true });
}
