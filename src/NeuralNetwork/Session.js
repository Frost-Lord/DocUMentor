let Sessions = {};
let model = undefined;

module.exports = {
    add: function (id, type) {
        Sessions[id] = {
            mode: "pattern",
            type: type,
            messages: [],
            lastmessage: new Date().getTime(),
        };
    },
    remove: function (id) {
        delete Sessions[id];
    },
    addResponse: function (id, type, dataset, question) {
        Sessions[id] = {
            mode: "response",
            type: type,
            messages: [],
            question: question,
            lastmessage: new Date().getTime(),
            dataset: dataset,
        }
    },
    addModel(trainedModel) {
        model = trainedModel;
    },
    getModel() {
        return model;
    },
}