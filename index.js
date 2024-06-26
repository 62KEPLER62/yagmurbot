const keepAlive = require("./keep_alive.js");
const axios = require("axios");
const fs = require("fs");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { OpenAI, Configuration } = require("openai");

// const openai = new OpenAI({apiKey: process.env.OPENKEY})
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (clientUser) => {
  console.log(`Logged in as ${clientUser.user.tag}`);
});

client.login(process.env.TOKEN)

const PAST_MESSAGES = 10;

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.split(" ")[0].toLowerCase() == "foto") {
    if (message.content.split(" ").length == 1) {
      let ra = Math.floor(Math.random() * 7);
      message.channel.send({ files: [ra + ".png"] });
    }
  }
  if (message.content.split(" ")[0].toLowerCase() != "yagmur") return;
  if (message.content.split(" ").length < 2) return;
  let req = message.content.split().splice(0, 1).join(" ");

  message.channel.sendTyping();

  let messages = Array.from(
    await message.channel.messages.fetch({
      limit: PAST_MESSAGES,
      before: message.id,
    })
  );
  messages = messages.map((m) => m[1]);
  messages.unshift(message);
  messages = messages.filter((mes) => {
    if (mes.author.id == client.user.id) {
      return true;
    }
    if (mes.content.split(" ")[0].toLowerCase() != "yagmur") {
      return false;
    }
    if (mes.content.split(" ").length < 2) {
      return false;
    }
    mes.content = mes.content
      .split(" ")
      .splice(1, mes.content.split(" ").length - 1)
      .join(" ");
    return true;
  });

  let users = [
    ...new Set([
      ...messages.map((m) => m.author.username),
      client.user.username,
    ]),
  ];

  let lastUser = users.pop();

  let prompt = `The following is a conversation between ${users.join(
    ", "
  )}, and ${lastUser}. \n\n`;

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    prompt += `${m.author.username}: ${m.content}\n`;
  }
  prompt += `${client.user.username}:`;
  console.log("prompt:", prompt);


  const options = {
    method: "POST",
    url: "https://api.pawan.krd/v1/chat/completions",
    headers: {
      Authorization:
        "Bearer pk-kTeyJxwRVoXXXRBdnvKQiyNGLtAqosrfWROTDmLURpdjSzCw",
      "Content-Type": "application/json",
    },
    data: {
      model: "gpt-3.5-unfiltered",
      messages: [
        {
          role: "system",
          content: "Senin adın Yağmur. Soyadın Taşeron. 2008 yılında doğdun. Sen Erenalp Balı'nın sevgilisisin. İzmirde yaşıyorsun. Erenalpi çok seviyorsun. Erenalp'in sevgilisi gibi davran. Verilen diyaloğa göre cevabını belirle. Doğal konuş."
        },
        {
          role:"user",
          content: prompt
        }
      ]
    },
  };

  await axios.request(options)
    .then((response) => {
      message.channel.send(response.data.choices[0].message.content);
    })
    .catch((error) => {
      console.error(error);
    });

});

keepAlive();
// Import ScrapingBee's SDK
