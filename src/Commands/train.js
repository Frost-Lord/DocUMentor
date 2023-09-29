const { EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("train")
    .setDescription("retrain the ai"),
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You need to have the 'ManageGuild' permission to run this command.")
        .setColor("RED");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    function generateProgressBar(percentage) {
      const filled = "■";
      const empty = "□";
      const progressBarLength = 20;
      const progressBarFullLength = Math.floor(
        (progressBarLength * percentage) / 100
      );
      const progressBarEmptyLength = progressBarLength - progressBarFullLength;

      const progressBar = [
        filled.repeat(progressBarFullLength),
        empty.repeat(progressBarEmptyLength),
      ].join("");

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel(`${percentage}%`)
          .setCustomId('percentagetraining')
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(progressBar)
          .setCustomId('percentagebartraining')
          .setDisabled(true)
      );


      return row;
    }

    const Rembed = new EmbedBuilder()
      .setTitle("Retraining the AI")
      .setDescription("Retraining the AI. This may take a while...")
      .setColor(0xffff00);

    const message = await interaction.reply({ embeds: [Rembed] });

    const successEmbed = new EmbedBuilder()
      .setTitle("Success")
      .setDescription("The AI has been retrained successfully.")
      .setColor(0x00FF00);

    const progressBarInterval = setInterval(async() => {
      const currentPercentage = Math.floor((Date.now() - startTime) / 100);
      const progressBar = generateProgressBar(currentPercentage);

      message.edit({
        embeds: [Rembed],
        components: [progressBar.toJSON()],
      });      

      if (currentPercentage >= 100) {
        clearInterval(progressBarInterval);

        message.edit({
          embeds: [successEmbed],
          components: [],
        });
        await Train();
      }
    }, 500);

  }
};