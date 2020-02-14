const Discord = require('discord.js');

const {tierIDs} = require('../config.json');
module.exports = {
    name: "profile",
    description: "Shows how much cp you have.",
    aliases: ['prof', 'p'],
    modOnly: false,
    async execute(msg, args, client){
        const user = msg.mentions.users.first() || msg.author;
        if(user.bot) return msg.reply(` bots don't have profiles!`);
        const {fetchBank} = await (require('../spreadsheet.js'));
        const userMember = await msg.guild.fetchMember(user);
        const Bronze = msg.guild.roles.get(tierIDs[0]);
        const userTier = userMember.roles.find(tier => tierIDs.includes(tier.id)) || Bronze;
        try{
            const userBank = await fetchBank(user.id);
            const gamesPlayed = userBank.wins + userBank.losses;
            const winPercentage = (userBank.wins / gamesPlayed) * 100 || NaN;
            const profile = new Discord.RichEmbed()
                            .setColor('#8a42f5')
                            .setAuthor(`${user.username}`, `${user.displayAvatarURL}`)
                            .addField(`Points`, `${userBank.cp}`)
                            .addField(`Rank`, `${userTier}`)
                            .addField(`Games played`, `${gamesPlayed}`, false)
                            .addField(`Wins`, `${userBank.wins}`)
                            .addField(`Losses`, `${userBank.losses}`)
                            .addField(`Win percentage`, `${winPercentage.toFixed(2)}%`, false);

            return msg.channel.send(profile);
        }
        catch(e){
            console.log(e);
            return msg.channel.send(`Something went wrong.`);
        }
    }
}