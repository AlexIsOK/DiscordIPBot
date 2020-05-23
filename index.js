
const discord = require("discord.js");
const client = new discord.Client();
const fs = require("fs");

if(!fs.existsSync("auth.json"))
    fs.writeFileSync("./auth.json", "")