const { 
  Message, 
  EmbedBuilder,
  MessageType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  bold,
  italic,
  codeBlock,
  InteractionType
  } = require('discord.js')

module.exports = {
    name: "messageCreate",
    once: false,
	/**
     * @param {Message} message
     */
    async execute(message, client) {
  if (message.author.bot) return;

  const guild = client.guilds.cache.get("976469136186171424");

  if (!guild) {
    console.error('[CRASH] Guild is not valid.'.red);
    return process.exit();
  }

  const category = guild.channels.cache.get("1006828861964689438");

  const channel = guild.channels.cache.find(
    x => x.name === message.author.id && x.parentId === category.id
  );
  
  // If the message in a DM channel:
	if (message.channel.type == ChannelType.DM) {

    // The Modmail system:
    if (!channel) {
      let embedDM = new EmbedBuilder()
        .setTitle("Mail Dibuat:")
        .setDescription(`Mod Mailmu berhasil dibuat dengan detail sebagai berikut:`)
        .addFields(
          { name: "Message", value: `${message.content || italic("(Tidak ada pesan yang dikirim, mungkin media atau pesan embed yang dikirim, atau mungkin error)")}` }
        )
        .setColor('Green')
        .setFooter(
          {
            text: "Kamu dapat mengklik **Close** button untuk menutup mail ini."
          }
        )

      if (message.attachments.size) {
        embedDM.setImage(message.attachments.map(img => img)[0].proxyURL);
        embedDM.addFields(
          { name: "Media(s)", value: italic("(Media yang dikirim)") }
        )
      };
      
      message.reply(
        {
          embeds: [
            embedDM
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_dm')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Secondary),
              )
          ]
        }
      );

      const channel = await guild.channels.create({
        name: message.author.id,
        type: ChannelType.GuildText,
        parent: category,
        topic: `Mod Mail telah dibuat oleh ${message.author.tag}.`
      }).catch(console.log);

      let embed = new EmbedBuilder()
        .setTitle("Mod Mail Dibuat:")
        .addFields(
          { name: "User", value: `${message.author.tag} (\`${message.author.id}\`)` },
          { name: "Message", value: `${message.content.substr(0, 4096) || italic("(Tidak ada pesan yang dikirim, mungkin media atau pesan embed yang dikirim, atau mungkin error)")}` },
          { name: "Created on", value: `${new Date().toLocaleString()}` },
        )
        .setColor('Blue')

      if (message.attachments.size) {
        embed.setImage(message.attachments.map(img => img)[0].proxyURL);
        embed.addFields(
          { name: "Media(s)", value: italic("(Media ada dibawah)") }
        )
      };

      return channel.send(
        {
          content: "<@1005060869723537491>, <@976472985051484241>",
          embeds: [
            embed
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_channel')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Danger),
              )
          ]
        }
      ).then(async (sent) => {
        sent.pin()
          .catch(() => { });
      });

    } else {
      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(Tidak ada pesan yang dikirim, mungkin media atau pesan embed yang dikirim, atau mungkin error)"))
        .setColor('Green');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return channel.send(
        {
          embeds: [
            embed
          ]
        }
      );
    }

    // If the message is in the modmail category:
  } else if (message.channel.type === ChannelType.GuildText) {
    if (!category) return;

    if (message.channel.parentId === category.id) {
      const requestedUserMail = guild.members.cache.get(message.channel.name);

      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(Tidak ada pesan yang dikirim, mungkin media atau pesan embed yang dikirim, atau mungkin error)"))
        .setColor('Red');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return requestedUserMail.send(
        {
          embeds: [
            embed
          ]
        }
      ).catch(() => { });
    } else return;
	} 
	}
}