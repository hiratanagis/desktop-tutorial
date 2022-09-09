const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Mainkan musik")
    .addStringOption(
        option => 
        option.setName("query")
        .setDescription("Masukkan judul atau link lagu tersebut")
        .setRequired(true)
    ),
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

        client.distube.play(voiceChannel, options.getString("query"), {
            textChannel: channel, 
            member: member
        })

        return interaction.reply({embeds: [Response.setDescription('🎼 Permintaan diterima')], ephemeral: true})
    }
}