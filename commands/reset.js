module.exports = {
    name: "reset",
    description: "Resets all the players' cp.",
    cooldown: 60,
    modOnly: true,
    async execute(msg, args, client, banks){
        if(msg.author.id != '402053003474894849' && !msg.member.hasPermission('ADMINISTRATOR')){
            return msg.reply(` you have to be an admin to use that command!`);
        }
        const resolved = false;
        const {changeValue, userBanks} = await (require('../spreadsheet.js'));
        let sentMsg = await msg.channel.send(`Are you sure you want to do that command?`);
        await sentMsg.react('✅');
        await sentMsg.react('❎');

        setTimeout(() => {
            if(!resolved){
                return msg.reply(` the process expired.`);
            }
        }, 600000)

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && (user.id === msg.author.id) 
        };
        const reactionCollector = sentMsg.createReactionCollector(filter, {time: 600000, max: 1});
        
        reactionCollector.on('collect', async (reaction, reactionCollector) => {
            if(reaction.emoji.name === '✅'){
                for(let bank of userBanks){
                    bank.lbpoints -= bank.cp;
                    bank.cp = 0;
                    bank.wins = 0;
                    bank.losses = 0;
                    bank.save();
                }
                sentMsg.edit(`Reseted cp for all users.`);
                resolved = true;
                return;
            }
            else{
                sentMsg.edit(`Ended process.`);
                resolved = true;
                return;
            }
        })


        
    }
}