const crypto = require('crypto');

let model = undefined;
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
    getModel() {
        return model;
    },
};