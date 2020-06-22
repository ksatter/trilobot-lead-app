const { WebClient } = require('@slack/web-api');
const workspaces = require('./data')
const api = new WebClient()
const { checkAuth } = require("./leads")

//Used to set usable command based on user input.
//If command is "in" or "out", sets command to "la" and status to true or false, respectively
//if an la was tagged, it is stored as taggedLead (used for '/las check @la' and '/las out program @la')
//if a valid program was not included for "in", sets command to "unknownProgram"
//If there is no command, defaults to "getLeads"
//Any other command sets command as "unknownCommand"
const parseInput = ({ user_id, user_name, text, team_id }) => {
    const textArr = text.split(" ");
    console.log(textArr)
    const validPrograms = ["web", "data"]
    const programText = textArr[1] ? textArr[1].trim().toLowerCase() : ""

    const validCommands = ['clear', 'check'];
    const commandText = textArr[0] ? textArr[0].trim().toLowerCase() : ""

    const program = validPrograms.includes(commandText) ? commandText: validPrograms.includes(programText) ? programText : false
    const command = (commandText === "in"  &&  program) || commandText === "out" ? "la" : !commandText || validPrograms.includes(commandText) ? 'getLas' : validCommands.includes(commandText) ? commandText : !program ? "invalidProgram" : "unknownCommand"

    const taggedLa =  commandText === "check" || commandText === "out" ? (validPrograms.includes(textArr[1]) ? textArr[2] : textArr[1]) : commandText === "in" ? textArr[2] : ''
    return {
        la: `<@${user_id}|${user_name}>`,
        taggedLa,
        command,
        program,
        status: commandText === "in" || false,
        team: workspaces[team_id],
        user_id,
        commandText,
        programText
    }
    
    
}

const updateLas = async(las, team) => {

    return new Promise((resolve, reject) => {
    const promises = las.map((la, i) => new Promise((resolve, reject) => {
        api.users.info({ user: la.split('|')[0].substring(2), token:  team.token})
        .then(({user}) => {
            las[i] += user.profile.status_text ? ` _${user.profile.status_text}_` : ''
            resolve()
        })
        .catch(err => {
            console.log('Lead update failed:');
            console.log(lead.split('|')[0].substring(3))
            console.log(leads, team)
            console.log(err)
            reject(err)
        })
    })
    )
    Promise.all(promises).then((results) => resolve(results)).catch(err => reject(err))
} )
}



const commandHandler = {
    //triggered with `/la in' and '/la out'
    //checks authorization and resolves with appropriate message depending on whether command was 'in' or 'out'
    la: ({ team, la, taggedLa, user_id, status, program }) => {
        return taggedLa ? new Promise((resolve, reject) => {
                console.log("here")
                checkAuth(team, user_id).then(authed => {
                    console.log("lead la adjustment")
                    
                    team.las[taggedLa] = { program, status };
                    resolve( authed ? `${la} logged ${taggedLa}${status ? `in to ${program}` : "out"} sucessfully` : `Access Denied`)
                    console.log(team.las)
                }).catch(err => reject(err))

        }) : new Promise (resolve => {
            team.las[la] = { program, status };
            resolve( `${la} logged ${status ? `in to ${program}` : 'out'}  sucessfully`)
        })
    },

    getLas: async ({team, program}) => {
        return new Promise(async (resolve, reject) => {
            const webLAs = !program || program === "web" ? Object.keys(team.las).filter(la => team.las[la].status && team.las[la].program === "web") : []
            const dataLAs = !program || program === "data" ? Object.keys(team.las).filter(la => team.las[la].status && team.las[la].program === "data") : []
            
            await updateLas(webLAs, team)
            await updateLas(dataLAs, team)
            
            let message = "\n";

            message += webLAs.length ? `Web LA${webLAs.length > 1 ? 's' : ''} online: \n\n${webLAs.map(la => la).join('\n')}\n\n` : program !== "data" ? "No Web LAs online\n\n" : ""
            message += dataLAs.length ? `Data LA${webLAs.length > 1 ? 's' : ''} online: \n\n${dataLAs.map(la => la).join('\n')}\n\n` : program !== "web" ? "No Data LAs online\n\n" : ""

            message += message === "\n" ? 'No LAs online' : ''
            
            resolve(message)
        })
    },

    check: ({ taggedLa, team }) => {
        return new Promise((resolve, reject) => {
            if (taggedLa) {
                const arr = [taggedLa.slice()]
                updateLas(arr, team)
                    .then(() => resolve(`${arr[0]} is ${!team.las[taggedLa] || !team.las[taggedLa].status ? `not logged in` : `logged in to ${team.las[taggedLa].program}`}`))
                    .catch((err) => console.log(110, err))
            } else {
                commandHandler.getLas({ team })
                    .then(message => resolve(message))
                    .catch(() => reject())
            }
        })
    },

    invalidProgram: ({programText}) => {
        return new Promise(resolve => resolve(programText ? `Did not recognize program \`${programText}\`. Please try again.` : `Please include your program to log in`))
    },
    invalidCommand: ({commandText}) => {
        return new Promise(resolve => resolve(`Did not recognize command \`${commandText}\`. Please try again.`))
    }
}

//Parses the request, runs the correct command and creates the response.
const laMessage = (request) => {
    return new Promise((resolve, reject) => {
        console.log(75, request)

        const data = parseInput(request)
        
        console.log(data)
        commandHandler[data.command](data)
            .then(message => resolve(message))
            .catch(err => reject(err))
    })
}
module.exports = { laMessage }