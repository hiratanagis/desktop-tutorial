const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Tambahkan filter ke musik.")
    .addStringOption(
        option => 
        option.setName('name')
        .setDescription('Silahkan pilih filter yang kamu inginkan.')
        .setRequired(true)
        .addChoices(
            { name: 'off', value: 'off' },
            { name: '3d', value: '3d'},
            { name: 'bassboost', value: 'bassboost'},
            { name: 'earwax', value: 'earwax'},
            { name: 'echo', value: 'echo'},
            { name: 'gate', value: 'gate'},
            { name: 'haas', value: 'karaoke'},
            { name: 'mcompand', value: 'mcompand'},
            { name: 'nightcore', value: 'nightcore'},
        )
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        const filter = options.getString('name')
        
        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTitle("🎸 Music")
        .setTimestamp(Date.now())

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ Kamu harus berada di voice channel terlebih dahulu.")], ephemeral: true})
        const security = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(security && voiceChannel.id !== security.id) return interaction.reply({embeds: [Response.setDescription(`❌ Aku sudah berada di <#${security.id}>`)], ephemeral: true})

        const queue = await client.distube.getQueue(voiceChannel);
        if(!queue) return interaction.reply({content: '🛑 Tidak ada yang dimainkan sekarang', ephemeral: true})

        if(filter == 'off' && queue.filters.size ) queue.filters.clear();
        else if(Object.keys(client.distube.filters).includes(filter)) {
            if(queue.filters.has(filter)) queue.filters.remove(filter)
            else queue.filters.add(filter)
        }

        return interaction.reply({embeds: [Response.setDescription(`Filter: \`${queue.filters.names.join(', ') || 'Off'}\``)]})
    }
}