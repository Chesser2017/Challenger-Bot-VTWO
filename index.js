const Discord = require('discord.js');
const fs = require('fs');

const {prefix} = require('./config.json');
const {setModifier, setLBP} = require('./functions.js');

const cooldowns = new Discord.Collection();
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity('evades.io | .help', {type: "PLAYING"});;
    console.log('ready');
 })

client.on('guildMemberUpdate', setLBP)

client.on('message', msg => {
    if(msg.author.bot || !msg.content.startsWith(prefix) || !msg.guild) return;

    const arguments = msg.content.slice(prefix.length).split(/ +/);
    const commandName = arguments[0];
    
    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;
    if(command.modOnly && !msg.member.hasPermission('MANAGE_ROLES')){
        return msg.reply(` you do not have the permissions for that message!`)
    }
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${Math.round(timeLeft.toFixed(1))} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    try{
        command.execute(msg, arguments, client);
    }catch{
        console.error;
    }
})

client.login(process.env.BOT_TOKEN);