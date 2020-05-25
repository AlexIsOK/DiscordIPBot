
/*
    This script will allow you to run a Discord bot to get your IP address
    for when you are not at your house.  There are other uses as well, for
    example you could be hosting a small Minecraft server on your own
    computer and want to make sure that users will have the IP address if
    you are not at your house and able to tell them.  You are responsible
    for making sure that your token is safe and your IP address is only
    shown to those who should be able to access it.
 */

//Imports
const discord = require("discord.js");
const client = new discord.Client();
const pbip = require("public-ip");
const {existsSync, readFileSync, writeFileSync} = require("fs");

//For NPM testing
const test = process.argv[2] === "--test";

//Make sure config.json exists
if(!existsSync("config.json")) {
    writeFileSync("./config.json", "" +
        "{\n" +
        "   \"token\": \"TOKEN\",\n" +
        "   \"prefix\":\",\",\n" +
        "   \"ipv\": \"4\",\n" +
        "   \"command\": \"ipAddress\",\n" +
        "   \"caseSensitive\": \"false\"\n" +
        "}" +
        "");
    if(!test) {
        console.log("Please enter your token in config.json and re-run.\nIf an argument is specified as the first parameter, that will be used as the token instead.");
        process.exit(1);
    } else
        console.log("Skipping config.json enforcements due to testing.");
}

//Get the token from config.json or a parameter
const tkn = process.argv[2] === "-t" && process.argv[3] ?
    process.argv[3] :
    (JSON.parse(readFileSync("config.json"))).token;

//Bot prefix
const prefix = (JSON.parse(readFileSync("config.json"))).prefix;

//Should the bot use IPv4 or IPv6?
const ipv = (JSON.parse(readFileSync("config.json"))).ipv;

//Should commands be case sensitive?
const caseSensitive = (JSON.parse(readFileSync("config.json"))).caseSensitive;

//Command to watch
const cmd = caseSensitive === true || caseSensitive === "true" ?
    (JSON.parse(readFileSync("config.json"))).command :
    (JSON.parse(readFileSync("config.json"))).toString().toLowerCase();

//On login, note that in logs so the user knows the bot is working as it should.
client.on("ready", () => {
    console.log("Discord bot: activated!");
    console.log("Logged in as " + client.user.username);
});

//Check to make sure that the required elements are here.
//Prefix is not required.
if(!ipv || !cmd || !tkn) {
    console.error("Error: one or more elements could not be found in the config.json file.  If you have upgraded, please delete the config and run the program" +
        " again to generate a new one.");
    process.exit(2);
}

//Make sure the Internet Protocol version is correct
if(!(ipv === "4" || ipv === "6")) {
    console.error("Error: Internet Protocol version must be either 4 or 6.");
    process.exit(3);
}

//Nothing left for testing to do.
if(test)
    process.exit(0);

//Only the IP message should be read.
client.on("message", msg => {
    if(caseSensitive === "true" || caseSensitive === true) {
        msg.content = msg.content.toLowerCase()
    }
    if(msg.content === prefix + cmd) {
        
        //IPv4
        if(ipv === "4") {
            pbip.v4().then(ip => {
                msg.reply(ip);
            });
        }
        
        //IPv6
        else {
            pbip.v6().then(ip => {
                msg.reply(ip);
            });
        }
    }
});

//finally, login to Discord
//do NOT log the result, users token will be displayed in plain text.
client.login(tkn).then();