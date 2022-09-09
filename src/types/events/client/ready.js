const { Client } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: "ready",
    rest: false,
    once: false,
    /**
     * @param { Client } client
     */
    async execute(client) {
        /* Connect to the database */
        const database = client.config.database;
        if(!database) return console.log('Please add a Database!');

        mongoose.connect(database, {}).then(() => {
            console.log(`Connected successfully to the Database!`);
        })

        console.log(`Logged in as ${client.user.tag}!`);

        updateActivity(client, client.config.activityInterval);

    }
}

/**
 * @param {Client} client
 */
 async function updateActivity(client, interval) {
  
    const activities = client.config.activities

    const servercount = client.guilds.cache.size;
    const usercount = []

    await client.guilds.cache.forEach(guild => {
      guild.members.cache.forEach(member => {
        if(member.user.bot) return;
        usercount.push(member)
      })
    })
  
    setInterval(() => {
      const status = activities[Math.floor(Math.random() * activities.length)]
      client.user.setActivity(status.replace("{servercount}", servercount))
    }, interval*1000)
}