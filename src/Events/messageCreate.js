const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const Predict = require("../../subroutines/Predict")

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        let client = message.client;
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        if (!message.content) return;

        const data = await Predict(message.content)

        
    const buttons = [
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(`Open in thread`)
          .setCustomId('openinthread')
          .setEmoji("🧵")
      ];
      
      if (global.selflearning === true) {
        buttons.unshift(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel(`Correct`)
            .setCustomId('correctguess')
            .setEmoji("✅"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel('Incorrect')
            .setCustomId('incorrectguess')
            .setEmoji('❌')
        );
      }
      
      const row = new ActionRowBuilder()
        .addComponents(buttons);
  
      const embed = new EmbedBuilder()
      .setTitle(`**Prediction**: ${data.predicted}`)
      .setDescription(`>>>${data.response}`)
      .setColor(0x0099ff);
  
      if (global.selflearning === false && global.threads === false) {
        await message.reply({ embeds: [embed] });
      } else {
        await message.reply({ embeds: [embed], components: [row], });
      }

    }
};