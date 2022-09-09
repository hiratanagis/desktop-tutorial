const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Atur Repeat Mode."),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { options, member, channel, guild } = interaction;
        const voiceChannel = member.voice.channel;

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("🎸 Music")
        .setTimestamp(Date.now())

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ Kamu harus berada di voice channel terlebih dahulu.")], ephemeral: true})
        const security = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(security && voiceChannel.id !== security.id) return interaction.reply({embeds: [Response.setDescription(`❌ Aku sudah berada di <#${security.id}>`)], ephemeral: true})

        const queue = await client.distube.getQueue(voiceChannel);
        if(!queue) return interaction.reply({content: '🛑 Tidak ada yang dimainkan sekarang', ephemeral: true})

        let mode = await client.distube.setRepeatMode(queue);

        return interaction.reply({embeds: [Response.setDescription(`🔁 Repeat Mode diatur ke: ${mode = mode ? mode == 2 ? "Queue" : "Song" : "Off"}`)], ephemeral: true})
    }
}