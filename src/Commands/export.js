const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDescription("Allows the user to export the model and/or the training data")
    .addBooleanOption(option =>
      option.setName('model')
        .setDescription('Export the model')
        .setRequired(false))
    .addBooleanOption(option =>
       option.setName('database')
         .setDescription('Export the database')
         .setRequired(false)),
  async run(client, interaction) {

    await interaction.deferReply();

    const model = interaction.options.getBoolean("model");
    const database = interaction.options.getBoolean("database");

    if (database === null && model === null) {
      const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You must request at least one type of data.")
        .setColor(0xFF0000);
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    const embed = new EmbedBuilder()
    .setTitle("Exporting data...")
    .setDescription(`Please wait while we export the data...`)
    .setColor(0x00FF00);

    const message = await interaction.editReply({ embeds: [embed] });

    const files = [];

    if (database === true) {
      const data = JSON.parse(fs.readFileSync("./src/database/db.json"));
      const databaseAttachment = new AttachmentBuilder(Buffer.from(JSON.stringify(data)), { name: 'database.json'});
      files.push(databaseAttachment);
    }

    if (model === true) {
      const modelAttachment = new AttachmentBuilder("./src/model/model.json", { name: 'model.json'});
      const weightsAttachment = new AttachmentBuilder("./src/model/weights.bin", { name: 'group1-shard1of1.bin'});

      files.push(modelAttachment);
      files.push(weightsAttachment);
    }

    const embed2 = new EmbedBuilder()
    .setTitle("Data:")
    .setDescription(`Attached to this embed is your requested data.`)
    .setColor(0x00FF00);

    await message.edit({ embeds: [embed2], files });
  }
};