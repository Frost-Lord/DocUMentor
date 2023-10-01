const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const tf = require('@tensorflow/tfjs-node');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Shows the current status of the AI model—whether it's training, idle, or evaluating"),
  async run(client, interaction) {

    await interaction.deferReply();

    const model = await tf.loadLayersModel(`file://./src/model/model.json`);

    const weights = model.getWeights();
    const weightShapes = weights.map(w => w.shape.join(" x ")).join(", ");
    const layerDetails = model.layers.map(layer => `${layer.name}: ${layer.outputShape.join(' x ')}`).join("\n");

    const truncatedLayerDetails = layerDetails.length > 1024 ? `${layerDetails.substring(0, 1020)}...` : layerDetails;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('AI Model:')
      .setDescription(`**Layers:** \n ${truncatedLayerDetails} \n **Weights Shape:** \n ${weightShapes}`)
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });
  }
};
