const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Shows the current status of the AI model—whether it's training, idle, or evaluating"),
  async run(client, interaction) {

    await interaction.deferReply();


  }
};
