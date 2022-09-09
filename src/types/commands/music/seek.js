const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Skip beberapa detik.")
    .addNumberOption(
        option =>
        option.setName("time")
        .setDescription("Berapa detik")
        .setRequired(true))
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
        .setTitle("🎸 Music")
        .setTimestamp(Date.now())

        const time = options.getNumber("time")

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ Kamu harus berda di voice channel terlebih dahulu.")], ephemeral: true})
        const security = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(security && voiceChannel.id !== security.id) return interaction.reply({embeds: [Response.setDescription(`❌ Aku sudah berada di <#${security.id}>`)], ephemeral: true})

        const queue = await client.distube.getQueue(voiceChannel);
        if(!queue) return interaction.reply({content: '🛑 Tidak ada yang dimainkan sekarang', ephemeral: true})

        queue.seek(time)
        return interaction.reply({embeds: [Response.setDescription(`Seek ke ${time}s!`)]})
    }
}