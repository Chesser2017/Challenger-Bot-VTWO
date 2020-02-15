const {getUserFromMention, setCP, setModifier} = require('../functions.js');
const {tierIDs, prefix} = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: "end",
    description: `Adds cp to the first user mentioned. Use it like *${prefix}end winner loser*`,
    modOnly: true,
    async execute(msg, args, client){
        try{
            const {fetchBank, changeValue} = await(require('../spreadsheet.js'));
            const Bronze = msg.guild.roles.get(tierIDs[0]),
                winner = await msg.guild.fetchMember(getUserFromMention(args[1], client)),
                loser = await msg.guild.fetchMember(getUserFromMention(args[2], client)),
                winnerTier = winner.roles.find(tier => tierIDs.includes(tier.id)) || Bronze,
                loserTier = loser.roles.find(tier => tierIDs.includes(tier.id)) || Bronze;

            if(winner.user.bot && loser.user.bot) return msg.channel.send(`A bot vs a bot...I wonder who'd win.`);
            if(winner.user.bot || loser.user.bot) return msg.channel.send(`Bots can't fight matches!`);
            if(winner === loser) return msg.channel.send(`Wow...${loser.user} lost to themself! What a noob.`);
            const tierDifference = tierIDs.indexOf(loserTier.id) - tierIDs.indexOf(winnerTier.id);

            let points = setCP(tierDifference);

            let winnerBank = await fetchBank(winner.user.id);
            let loserBank = await fetchBank(loser.user.id);

            let winnerCp = winnerBank.cp + points;
            let loserCp = loserBank.cp - points;

            if(loserCp < 0) loserCp = 0;
            if(winnerCp >= 100) {
                winnerCp = 0;
                winner.removeRole(winnerTier);
                winner.addRole(tierIDs[tierIDs.indexOf(winnerTier.id) + 1]);
            }

            let winnerLBP = setModifier(winnerTier) + winnerCp;
            let loserLBP = setModifier(loserTier) - loserCp;

            if(loserLBP < setModifier(loserTier)) loserLBP = setModifier(loserTier);
            
            

            await changeValue(winner.user.id, {
                cp: winnerCp,
                lbpoints: winnerLBP,
                wins: winnerBank.wins + 1,
            });

            await changeValue(loser.user.id, {
                cp: loserCp, 
                lbpoints: loserLBP,
                losses: loserBank.losses + 1
            });

            let endMsg = new Discord.RichEmbed()
                            .setColor(`#8a42f5`)
                            .addField(`POINTS`, `Added **${points}cp** to ${winner}\nRemoved **${points}cp** from ${loser}`)

            msg.channel.send(endMsg)
        }
        catch(e){
            if(e.name === "TypeError") return msg.channel.send(`You need to provide 2 users.`);
            console.log(e);
        }
    }
}