const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const Session = require("../src/NeuralNetwork/Session");
const fs = require('fs');

async function Predict (text) {

    let model = Session.getModel();
    if (!model) {
      model = await tf.loadLayersModel("file://./src/model/model.json");
      Session.addModel(model);
    }

    const sentenceEncoder = await use.load();
    const xPredict = await sentenceEncoder.embed([text.toLowerCase()]);
    let prediction = await model.predict(xPredict).array();
    prediction = prediction[0];

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

    return {
        predicted,
        response,
        text
    }

}

module.exports = Predict;