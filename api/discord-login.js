export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  // 這裡填入你的 Discord App 資訊
  // 建議在 Vercel 後台將 CLIENT_SECRET 設定為環境變數，這裡用 process.env.DISCORD_SECRET 讀取
  const CLIENT_ID = '你的_CLIENT_ID';
  const CLIENT_SECRET = '你的_CLIENT_SECRET'; 
  const REDIRECT_URI = 'https://hetz-esports.vercel.app/login'; // 確保與後台一致

  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    });

    // 在後端安全地發送請求給 Discord
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json(tokenData);
    }

    // 拿到了 access_token，接著可以用它去抓使用者資料 (/users/@me)
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userResponse.json();

    // 將使用者資料回傳給前端
    return res.status(200).json(userData);

  } catch (error) {
    return res.status(500).json({ error: '後端伺服器發生錯誤', details: error.message });
  }
}