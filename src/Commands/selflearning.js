const { EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("selflearning")
    .setDescription("enable/disbale the ability for the user to help train the AI"),
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }




  }
};