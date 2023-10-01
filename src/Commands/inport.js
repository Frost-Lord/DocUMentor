const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inport")
    .setDescription("Allows the user to import training data or a pretrained model")
    .addAttachmentOption(option =>
      option.setName("model")
        .setDescription("AI model")
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName("weights")
        .setDescription("AI weights")
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName("database")
        .setDescription("AI training database")
        .setRequired(true)),
  async run(client, interaction) {
    await interaction.deferReply();

    const model = interaction.options.getAttachment("model");
    const weights = interaction.options.getAttachment("weights");
    const database = interaction.options.getAttachment("database");

    if (!model && !weights && !database) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You must upload at least one file.")
        .setColor(0xFF0000);
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle("Importing data...")
      .setDescription("Please wait while we import the data.")
      .setColor(0x00FF00);

    const message = await interaction.editReply({ embeds: [embed] });

    if (database) {
      const response = await axios.get(database.url);
      fs.writeFileSync("./src/database/db.json", JSON.stringify(response.data));
    }

    if (model) {
      const response = await axios.get(model.url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, "binary");
      fs.writeFileSync(`./src/model/${model.name}`, buffer);
    }

    if (weights) {
      const response = await axios.get(weights.url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, "binary");
      fs.writeFileSync(`./src/model/${weights.name}`, buffer);
    }

    const embed2 = new EmbedBuilder()
      .setTitle("Data:")
      .setDescription("Your data has been successfully imported!")
      .setColor(0x00FF00);

    await message.edit({ embeds: [embed2] });
  }
};