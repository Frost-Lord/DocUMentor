const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inport")
    .setDescription("Allows the user to import training data or a pretrained model"),
  async run(client, interaction) {

    await interaction.deferReply();


  }
};
