const Discord = require('discord.js');
module.exports = {
    name: "poll",
    description: "Creates a poll.",
    modOnly: true,
    execute(msg, args, client){
        let member = client.guilds.get('580756509852434475').members.get(msg.author.id);
        let command = args.shift();
        let pollMsg = args.join(' ');
        let poll = new Discord.RichEmbed()
                    .setColor('#ffffff')
                    .addField(`Poll created by ***${msg.author.username}***`, 
                            `${pollMsg}`)
                    .setFooter(`React to vote`)
        msg.channel.send(poll)
                    .then(async msg => {
                        await msg.react('\u2705');
                        await msg.react('\u274E');
                    }) 
    }
}