const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, ChannelType } = require("discord.js");
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("manage the options of the bot")
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel to listen to, otherwise listens to all')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText))
      .addBooleanOption(option =>
       option.setName('selflearning')
        .setDescription('enable/disable user feedback on predictions')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('enable')
        .setDescription('enable/disable responding to messages')
        .setRequired(true)),
  async run(client, interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    await interaction.deferReply();



  }
};
