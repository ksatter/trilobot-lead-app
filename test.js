const inquirer = require("inquirer");

function promptMulti() {
    return inquirer.prompt([
        {
            type: "editor",
            message: "Text editor input...",
            name: "multline"
        }
    ]);
}
function promptSingle() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Command line input...",
            name: "single"
        }
    ]);
}

async function prompt() {
    var question1 = await promptMulti();
    console.log(question1.multline);
    var question2 = await promptSingle();
    console.log(question2.single);
    var question3 = await promptSingle();
    console.log(question3.single);
}
prompt();