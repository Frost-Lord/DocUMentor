const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("model")
    .setDescription("Loads a previously saved model state"),
  async run(client, interaction) {

    await interaction.deferReply();


  }
};
