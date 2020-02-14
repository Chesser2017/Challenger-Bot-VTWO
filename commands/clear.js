module.exports = {
    name: "clear",
    description: "Deletes messages(up to 100 at a time).",
    aliases: ['purge', 'cl'],
    modOnly: true,
    async execute(msg, args, client){
        member = client.guilds.get('580756509852434475').members.get(msg.author.id);
        const msgsToDelete = parseInt(args[1], 10);
        //Error handling
        if(!msgsToDelete || Number.isNaN(msgsToDelete)){
            return msg.reply(` you have to provide a valid number.`);
        }
        if(msgsToDelete > 100){
            return msg.reply(` you can't delete more than 100 messages.`);
        }
        if(msgsToDelete < 0){
            return msg.reply(` you can't delete less than 0 messages, you noob.`)
        }

        try{
            await msg.channel.bulkDelete(msgsToDelete + 1);
            let sentMsg = await msg.channel.send(`\:pencil2: **Deleted ${args[1]} messages.**`)
            await sentMsg.delete(3000);
        }catch(e){
            console.error
        }
    }
}