const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder")

const trainModel = async (progressCallback) => {
    var data = JSON.parse(fs.readFileSync("./src/database/db.json"));
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
            activation: "relu",
            units: 128
        })
    );
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ activation: 'relu', units: 64 }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(
        tf.layers.dense({
            inputShape: [xTrain.shape[1]],
            activation: "softmax",
            units: types.length
        })
    );
    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(0.001),
        metrics: ["accuracy"]
    });

    const startTime = Date.now();
    let runningAccuracySum = 0;
  
    const onEpochEnd = async (epoch, logs) => {
        const elapsedTime = Date.now() - startTime;
        const estimatedTime = (elapsedTime / (epoch + 1)) * (300 - epoch - 1);

        const formatTime = (ms) => {
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            return `${hours}h ${minutes}m ${seconds}s`;
        };

        runningAccuracySum += logs.acc;
        const runningAccuracyAvg = runningAccuracySum / (epoch + 1);
      
        progressCallback({
            epoch: epoch + 1,
            totalEpochs: 300,
            accuracy: parseFloat((runningAccuracyAvg * 100).toFixed(2)) + "%",
            loss: parseFloat((logs.loss * 100).toFixed(2)),
            elapsedTime: formatTime(elapsedTime),
            estimatedTime: formatTime(estimatedTime)
        });
    };

    await model.fit(xTrain, yTrain, {
        batchSize: 32,
        validationSplit: 0.1,
        shuffle: true,
        epochs: 300,
        callbacks: { onEpochEnd }
    });
    return model;
}

module.exports = trainModel;