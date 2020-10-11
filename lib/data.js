const { tokens } = require('./keys')

console.log(tokens)
const workspaces = {
    //Dev workspace
    T011Q91AS5S: {
        leadChannel: 'G0123HSNSFJ',
        token: tokens.dev,
        leads: {},
        las: {},
        zoom: ` Before I start the Zoom meeting room, I need to review a few things. 

        1. Zoom calls are timed and limited to a maximum of 15 minutes. 
        2. Your question may not be resolved at the end of the session. 
            Together, we will identify the next steps. 
            It will be your responsibility to implement the proposed fixes so that you solve the problem yourself.
        3. During the Zoom call, no additional questions will be addressed. 
        4. At the end of the call, I will post the next steps here and then close the question. 
            If you continue to struggle with the steps outlined, you are welcome to post a new question.
        
    If you understand and agree to these guidelines, give me an ok and we can get started.`
    },
    //Live workspace
    TLXH0JYKB: {
        leadChannel: 'G010938U5K2',
        token: tokens.live,
        leads: {},
        las: {},
        zoom: ` Before I start the Zoom meeting room, I need to review a few things. 

        1. Zoom calls are timed and limited to a maximum of 15 minutes. 
        2. Your question may not be resolved at the end of the session. 
            Together, we will identify the next steps. 
            It will be your responsibility to implement the proposed fixes so that you solve the problem yourself.
        3. During the Zoom call, no additional questions will be addressed. 
        4. At the end of the call, I will post the next steps here and then close the question. 
            If you continue to struggle with the steps outlined, you are welcome to post a new question.
        
    If you understand and agree to these guidelines, give me an ok and we can get started.`
    }
}

module.exports = workspaces