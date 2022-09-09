const { EmbedBuilder } = require('@discordjs/builders')
const client = require('../../../bot')

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
  
  client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [
      new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({name: "NOW PLAYING", iconURL: client.user.displayAvatarURL()})
      .setTitle(song.name)
      //.setDescription('🎶')
      .addFields([
        { name: 'Diputar oleh', value: `\`\`\`${song.user.tag}\`\`\``, inline: true },
        { name: 'Durasi', value: `\`\`\`${song.formattedDuration}\`\`\``, inline: true},
        { name: 'Volume', value: `\`\`\`${queue.volume}%\`\`\``, inline: true},
        { name: 'Filter', value: `\`\`\`${queue.filters.names.join(', ') || 'Off'}\`\`\``, inline: true},
        { name: 'Loop', value: `\`\`\`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\`\`\``, inline: true},
      ])
    ]})
    )
  .on('addSong', (queue, song) =>
  queue.textChannel.send({embeds: [
    new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({name: "Menambahkan ke antrian", iconURL: client.user.displayAvatarURL()})
    .setTitle(song.name)
    .setDescription('✅ Berhasil menambahkan lagu ke antrian')
    .addFields([
      { name: 'Diminta oleh', value: `\`\`\`${song.user.tag}\`\`\``, inline: true },
      { name: 'Durasi', value: `\`\`\`${song.formattedDuration}\`\`\``, inline: true}
    ])
  ]})
  )
  .on('addList', (queue, playlist) =>
  queue.textChannel.send({embeds: [
    new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({name: "Menamahkan ke antrian", iconURL: client.user.displayAvatarURL()})
    .setTitle(playlist.name)
    .setDescription('✅ Berhasil menambahkan playlist ke antrian')
    .addFields([
      { name: 'Diminta oleh', value: `\`\`\`${playlist.user.tag}\`\`\``, inline: true },
      { name: 'Total lagu', value: `\`\`\`${playlist.songs.length}\`\`\``, inline: true}
    ])
  ]})
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ Yah.. error cuk: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', queue => queue.textChannel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription('Voice channel kosong, keluar dari voice channel...')]}))
  .on('searchNoResult', (message, query) =>
    message.channel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription(`❌ Tidak dapat menemukan \`${query}\`!`)]})
  )
  .on('finish', queue => queue.textChannel.send({embeds: [new EmbedBuilder().setColor(client.color).setDescription("`✅ Selesai!`")]}))