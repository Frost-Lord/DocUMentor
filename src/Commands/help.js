const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides an overview of available commands and their usage"),
  async run(client, interaction) {

    await interaction.deferReply();


  }
};
