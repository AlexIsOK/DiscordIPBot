
const discord = require("discord.js");
const client = new discord.Client();
const pbip = require("public-ip");

const {existsSync, readFileSync, writeFileSync} = require("fs");

if(!existsSync("auth.json")) {
    writeFileSync("./auth.json", "{\"token\":\"TOKEN\",\"prefix\":\",\"}");
    console.log("Please enter your token in auth.json and re-run.\nIf an argument is specified as the first parameter, that will be used as the token instead.");
    process.exit(1);
}

//get the token from auth.json
const tkn = process.argv[2] === "-t" ? process.argv[3] : (JSON.parse(readFileSync("auth.json"))).token;
const prefix = (JSON.parse(readFileSync("auth.json"))).prefix;

client.on("ready", () => {
    console.log("Discord bot: activated!");
    console.log("Logged in as " + client.user.username);
});

client.on("message", msg => {
    if(msg.content === prefix + "ip") {
        pbip.v4().then(ip => {
            msg.reply(ip);
        });
    }
});

client.login(tkn);