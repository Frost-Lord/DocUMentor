const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shards")
    .setDescription("Display all bot shards"),
  async run(client, interaction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setTitle('Bot Shards')
      .setColor(0x0099ff)
      .setDescription(`Here are the details of each shard:`)
      .addFields(
        { name: '🟢 🇦🇺 Australia/Sydney', value: '```\nShard: 0\nRAM: 2GB\nGPU: GTX 1050\n```', inline: true },
        { name: '🟢 🇺🇸 US/New York', value: '```\nShard: 1\nRAM: 4GB\nGPU: GTX 1060\n```', inline: true },
        { name: '\u200B', value: '\u200B', inline: false },
        { name: '🟢 🇪🇺 EU/London', value: '```\nShard: 2\nRAM: 3GB\nGPU: RTX 2080\n```', inline: true },
        { name: '🟢 🇯🇵 Asia/Tokyo', value: '```\nShard: 3\nRAM: 2.5GB\nGPU: GTX 1070\n```', inline: true },
      );

    await interaction.editReply({ embeds: [embed] });
  }
};