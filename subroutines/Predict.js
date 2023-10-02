const tf = require("@tensorflow/tfjs-node");
const Session = require("../src/NeuralNetwork/Session");
const fs = require('fs');

const Dataset = JSON.parse(fs.readFileSync("./src/database/db.json"));

async function Predict(text) {
  const model = await Session.getModel();
  const sentenceEncoder = await Session.loadSentenceEncoder();
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