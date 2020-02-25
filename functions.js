const {tierIDs} = require('./config.json');
const getRandomHero = () => {
    const heroes = ["Magmax", "Rime", "Morfe", "Aurora", "Necro", "Brute",
                    "Shade", "Nexus", "Euclid", "Chrono", "Rameses", "Reaper", "Jolt",
                    "Ghoul", "Candy", "Cent", "Jotunn", "Mirage"];

    let randomNum = Math.floor(Math.random() * heroes.length);
    return heroes[randomNum];
}
const getRandomMap = () => {
    const maps = ["Central Core", "Haunted Halls", "Peculiar Pyramid Tunnels", 
                    "Peculiar Pyramid Perimeter", "Wacky Wonderland", "Glacial Gorge",
                    "Vicious Valley", "Humongous Hollow", "Elite Expanse",
                    "Central Core Hard", "Dangerous District", "Frozen Fjord",
                    "Quiet Quarry", "Monumental Migration", "Ominous Occult",
                    "Restless Ridge", "Vicious Valley Hard"]
    let mapNum = Math.floor(Math.random() * maps.length);
    return maps[mapNum];
}
const setModifier = tier => {
    let modifier;
    if(tier){
        switch(tier.name){
            case 'Bronze':
                modifier = 0;
                break;
            case 'Silver':
                modifier = 100;
                break;
            case 'Gold':
                modifier = 200;
                break;
            case 'Platinum':
                modifier = 300;
                break;
            case 'Diamond':
                modifier = 400;
                break;
            default:
                modifier = 500;
                break;
        }
        return modifier;
    }
}
const getUserFromMention = async (mention, client) => {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	return (await client.fetchUser(id));
}
const setCP = tierDifference => {
    if(tierDifference <= 0){
        return 10;
    }
    return 10 + (5 * tierDifference);
}

const setLBP = async(oldMem, newMem) => {
    if(newMem.roles.size < oldMem.roles.size) return;
    let tier = newMem.roles.find(tier => tierIDs.includes(tier.id));
    let userBank = await fetchBank(newMem.user);
    let newLBPoints = userBank.dataValues.cp;
    const modifier = setModifier(tier);
    
    newLBPoints += modifier;
    if(newLBPoints < modifier){
        await banks.update({lbPoints: modifier}, {where: {user_id: newMem.user.id}});
        return;
    }
    await banks.update({lbPoints: newLBPoints}, {where: {user_id: newMem.user.id}});
}
module.exports = {
    getRandomHero,
    getRandomMap,
    setModifier,
    getUserFromMention,
    setCP,
    setLBP
}