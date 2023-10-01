const { EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const trainAI = require("../NeuralNetwork/train");
const Session = require("../NeuralNetwork/Session");

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

    await interaction.deferReply();

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

    
    const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel(`Save`)
        .setCustomId('savemodel')
        .setEmoji("✅")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Delete")
        .setCustomId('deletemodel')
        .setEmoji("🗑️")
        .setDisabled(false),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Re-Train")
        .setCustomId('retrainmodel')
        .setEmoji("⚙️")
        .setDisabled(false)
    );

    async function optionembd(message, acc){
      const successEmbed = new EmbedBuilder()
      .setTitle("Success")
      .setDescription(`The AI has been retrained successfully. \n **Accuracy:** ${acc}% `)
      .setColor(0x00FF00);

      message.edit({
        embeds: [successEmbed],
        components: [row2],
      });
    }

    let AccData = 'Default'

      const updateProgressBar = async(progressData) => {
        let { epoch, totalEpochs, accuracy, loss, elapsedTime, estimatedTime } = progressData;

        AccData = accuracy;
        
        const percentage = (parseFloat(epoch / totalEpochs) * 100).toFixed(2);
        const progressBar = generateProgressBar(percentage);

        const Rembed = new EmbedBuilder()
        .setTitle("Retraining the AI")
        .setDescription(`Current Epoch: ${epoch}/${totalEpochs}\nAccuracy: ${accuracy}\nLoss: ${loss}\nElapsed Time: ${elapsedTime}\nEstimated Time Remaining: ${estimatedTime}`)
        .setColor(0xffff00);
  
        const message = await interaction.editReply({ embeds: [Rembed] });

        message.edit({
          embeds: [Rembed],
          components: [progressBar.toJSON()],
        });

        if (percentage >= 100) {
          optionembd(message, accuracy)
        }
      };

      let Model = await trainAI(updateProgressBar);
      Model.save("file://./src/model");
      Session.addModel(Model, AccData);

  }
};