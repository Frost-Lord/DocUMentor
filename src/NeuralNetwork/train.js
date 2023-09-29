const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder")

const trainModel = async (progressCallback) => {
    var data = JSON.parse(fs.readFileSync("../database/db.json"));
    var trainingData = [];

    const types = Object.keys(data);

    for (let [key, value] of Object.entries(data)) {
        value.patterns.forEach(msg => {
            trainingData.push({ type: key, message: msg });
        });
    }

    var sentenceEncoder = await use.load();
    var sentences = trainingData.map(t => t.message.toLowerCase());
    var xTrain = await sentenceEncoder.embed(sentences);

    var yTrain = tf.tensor2d(
        trainingData.map(t => {
            return types.map(type => (t.type === type ? 1 : 0));
        })
    );

    const model = tf.sequential();
    model.add(
        tf.layers.dense({
            inputShape: [xTrain.shape[1]],
            activation: "softmax",
            units: types.length
        })
    )
    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(0.001),
        metrics: ["accuracy"]
    });

    const onEpochEnd = async (epoch, logs) => {
        console.log('Accuracy', logs.acc);
        console.log(`Epoch ${epoch} of 300 completed.`);
        progressCallback(epoch + 1, 300);
    };

    await model.fit(xTrain, yTrain, {
        batchSize: 32,
        validationSplit: 0.1,
        shuffle: true,
        epochs: 300,
        callbacks: { onEpochEnd }
    }).then(info => {
        console.log('Final accuracy', info.history.acc);
    });
    return model;
}

module.exports = trainModel;