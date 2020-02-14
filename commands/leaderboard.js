const Discord = require('discord.js');
module.exports = {
    name: "leaderboard",
    description: "Displays the top 10 players in this server.",
    aliases: ['lb'],
    cooldown: 15,
    modOnly: false,
    async execute(msg, args, client){
        try{
            const {userBanks} = await (require('../spreadsheet.js'));
            const pages = {};

            userBanks.sort((a, b) => b.lbpoints - a.lbpoints);


            let lbMsg = new Discord.RichEmbed()
                            .setAuthor(`Evades Challenger Series - Leaderboard!`, 
                                       `https://i.imgur.com/TDePkWGh.jpg`);
            let userList = ``;
            let lastPageFromIteration;

            //Sets text for leaderboard embed
            for(let i = 0; i < userBanks.length; i++){
                let user = await client.fetchUser(userBanks[i].id);
                switch(i){
                    case 0:
                        userList += `\:first_place: ${user} \`${userBanks[i].lbpoints}\` ***CP***\n`;
                        break;
                    case 1:
                        userList += `\:second_place: ${user} \`${userBanks[i].lbpoints}\` ***CP***\n`;
                        break;
                    case 2:
                        userList += `\:third_place: ${user} \`${userBanks[i].lbpoints}\` ***CP***\n`;
                        break;
                    default:
                        userList += `**${i+1}.** ${user} \`${userBanks[i].lbpoints}\` ***CP***\n`;
                        //When there are 10 people found, split the leaderboard and store it in
                        //pages object. userList is made blank so that no repetition occurs
                        if((i + 1) % 10 === 0){
                            pages[(i + 1)/10] = userList;
                            userList = '';
                            lastPageFromIteration = (i + 1)/10;
                        }
                        break;
                }
            }
            //The remaining users are added to pages, assuming they exist
            userList ? pages[lastPageFromIteration + 1] = userList : userList = userList;

            lbMsg.setDescription(pages[1])
                .setTimestamp(new Date());
            
            const sentMsg = await msg.channel.send(lbMsg);
            sentMsg.page = 1;
            await sentMsg.react('⬅');
            await sentMsg.react('➡');

            client.on('messageReactionAdd', (msgReaction, user) => {
                if(user.id != msg.author.id || msgReaction.message.id != sentMsg.id) return;

                if(msgReaction.emoji.name === '⬅'){
                    if(sentMsg.page - 1 >= 1)
                        sentMsg.page --;
                }
                if(msgReaction.emoji.name === '➡'){
                    if(pages[sentMsg.page + 1])
                        sentMsg.page++;
                }
                lbMsg.setDescription(pages[sentMsg.page]);
                sentMsg.edit(lbMsg);
                msgReaction.remove(user);
            })
        }
        catch(e){
            console.log(e);
        }
    }
}