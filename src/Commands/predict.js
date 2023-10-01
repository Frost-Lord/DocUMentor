const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("predict")
    .setDescription("predict a response")
    .addStringOption(option =>
      option.setName('input')
        .setDescription('enter what you want to be predicted')
        .setRequired(true)),
  async run(client, interaction) {

    const text = interaction.options.getString("input");

    await interaction.deferReply();
    const data = await Predict(text)

    const buttons = [
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel(`Open in thread`)
        .setCustomId('openinthread')
        .setEmoji("🧵")
    ];
    
    if (global.selflearning === true) {
      buttons.unshift(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(`Correct`)
          .setCustomId('correctguess')
          .setEmoji("✅"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel('Incorrect')
          .setCustomId('incorrectguess')
          .setEmoji('❌')
      );
    }
    
    const row = new ActionRowBuilder()
      .addComponents(buttons);

    const embed = new EmbedBuilder()
    .setTitle("Prediction:")
    .setDescription(`Input: ${data.text} \n Category: ${data.predicted} \n Response: ${data.response}`)

    if (global.selflearning === false && global.threads === false) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [embed], components: [row], });
    }
  }
};
