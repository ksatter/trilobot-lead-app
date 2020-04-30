require('dotenv').config();

module.exports = {
    slack:{
        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
    },
    tokens: {
        live: process.env.TLXH0JYKB_TOKEN,
        dev: process.env.T011Q91AS5S_TOKEN
    }

}