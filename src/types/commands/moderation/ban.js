const { Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ngasih ulti Lee Sin plus root Morgana ke member!")
    .addUserOption(
        option => 
        option.setName("user")
        .setDescription("Pilih user yang ingin diulti Lee Sin plus root Morgana")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Alasannya")
        .setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * @param { ChatInputCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const Target = options.getMember("user");
        const Reason = options.getString("reason");

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now());

        /* Check if the user is bannable and if not send an error message! */
        if(Target.bannable) {
        
            /* Check if a reason is given */
            if(Reason) {
                await interaction.guild.bans.create(Target, {reason: Reason});
                Response.setDescription(`${member} ngasih ulti Lee Sin plus root Morgana kepada ${Target}! \n **Alasannya:** ${Reason}`);
                return interaction.reply({embeds: [Response]});
            } else {
                await interaction.guild.bans.create(Target);
                Response.setDescription(`${member} ngasih ulti Lee Sin plus root Morgana kepada ${Target}! \n **Alasannya:** TIDAK ADA`);
                return interaction.reply({embeds: [Response]});
            }
        
        } else {
            /* Send Error Message */
            Response.setDescription(`❌ Tidak bisa nge-ban ${Target} karena admin kebal hukum!`)
            return interaction.reply({embeds: [Response]});
        }
    }
}