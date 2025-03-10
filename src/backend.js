const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/issue-vc", async (req, res) => {
  const { userId, templateId } = req.body;
  try {
    const response = await axios.post(
      "https://YOUR_AUTH0_LAB_DOMAIN/api/vc/issue",
      {
        user_id: userId,
        template_id: templateId,
        redirect_uri: "https://your-app.com/issuance-complete",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_TOKEN}`,
        },
      }
    );
    res.json({
      qrCodeUrl: response.data.qrCodeUrl,
      deepLink: response.data.deepLink,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to issue VC" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));