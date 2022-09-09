const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Atur volume musik.")
    .addNumberOption(
        option =>
        option.setName("percent")
        .setDescription("Misal 50, berarti 50%")
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

        const Volume = options.getNumber("percent")
        if(Volume > 100 || Volume < 1) return interaction.reply({embeds: [Response.setDescription("Kamu perlu memasukkan nomor antara 1 sampai 100")], ephemeral: true});

        client.distube.setVolume(voiceChannel, Volume)
        return interaction.reply({embeds: [Response.setDescription(`🔊 Volume berhasil dirubah ke \`${Volume}%\``)]})
    }
}