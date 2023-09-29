const { InteractionType } = require("discord.js");

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction) => {
		let client = interaction.client;
		if (interaction.type == InteractionType.ApplicationCommand) {
			if (interaction.user.bot) return;
			try {
				const command = await client.slashcommands.get(interaction.commandName)
				if (!command) return;
				await command.run(client, interaction)
			} catch(e) {
				console.log(e);
				interaction.reply({ content: "A problem was encountered while running the command! Please try again.", ephemeral: true })
			}
		}

		if (interaction.type == 3) { //button
			if (interaction.user.bot) return;
			try {
                
			} catch(e) {
				console.log(e)
				interaction.reply({ content: "A problem was encountered while running the button! Please try again.", ephemeral: true })
			}
		}
	}
}