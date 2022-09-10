const { Client, CommandInteraction, InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
	  
		let confirmButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Success)
		.setLabel('Confirm')
		.setCustomId('confirm_mail')
		.setEmoji('✔️')

		  let cancleButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel('Cancel')
		.setCustomId('cancle_mail')
		.setEmoji('❌')

		let optionsRow = new ActionRowBuilder()
		.addComponents([confirmButton])
		.addComponents([cancleButton])
    
    if (interaction.customId === "close_mail") {
		interaction.update({ components: [optionsRow]})
	} else {
		if (interaction.customId === "cancle_mail") {

		let delButton2 = new ButtonBuilder()
		.setStyle(ButtonStyle.Danger)
		.setLabel('Delete')
		.setCustomId('close_mail')
		.setEmoji('❌')

		let deleteRow2 = new ActionRowBuilder()
		.addComponents([delButton2])

		interaction.update({ components: [deleteRow2]})

		} else {
			if (interaction.customId === "confirm_mail") {
				interaction.message.channel.delete();
			}
		}
		
	} else if(interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if(!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err)
        interaction.reply({content: `Something went wrong while executing this command.`, ephemeral: true})
      }

    } else if(interaction.isButton()) {
      const { buttons } = client;
      const button = buttons.get(interaction.customId);

      if(!button) return new Error("There is no code for this button!")

      try {
        await button.execute(interaction, client)
      } catch (error) {
        console.error(error)
      }


    } else if(interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const modal = modals.get(interaction.customId)

      if(!modal) return new Error("There is no code for this modal!")

      try {
        await modal.execute(interaction, client)
      } catch (error) {
        console.error(error)
      }
    } else if(interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName)
      if(!contextCommand) return;

      try {
        await contextCommand.execute(interaction.client);
      } catch (error) {
        console.error(error);
      }
    }

  },
};
