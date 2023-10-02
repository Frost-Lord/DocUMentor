const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ChannelType } = require("discord.js");
const UpdateClient = require("../../subroutines/ClientEvents")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("manage the options of the bot")
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel to listen to, otherwise listens to all')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('selflearning')
        .setDescription('enable/disable user feedback on predictions')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('threads')
        .setDescription('enable/disable the use of threads to respond to predictions')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('enable')
        .setDescription('enable/disable responding to messages')
        .setRequired(false)),
  async run(client, interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const channel = interaction.options.getChannel("channel");
    const selflearning = interaction.options.getBoolean("selflearning");
    const threads = interaction.options.getBoolean("threads");
    const enabled = interaction.options.getBoolean("enable");


    if (channel === null && selflearning === null && enabled === null && threads === null) {
      const embed = new MessageEmbed()
        .setTitle("Error")
        .setDescription("You must change at least one setting.")
        .setColor(0xFF0000);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    UpdateClient(channel === null ? null : channel, enabled === true ? true : false, selflearning === false ? false : true, threads === true ? true : false);

    const embed = new EmbedBuilder()
      .setTitle("Bot Settings")
      .setDescription(`Configuration options for the bot: \n Listening Channel: ${channel ? channel.name : "All"} \n Self Learning: ${selflearning ? "Enabled" : "Disabled"} \n Create thered of questions: ${threads ? "Enabled" : "Disabled"} \n Responding to Messages: ${msgrespond ? "Enabled" : "Disabled"}`)
      .setColor(0x00FF00);

    await interaction.editReply({ embeds: [embed] });
  }
};