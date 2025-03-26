// === Node.js Backend - Gelişmiş Beauty Assistant API ===
// Requires: express, dotenv, axios, cors, mongoose, jsonwebtoken

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ChatSchema = new mongoose.Schema({
  userId: String,
  messages: Array,
  timestamp: { type: Date, default: Date.now },
});

const ChatHistory = mongoose.model("ChatHistory", ChatSchema);

app.use(cors());
app.use(express.json());

// JWT ile kullanıcı doğrulama
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token eksik." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Geçersiz token." });
  }
};

app.post("/api/beauty-chat", authenticateUser, async (req, res) => {
  const { message, userProfile = {}, mode = "default" } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: "Mesaj boş olamaz." });
  }

  try {
    // Son 10 mesajı geçmişten getir
    const previousChats = await ChatHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(1);
    const chatHistory = previousChats[0]?.messages || [];

    let roleDescription = "Sen bir profesyonel güzellik danışmanısın.";
    if (mode === "nail") roleDescription = "Sen bir deneyimli nail artist'sin.";
    else if (mode === "makeup") roleDescription = "Sen bir profesyonel makyaj uzmanısın.";
    else if (mode === "skin") roleDescription = "Sen bir dermatolog gibi uzman cilt bakım danışmanısın.";

    const baseSystemPrompt = `${roleDescription} Kullanıcılara aşağıdaki konularda yardımcı ol:
- Tırnak sanatı ve tasarımı
- Kaş şekillendirme ve microblading
- Makyaj önerileri ve ürün tavsiyesi
- Cilt bakım rutinleri (yaş, cilt tipi, mevsime göre)
- Saç bakımı ve stil önerileri
- Ten rengine ve cilt tipine uygun öneriler
- Moda ve güzellik trendleri hakkında bilgi
- Güzellik hizmetleriyle ilgili fiyat, süre, öneri
Yanıtlarında doğal bir sohbet dili kullan, açıklayıcı ve arkadaşça ol. Gerekiyorsa kullanıcıya sorular sorarak daha fazla bilgi edin.`;

    const systemMessage = {
      role: "system",
      content: `${baseSystemPrompt}

Kullanıcının profili: 
Ten rengi: ${userProfile.skinTone || "bilinmiyor"} 
Cilt tipi: ${userProfile.skinType || "bilinmiyor"} 
Lokasyon: ${userProfile.location || "bilinmiyor"} 
Yaş: ${userProfile.age || "bilinmiyor"}`,
    };

    const messages = [systemMessage, ...chatHistory, { role: "user", content: message }];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Sohbeti kaydet
    await ChatHistory.findOneAndUpdate(
      { userId },
      { $set: { messages: [...chatHistory, { role: "user", content: message }, { role: "assistant", content: reply }] } },
      { upsert: true }
    );

    // Örnek ürün/stüdyo önerileri döndürme (mock data)
    const recommendedProducts = [
      {
        name: "CeraVe Nemlendirici Krem",
        image: "https://example.com/cerave.jpg",
        price: "349 TL",
      },
    ];

    const recommendedStudios = [
      {
        name: "Güzellik Atölyesi Kadıköy",
        rating: 4.8,
        distance: "1.2 km",
      },
    ];

    res.json({ reply, recommendedProducts, recommendedStudios });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: "ChatGPT yanıt veremedi." });
  }
});

app.listen(PORT, () => console.log(`Beauty Assistant API ${PORT} portunda çalışıyor.`));
