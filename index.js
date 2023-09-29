const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const Config = require("./config.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});


client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const slashcommands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = await require(`./src/commands/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands },
    );
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Activated!`);
})

readdirSync('./src/events').forEach(async file => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.login(process.env.TOKEN).catch(e => {
    console.log(e)
  });