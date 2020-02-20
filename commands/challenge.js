const Discord = require('discord.js');
const {getRandomHero, getRandomMap} = require('../functions.js');
const {tierIDs} = require('../config.json');
const matches = [];
const msToTime = duration => {
      let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return `${hours}h:${minutes}m:${seconds}s`;
}
//For some time, the limited users will be removed due to too few players
module.exports = {
    name : "challenge",
    description: "Challenge another player to a random match.",
    aliases: ['ch', 'chal'],
    cooldown: 10,
    modOnly: false,
    async execute(msg, args, client){
        if(!msg.mentions.users.first())
            return msg.reply(` you need to mention someone!`);
        if(msg.channel.id != "667808802740895775")
            return msg.reply(` please challenge others in <#667808802740895775>`);
        const challenger = msg.author;
        const challenged = msg.mentions.users.first();
        let challengeLog = msg.guild.channels.get('667803562277077072');

        let challengerRoles = msg.guild.members.get(challenger.id).roles;
        let challengedRoles = msg.guild.members.get(challenged.id).roles;
        let Bronze = msg.guild.roles.get(tierIDs[0]);
        let challengeResolved = false;

        if(challenger.id === challenged.id){
            return msg.channel.send(`You cannot challenge yourself, ${msg.author}`);
        }
        if(challenged.bot){
            return msg.channel.send(`Don't challenge a bot, ${msg.author}! Try to challenge a real player.`);
        }

        let challengerTier = challengerRoles.find(tier => tierIDs.includes(tier.id)) || Bronze;
        let challengedTier = challengedRoles.find(tier => tierIDs.includes(tier.id)) || Bronze;
        let tierDifference = tierIDs.indexOf(challengerTier.id) - tierIDs.indexOf(challengedTier.id);

        let currentMatch = matches.find(m => {
            if(m.players[0] === challenger.id && m.players[1] ===
            challenged.id){
              return true;
            }
            if(m.players[0] === challenged.id && m.players[1] ===
            challenger.id){
              return true;
            }
        });

        if(currentMatch && currentMatch.matchCount >= 3){
            const msTilNextChallenge = 86400000 - (Date.now() - currentMatch.creationTime);
            return msg.reply(` you have already challenged that person 3 times! Please wait *${msToTime(msTilNextChallenge)}* before challenging them again.`);
        }
        if(tierDifference > 2){
            return msg.reply(` you can't challenge someone 2 or more tiers below you!`);
        }

        const sentMsg = await msg.channel.send(`${challenged}, you are being challenged to a **Random map** with **Random hero** by ${challenger}! ***DO YOU ACCEPT?***`);
        
        await sentMsg.react('✅');
        await sentMsg.react('❎');

        sentMsg.delete(300000).then(thisMsg => {
            if(!challengeResolved){
                return msg.reply(` the challenge has expired!`); 
            }
        });
        

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && (user.id === challenged.id) 
        };

        const reactionCollector = sentMsg.createReactionCollector(filter, {time: 300000, max: 1});
        
        reactionCollector.on('collect', (reaction, reactionCollector) => {
            if(reaction.emoji.name === '✅'){
                const challengeMsg = new Discord.RichEmbed()
                    .setColor(`#0099ff`)
                    .addField(`Players:`, `${challenger} **vs** ${challenged}`, true)
                    .addField(`Play in:` ,`**${getRandomMap()}** with **${getRandomHero()}**`, false)
                    .setFooter(new Date());
                sentMsg.edit('<#667803562277077072>');
                challengeLog.send(challengeMsg);
                challengeResolved = true;
                //If challenged or challenger does not have a tier, add it
                if(!challengerRoles.some(tier => tierIDs.includes(tier.id))){
                    msg.guild.members.get(challenger.id).addRole(Bronze);
                }
                if(!challengedRoles.some(tier => tierIDs.includes(tier.id))){
                    msg.guild.members.get(challenged.id).addRole(Bronze);
                }
                    
                if(currentMatch){
                    currentMatch.matchCount++;
                }
                else{
                    const match = {
                      players: [challenger.id, challenged.id],
                      matchCount: 1,
                      creationTime: Date.now()
                    }
                    matches.push(match);
                    setTimeout(() => {
                        matches.splice(matches.indexOf(match), 1);
                    }, 24 * 60 * 60 * 1000);
                }
                return;
            }
            else{
                sentMsg.delete();
                challengeResolved = true;
                msg.reply(` ${challenged} has declined the game request!`);
                return;
            }
        })
    }
}