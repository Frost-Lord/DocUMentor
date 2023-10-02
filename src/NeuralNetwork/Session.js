const crypto = require('crypto');
const use = require("@tensorflow-models/universal-sentence-encoder");

let model = undefined;
let sentenceEncoder = null;
let modelHistory = {};

module.exports = {
    history: function (id) {
        if (id && modelHistory[id]) {
            return modelHistory[id];
        }
        return Object.keys(modelHistory).map(key => ({
            id: key,
            ...modelHistory[key],
        }));
    },
    addModel(trainedModel, accuracy) {
        const id = crypto.randomBytes(16).toString('hex');
        modelHistory[id] = {
            json: trainedModel.toJSON(),
            weights: trainedModel.getWeights(),
            accuracy: accuracy
        };
        model = trainedModel;
        return id;
    },
    setAsCurrentModel(id) {
        if (id && modelHistory[id]) {
            model = modelHistory[id];
        }
    },
    loadSentenceEncoder: async function() {
        if (!sentenceEncoder) {
            sentenceEncoder = await use.load();
          }
          return sentenceEncoder;
    },
    getModel: async function() {
        if (!model) {
            model = await tf.loadLayersModel("file://./src/model/model.json");
            this.addModel(model, "Default");
        }
        return model;
    },
};