const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Matikan lagu")
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;
        
        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("đ¸ Music")
        .setTimestamp(Date.now())

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("â Kamu harus berada di voice channel terlebih dahulu.")], ephemeral: true})
        const security = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(security && voiceChannel.id !== security.id) return interaction.reply({embeds: [Response.setDescription(`â Aku sudah berada di <#${security.id}>`)], ephemeral: true})

        const queue = await client.distube.getQueue(voiceChannel);
        if(!queue) return interaction.reply({content: 'đ Tidak ada yang dimainkan sekarang', ephemeral: true})

        await queue.stop(voiceChannel)
        return interaction.reply({embeds: [Response.setDescription('âšī¸ Musik berhasil dimatikan.')]})
    }
}