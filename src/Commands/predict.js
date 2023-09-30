const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const Session = require("../NeuralNetwork/Session");
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("predict")
    .setDescription("predict a response")
    .addStringOption(option =>
      option.setName('input')
        .setRequired(true)
        .setDescription('enter what you want to be predicted')),
  async run(client, interaction) {

    let model = Session.getModel();
    if (!model) {
      model = await tf.loadLayersModel("file://./src/model/model.json");
      Session.addModel(model);
    }

    await interaction.deferReply();

    const sentenceEncoder = await use.load();
    const text = interaction.options.getString("input");

    const xPredict = await sentenceEncoder.embed([text.toLowerCase()]);
    let prediction = await model.predict(xPredict).array();
    prediction = prediction[0]; // Assuming batch size of 1

    let highest = [0, 0];
    for (let i = 0; i < prediction.length; ++i) {
      if (highest[1] < prediction[i]) {
          highest[0] = i;
          highest[1] = prediction[i];
      }
    }

    const Dataset = JSON.parse(fs.readFileSync("./src/database/db.json"));
    const types = Object.keys(Dataset);
    const predicted = types[highest[0]];

    let possibleResponses = Dataset[predicted].responses;
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    const embed = new EmbedBuilder()
    .setTitle("Prediction:")
    .setDescription(`Input: ${text} \n Category: ${predicted} \n Response: ${response}`)

    await interaction.editReply({ embeds: [embed] });
  }
};
