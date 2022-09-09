const { EmbedBuilder, Client, SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Ngasih ulti Lee Sin ke member!")
    .addUserOption(
        option =>
        option.setName("user")
        .setDescription("Pilih member yang ingin diulti.")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("ALasannya.")
        .setRequired(false))
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member } = interaction;

        const Target = options.getMember("user");
        const Reason = options.getString("reason");

        const Response = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp(Date.now());

        /* Check if the user is kickable and if not send an error message! */
        if(Target.kickable) {
        
            /* Check if a reason is given */
            if(Reason) {
                await Target.kick(Reason);
                Response.setDescription(`${member} Ngasih ulti Lee Sin kepada ${Target}! \n **Alasannya:** ${Reason}`);
                return interaction.reply({embeds: [Response]});
            } else {
                await Target.kick();
                Response.setDescription(`${member} Ngasih ulti Lee Sin kepada ${Target}! \n **Alasannya:** TIDAK ADA`);
                return interaction.reply({embeds: [Response]});
            }
        
        } else {
            /* Send Error Message */
            Response.setDescription(`❌ Tidak bisa nge-kick ${Target} karena admin kebal hukum!`)
            return interaction.reply({embeds: [Response]});
        }
    } 
}