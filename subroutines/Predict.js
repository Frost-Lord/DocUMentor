const tf = require("@tensorflow/tfjs-node");
const Session = require("../src/NeuralNetwork/Session");
const fs = require('fs');

const Dataset = JSON.parse(fs.readFileSync("./src/database/db.json"));

let model = Session.getModel();
let sentenceEncoder = null;

async function loadModelAndEncoder() {
  if (!model) {
    model = await tf.loadLayersModel("file://./src/model/model.json");
    Session.addModel(model, "Default");
  }
  sentenceEncoder = await Session.loadSentenceEncoder();
}

loadModelAndEncoder();

async function Predict(text) {
  const xPredict = await sentenceEncoder.embed([text.toLowerCase()]);
  const predictionTensor = model.predict(xPredict);
  const highestIndex = predictionTensor.argMax(-1).dataSync()[0];

  const types = Object.keys(Dataset);
  const predicted = types[highestIndex];

  let possibleResponses = Dataset[predicted].responses;
  const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

  return {
    predicted,
    response,
    text
  };
}

module.exports = Predict;