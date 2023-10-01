const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDescription("Allows the user to export the model or the training data"),
  async run(client, interaction) {

    await interaction.deferReply();


  }
};
