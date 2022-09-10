const { ChannelType, Message, EmbedBuilder, MessageType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: "messageCreate",
    once: false,
	/**
     * @param {Message} message
     */
    async execute(message, client) {
		let guild = client.guilds.cache.get("976469136186171424");
		if (!guild) console.log("No Guild!");
		
		if (message.author.bot) return;
		if (message.channel.type === ChannelType.DM) {
			let mailName = `${message.author.id}`

			let usersChannel = await guild.channels.cache.find(ch => ch.name === mailName.toLowerCase());
			if (!usersChannel) {

				const createdEmbed = new EmbedBuilder()
				.setAuthor({name: `${message.author.tag}`,iconURL: message.author.displayAvatarURL({ dynamic: true })})
				.setTitle("No Mail Opened")
				.setDescription(message.content)
				.setColor("#FFFFFF")

				let categ = guild.channels.cache.get("1006828861964689438")
				if (!categ) console.log("No Category!")
				
				let permissions = {
					id: "1005060869723537491",
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
				}

				guild.channels.create(`${message.author.id}`, {
					type: "text",
					parent: categ,
					permissionOverwrites: [
						{
							id: guild.roles.everyone,
							deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
						},
						permissions
					],
				}).then(async (ch) => {
					let role = ch.guild.roles.cache.find((r) => r.id == "1005060869723537491")
					if (!role) console.log("No role!")

					const openedUserEmbed = new EmbedBuilder()
					.setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
					.setTitle("Mod Mail telah dibuat!")
					.setDescription("Kamu telah membuat Mod Mail Ticket!")
					.setTimestamp()
					.setColor("#FFFFFF")
					message.author.send({ embeds: [openedUserEmbed] })

					let usersCreatedChannel = await guild.channels.cache.find(ch => ch.name === mailName.toLowerCase());

					let delButton = new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setLabel('Delete')
					.setCustomId('close_mail')
					.setEmoji('❌')

					let deleteRow = new ActionRowBuilder()
					.addComponents([delButton])

					const openedStaffEmbed = new EmbedBuilder()
					.setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
					.setTitle("Seseorang membuka Mod Mail")
					.setDescription(`**User: ${message.author.tag} (${message.author.id})**\n\n ${message.content}`)
					.setTimestamp()
					.setColor("#FFFFFF")

					usersCreatedChannel.send({ embeds: [openedStaffEmbed], components: [deleteRow] })
				})
			} else {
				let usersHadChannel = await guild.channels.cache.find(ch => ch.name === mailName.toLowerCase());

				const userHadEmbed = new EmbedBuilder()
				.setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
				.setTitle(`${message.content}`)
				.setTimestamp()
				.setColor("#FFFFFF")
				usersHadChannel.send({ embeds: [userHadEmbed] })
			}

		// Sent In DM's //
		} else {
			if (message.channel.type === ChannelType.GuildText) {
				let categor = guild.channels.cache.get("1006828861964689438")
				if (message.channel.parentId !== categor.id) return;

				const usertosend = message.guild.members.cache.find((user) => user.id == message.channel.name)
				if (!usertosend) return;

				const staffSendEmbedA = new EmbedBuilder()
				.setAuthor({name: "Staff Team"})
				.setTitle(`${message.content}`)
				.setTimestamp()
				.setColor("#FFFFFF")
				usertosend.send({ embeds: [staffSendEmbedA] })
			}
		}
	}
}
