const { Client, CommandInteraction, InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, bold, italic, codeBlock } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
	  if(interaction.isButton()) {
		
	const ID = interaction.customId;

    // Close Button in Text channels:
    if (ID == "close_button_created_mail_channel") {
      const modal = new ModalBuilder()
        .setCustomId('modal_close')
        .setTitle('Closing Mail:');

      const REASON_TEXT_INPUT = new TextInputBuilder()
        .setCustomId('modal_close_variable_reason')
        .setLabel("Reason of closing the mail.")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const ACTION_ROW = new ActionRowBuilder()
        .addComponents(REASON_TEXT_INPUT);

      modal.addComponents(ACTION_ROW);

      await interaction.showModal(modal)
        .catch(() => { });

      // Close Button in DMs:
    } else if (ID == "close_button_created_mail_dm") {
      const guild = client.guilds.cache.get("976469136186171424");

      const category = guild.channels.cache.get("1006828861964689438");

      const channelRECHECK = guild.channels.cache.find(
        x => x.name === interaction.user.id && x.parentId === category.id
      );

      if (!channelRECHECK) return interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Sudah ditutup sama Admin.`)
              .setColor('Yellow')
          ],
          ephemeral: true
        }
      );

      await channelRECHECK.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return interaction.reply(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Mail Closed:')
                  .setDescription(`Mod Mailmu telah ditutup.`)
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    }

    } else if(interaction.type == InteractionType.ModalSubmit) {
		const ID = interaction.customId;

    if (ID == "modal_close") {
      const guild = client.guilds.cache.get("976469136186171424");

      const requestedUserMail = guild.members.cache.get(interaction.channel.name);

      let reason = interaction.fields.getTextInputValue('modal_close_variable_reason');
      if (!reason) reason = "No reason was provided.";

      interaction.reply(
        {
          content: "Closing..."
        }
      ).catch(() => { });

      return interaction.channel.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return await requestedUserMail.send(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Mail Closed:')
                  .setDescription(`Mod Mailmu telah ditutup.`)
                  .addFields(
                    { name: "Reason", value: `${italic(reason)}` }
                  )
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    } else return;
	} else return;
}
}