const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("predict")
    .setDescription("predict a response"),
  run: async (client, interaction) => {




  }
};