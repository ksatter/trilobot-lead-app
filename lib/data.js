const { tokens } = require('./keys')

console.log(tokens)
const workspaces = {
    //Dev workspace
    T011Q91AS5S: {
        leadChannel: 'G0123HSNSFJ',
        token: tokens.dev,
        leads: {},
        las: {}
    },
    //Live workspace
    TLXH0JYKB: {
        leadChannel: 'G010938U5K2',
        token: tokens.live,
        leads: {},
        las: {}
    }
}

module.exports = workspaces