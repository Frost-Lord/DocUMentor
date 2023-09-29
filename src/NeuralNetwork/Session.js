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
    save: function (id) {
        var SessData = Sessions[id];
        if (!SessData.messages.length) return;

        var Dataset = JSON.parse(Fs.readFileSync("../database/db.json"));

        SessData.messages.forEach(msg => {
            if (Dataset[SessData.type][SessData.mode + "s"].find(c => c == msg)) return;
            Dataset[SessData.type][SessData.mode + "s"].push(msg);
        });

        Fs.writeFileSync("../database/db.json", JSON.stringify(Dataset));
    },
    addModel(trainedModel) {
        model = trainedModel;
    },
    getModel() {
        return model;
    },
}