const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides an overview of available commands and their usage"),
  async run(client, interaction) {

    await interaction.deferReply();

    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Help Menu')
      .setDescription('Here are the commands you can use:')
      .addFields(
        { name: '📤 `export/import`', value: 'Allows users to export and import both the model and the training dataset.' },
        { name: '🔄 `model`', value: 'Enables users to switch between older and newer trained models.' },
        { name: '🔮 `predict`', value: 'Given an input, predicts an output using the trained model.' },
        { name: '⚙️ `settings`', value: 'Allows you to manage various settings like bot\'s response channel, answering in threads, enabling self-learning, and enable/disable the bot\'s response to prediction requests.' },
        { name: '📊 `status`', value: 'Displays the current status of the AI model and the bot.' },
        { name: '📟 `train`', value: 'Trains the bot on new data.' }
      )
      .setFooter({ text: 'Use /<command> to execute a command'})
      .setTimestamp();

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Go to Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://example.com'),
        new ButtonBuilder()
          .setLabel('Get Support')
          .setStyle(ButtonStyle.Link)
          .setURL('https://example.com/support')
      );

    await interaction.followUp({ embeds: [helpEmbed], components: [buttons] });
  }
};