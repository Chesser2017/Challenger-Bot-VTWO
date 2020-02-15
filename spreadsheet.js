const {GoogleSpreadsheet} = require('google-spreadsheet');
const {promisify} = require('util');
const credentials = {
    type: "service_account",
    project_id: "challenger-268214",
    private_key_id: "331d8518b84b010f385f44dc9fb2706c77f5f8f0",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4pwjimSf8J/FV\nOPS6UIxtO5sVM1H4Jf9MMYCwkR2V5R2+hpVimPfQ7I/cTfoWWd1HnKRRQIBfNyQA\n4KA9ek2FwUrMCMr8WPXxpj5cNkmuLQ/dCpEC/GoDcbC5UEr6EcmZZIaxvK1YkXjQ\neVgPVxxWtAMGMhNRFyIQKYyWUG84DcoJG27hJ5+4LoaTj+PJ2DWKwHETrYvO/Jf+\n4evYZ24nxaFt4OUkHtSo7ZY481QOQlPtpdxTy1ABT4Q9yJwV27KeBlWDXgQhu2y0\n3DRkn2shWMsGeh2g07O/AQU5Dw5N+GuGV8RsYJ8MctjHNYi0b0IppuTEMGN8PX9L\n6a/beBEPAgMBAAECggEAA/P3ebpjo79LKFLm0lJFH1WGVWba22Ac3gm1QpJourvD\n7j89VXYG4B8gWUwGDZJw7UaKMf8agG9Swv4MECTdIf7oVgPeLJbO9RRlA15aJ3Np\ngobmYdT7hAVcDiuM31ugIDuJsqZiY6IBnxzp6LIptiV2ZxyNU1AWd5gcHV+tcdq4\nYWnBAghBL2Eo8Qb59ugnrsvyiQh/f4mMgc97pvu20etenr5Yb0wi1ySSP2nQ3cAH\nthEfT6vd437hTaSBuTLhnI8/3GPZqhpnRj37PLWR4p4Ug+jVP0nQl/YCB38aiVmx\n1OsRgChJDSTPD8Nvrzaie5oGL+P8H47mFG3M8kmeAQKBgQDqu/G0kZuvFcnF++pU\nXqVN9Pg/9ksYXiKMeUTTbbaKwOtya1pDLafqE8kVATbBuYPQZEFkruvBaGYt4o3D\n8fYUTmUdhnBe6SBvrfgIn9rj6tNODttxBihsrFWsq3uQZ0DYBQ69Mim9uMgrTwqj\nB5jgwnSLcCHkbHRZwE5qC4GbAQKBgQDJYZMdyzX1cfoiLXdl1neWNsjcdDt9GubP\nPha3QntHdcen9tq3jxWjAUUYTXA/736RBX/zZMuQ5ztNIz9W01GsR88fmnMEqM9J\ni39cudrc8BiIGX62zNX/CiqGzrE6TlDQhPPsLmSkH1MOb92h3JXXx8+sXbIqexJh\nswqCMUv8DwKBgCvKOAMZjtOQ2v1mS4bFyUzLwGweRFAdb5CJJv/SXdVwu/uybzpN\nECAo5MBYY6CsPRzpNxHTWAPSuA0jUJMXVnLfVRm29Muf7f8nkzf4qlsOebD8MI/b\nODtdwvXdX8XGnWAvQVqmOwc7q4v4yOE1D54OaLOCjbARU3tS1s4Nq3YBAoGAOPEZ\nKyyBlmRjCPT4NNh+uf/FrehDxe0sZF83BxyKRTt9d/XqBEs2IABE7ElBOyLaE+GN\nO2I92Tw43WfhCgj4qBEp9NK0QRYGftIt8icvRpexKBKlbMTgoZvbSID7RfRND5j4\na8j2dh3RW1ywO4tm5zu9cgyQS0i/etaoWwXbaWsCgYAt1Tick/j3jFN5L2GXdSy5\nDkx8XjQNow5bYtQld+i/YHnx4uaDETRaUH61CrBMx2srKuyOQwGe587X8LB04H72\ncRQeTUSft4db3AhP1rdIOVjv2OpzSlO9LSQEh/kfq0Y56c/IYdREFoAQwNYOnDtL\nh+yxXk6pwILJ0mGxdBh7iw==\n-----END PRIVATE KEY-----\n",
    client_email: "challenger@challenger-268214.iam.gserviceaccount.com",
    client_id: "106919637845666032670",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/challenger%40challenger-268214.iam.gserviceaccount.com"
  }

const main = async function(){
    const doc = new GoogleSpreadsheet('1JWmcr3BOz1A5R3KOfNQ-edkKiF3nun-cg_VFEgtk_Go');
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const accountsSheet = doc.sheetsByIndex[0];
    const userBanks = await accountsSheet.getRows();

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
            await accountsSheet.addRow(userBank);
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
            await accountsSheet.addRow(newBank);
        }
        for(let userBank of userBanks){
            if(userBank.id === userID){
                userBank.cp = rowObject.cp || userBank.cp;
                userBank.lbpoints = rowObject.lbpoints || userBank.lbpoints;
                userBank.wins = rowObject.wins || userBank.wins;
                userBank.losses = rowObject.losses || userBank.losses;
                await userBank.save();
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