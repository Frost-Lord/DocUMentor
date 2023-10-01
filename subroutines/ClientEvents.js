const fs = require('fs');

const UpdateClient = async (channel, enabled, selflearning, threads) => {
    let Dataset = JSON.parse(fs.readFileSync("./src/database/StatsConf.json"));

    global.selflearning = selflearning;
    global.enabled = enabled;
    global.threads = threads;
    global.channel = channel ? channel.id : null;

    Dataset.Config.selflearning = global.selflearning;
    Dataset.Config.enabled = global.enabled;
    Dataset.Config.threads = global.threads;
    Dataset.Config.channel = global.channel;

    fs.writeFileSync("./src/database/StatsConf.json", JSON.stringify(Dataset));
}

module.exports = UpdateClient;
