const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs')
module.exports = {
    data: new SlashCommandBuilder()
    .setName("skillorder")
    .setDescription("Cari rekomendasi skill order dari wildriftfire.com")
    .addStringOption(
        option =>
        option.setName("champion")
        .setDescription("Masukkan Nama Champion")
        .setRequired(true)
    ),

    async execute(interaction, client) {
			const { options, member, channel, guild } = interaction;
    		var data = JSON.parse(fs.readFileSync("./src/database/data.json", "utf8"));
				var cari = options.getString("champion").toLowerCase();
	
				var nama = options.getString("champion").toUpperCase();
		    try {
					const embed = new EmbedBuilder()
					.setColor(client.color)
					.setAuthor({ name: String(nama) })
					.setTitle("SKILL ORDER")
					.setDescription(`Source: [wildriftfire](${data[cari].link})
[Klik disini untuk membantu Yanto agar tidak ngefeed lagi](https://sociabuzz.com/hiratanagis/tribe)`)
					.setThumbnail(data[cari].icon)
					.setImage(data[cari].skillorder)
					.setTimestamp()
					.setFooter({ text: 'Jika gambar tidak muncul, coba gunakan command itu lagi' });
					interaction.reply({embeds: [embed], ephemeral: false})
		    } catch (e) {return interaction.reply({content: '**DATABASENYA BELUM ADA BANG**', ephemeral: true})}
		}
}