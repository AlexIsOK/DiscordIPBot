
const discord = require("discord.js");
const client = new discord.Client();
const pbip = require("public-ip");

const {existsSync, readFileSync, writeFileSync} = require("fs");

//check to see if the config file exists
if(!existsSync("config.json")) {
    writeFileSync("./config.json", "" +
        "{\n" +
        "   \"token\": \"TOKEN\",\n" +
        "   \"prefix\":\",\",\n" +
        "   \"ipv\": \"4\"\n" +
        "}" +
        "");
    console.log("Please enter your token in config.json and re-run.\nIf an argument is specified as the first parameter, that will be used as the token instead.");
    process.exit(1);
}

//get the token from config.json or a parameter
const tkn = process.argv[2] === "-t" && process.argv[3] ? process.argv[3] : (JSON.parse(readFileSync("config.json"))).token;

//prefix
const prefix = (JSON.parse(readFileSync("config.json"))).prefix;

//internet protocol version
const ipv = (JSON.parse(readFileSync("config.json"))).ipv;
client.on("ready", () => {
    console.log("Discord bot: activated!");
    console.log("Logged in as " + client.user.username);
});

//if the ipv element exists
if(!ipv) {
    console.error("Error: could not get the Internet Protocol version from config.json.\nIf that element was removed, you can delete the config file and run this" +
        " again to generate a new one.");
    process.exit(2);
}

//make sure the internet protocol version is either 4 or 6
if(!(ipv === "4" || ipv === "6")) {
    console.error("Error: Internet Protocol version must be either 4 or 6.");
    process.exit(3);
}

//Only the IP message should be read.
client.on("message", msg => {
    if(msg.content === prefix + "ip") {
        
        //ipv4
        if(ipv === "4")
            pbip.v4().then(ip => {
                msg.reply(ip);
            });
        
        //ipv6
        else
            pbip.v6().then(ip => {
                msg.reply(ip);
            });
    }
});

//finally, login to Discord
client.login(tkn);