module.exports = {
    name: "reset",
    description: "Resets all the players' cp.",
    cooldown: 60,
    modOnly: true,
    async execute(msg, args, client, banks){
        if(msg.author.id != '402053003474894849' && !msg.member.hasPermission('ADMINISTRATOR')){
            return msg.reply(` you have to be an admin to use that command!`);
        }
        const {changeValue, userBanks} = await (require('../spreadsheet.js'));
        let sentMsg = await msg.channel.send(`Are you sure you want to do that command?`);
        await sentMsg.react('✅');
        await sentMsg.react('❎');

        setTimeout(() => {
            return msg.reply(` the process expired.`);
        }, 600000)

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && (user.id === msg.author.id) 
        };
        const reactionCollector = sentMsg.createReactionCollector(filter, {time: 300000, max: 1});
        
        reactionCollector.on('collect', async (reaction, reactionCollector) => {
            if(reaction.emoji.name === '✅'){
                for(let bank of userBanks){
                    bank.lbpoints -= bank.cp;
                    bank.cp = 0;
                    bank.save();
                }
                sentMsg.delete();
                return msg.reply(` reseted cp for all users.`);
            }
            else{
                sentMsg.delete();
                return msg.reply(` ended process.`);
            }
        })


        
    }
}