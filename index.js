
const discord = require("discord.js");
const client = new discord.Client();
const pbip = require("public-ip");

const {existsSync, readFileSync, writeFileSync} = require("fs");

//testing
const test = process.argv[2] === "--test";

//check to see if the config file exists
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
    console.log("Please enter your token in config.json and re-run.\nIf an argument is specified as the first parameter, that will be used as the token instead.");
    process.exit(1);
}

//get the token from config.json or a parameter
const tkn = process.argv[2] === "-t" && process.argv[3] ?
    process.argv[3] :
    (JSON.parse(readFileSync("config.json"))).token;

//prefix
const prefix = (JSON.parse(readFileSync("config.json"))).prefix;

//internet protocol version
const ipv = (JSON.parse(readFileSync("config.json"))).ipv;

//case sensitive command
const caseSensitive = (JSON.parse(readFileSync("config.json"))).caseSensitive;

//command
const cmd = caseSensitive === true || caseSensitive === "true" ?
    (JSON.parse(readFileSync("config.json"))).command :
    (JSON.parse(readFileSync("config.json"))).toString().toLowerCase();

client.on("ready", () => {
    console.log("Discord bot: activated!");
    console.log("Logged in as " + client.user.username);
});

//Check to make sure that the required elements are here
//prefix is not required.
if(!ipv || !cmd || !tkn) {
    console.error("Error: one or more elements could not be found in the config.json file.  If you have upgraded, please delete the config and run the program" +
        " again to generate a new one.");
    process.exit(2);
}

//make sure the internet protocol version is either 4 or 6
if(!(ipv === "4" || ipv === "6")) {
    console.error("Error: Internet Protocol version must be either 4 or 6.");
    process.exit(3);
}

//nothing left for testing
if(test)
    process.exit(0);

//Only the IP message should be read.
client.on("message", msg => {
    if(caseSensitive === "true" || caseSensitive === true) {
        msg.content = msg.content.toLowerCase()
    }
    if(msg.content === prefix + cmd) {
        
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
//do NOT log the result, users token will be displayed in plain text.
client.login(tkn).then();