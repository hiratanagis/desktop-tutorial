const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Odd is better.'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);
/* Bot discord.js setup */

const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { User, Channel, GuildMember, GuildScheduledEvent, Message, Reaction, ThreadMember } = Partials
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent } = GatewayIntentBits;

const client = new Client({ 
	intents: 131071,
	partials: [User, Channel, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction]
});

/* Client Config */
client.config = require('../config.json')
client.color = parseInt(client.config.color.replace("#", "0x"))

/* Music System */
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')

client.distube = new DisTube(client, {
  leaveOnEmpty: true,
  nsfw: true,
  emitNewSongOnly: true,
  leaveOnFinish: true,
  plugins: [ new SpotifyPlugin(), new SoundCloudPlugin() ] 
})
module.exports = client;

/* Giveaway System */
require('./Systems/GiveawaySystem')(client);

/* Client Collections */
client.voiceGenerator = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();

/* Discord Handler */
const { loadEvents } = require('./handlers/EventHandler')
const { loadCommands } = require('./handlers/CommandHandler');
const { loadComponents } = require('./handlers/ComponentHandler');

/* Client Login */
client.login(process.env.TOKEN)
.then(() => {
    /* Start Handler */
    loadEvents(client);
    loadCommands(client);
    loadComponents(client);
})