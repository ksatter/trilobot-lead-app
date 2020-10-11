


const { WebClient } = require('@slack/web-api');
const workspaces = require('./data')
const api = new WebClient()


const parseInput = ({ channel_id, user_name, text, team_id, token }) => {
    const validCommands = ['add', 'zoom']
    const textArr = text.split(" ")
    const commandText = textArr[0].trim().toLowerCase()

    const command = "zoom"
    return {
        token,
        command,
        team: workspaces[team_id],
        user_name,
        channel_id,
        commandText
    }
}

const commandHandler = {
    zoom: async ({team, channel_id, user_name, token}) => {
        return new Promise ((resolve, reject) => {
            console.log("made it here")
           
            api.chat.postMessage({
                token: team.token,
                channel: channel_id,
                text: team.zoom,
                as_user: false,
                user_name
            })
            .then(res => {
                console.log(res);
                resolve("message sent")
            })
              .catch((err) => {
                  console.log(err);
                  reject()
              })
        })
      
    }
}
//Parses the request, runs the correct command and creates the response.
const macros = (request) => {
    return new Promise((resolve, reject) => {
        console.log(request)
        const data = parseInput(request)
        commandHandler[data.command](data)
            .then(message => resolve(message))
            .catch(() => reject('An error occurred. Please contact <@UM5KSC672>'))
    })
}

module.exports = {macros}
