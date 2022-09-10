const { Client, GuildChannel, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "channelDelete",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     * @param { GuildChannel } channel
     */
    async execute(channel, client) {
		let guild = client.guilds.cache.get("976469136186171424");
		if (!guild) console.log("No Guild!");
		
		let category = guild.channels.cache.get("1006828861964689438")
		if (channel.parentId !== category.id) return;

		const user = guild.members.cache.find((user) => user.id == channel.name)
		if (!user) return;

		const deletedEmbed = new EmbedBuilder()
		.setTitle("Mod Mail-mu udah di tutup")
		.setDescription("Staff telah menghapus Mod Mail-mu!")
		.setColor("#FFFFFF")
		user.send({ embeds: [deletedEmbed] })
    }
}