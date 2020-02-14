const {GoogleSpreadsheet} = require('google-spreadsheet');
const {promisify} = require('util');
const credentials = {
    type: "service_account",
    project_id: "challenger-database",
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: "challenger@challenger-database.iam.gserviceaccount.com",
    client_id: "110156662503213012063",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/challenger%40challenger-database.iam.gserviceaccount.com"
  };

const main = async function(){
    const doc = new GoogleSpreadsheet('1JWmcr3BOz1A5R3KOfNQ-edkKiF3nun-cg_VFEgtk_Go');
    await promisify(doc.useServiceAccountAuth)(credentials);
    const info = await promisify(doc.getInfo)();
    const accountsSheet = info.worksheets[0];
    const userBanks = await promisify(accountsSheet.getRows)();

    const fetchBank = async function(userID){
        let userBank = userBanks.find(userBank => userBank.id === userID);
        if(!userBank){
            userBank = {
                id: userID,
                cp: 0,
                wins: 0,
                losses: 0,
                lbpoints: 0
            };
            await promisify(accountsSheet.addRow)(userBank);
        }
        return {
            id: userID,
            cp: parseInt(userBank.cp),
            wins: parseInt(userBank.wins),
            losses: parseInt(userBank.losses),
            lbpoints: parseInt(userBank.lbpoints)
        }
    }
    const changeValue = async function(userID, rowObject){
        if(!userBanks.some(userBank => userBank.id === userID)){
            let newBank = {
                id: userID,
                cp: 0,
                wins: 0,
                losses: 0,
                lbpoints: 0
            };
            await promisify(accountsSheet.addRow)(newBank);
        }
        for(let i = 0; i < userBanks.length; i++){
            let userBank = userBanks[i];
            if(userBank.id === userID){
                userBank.cp = rowObject.cp || userBank.cp;
                userBank.lbpoints = rowObject.lbpoints || userBank.lbpoints;
                userBank.wins = rowObject.wins || userBank.wins;
                userBank.losses = rowObject.losses || userBank.losses;
                userBank.save();
                break;
            }
        }
        
    }
    return {
        fetchBank,
        changeValue,
        userBanks
    }
}

main();

module.exports = main();