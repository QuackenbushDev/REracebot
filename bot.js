const tmi = require('tmi.js');
const race = require("./race.mjs");
require('dotenv').config();

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: process.env.BOT_CHANNELS.split(',')
};

// Create a client with our options
const trigger = process.env.BOT_TRIGGER;
const client = new tmi.client(opts);
const race_plugin = new race(client);
race_plugin.set_trigger_character(trigger);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (channel, userstate, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    console.log(msg);

    if (msg.charAt(0) !== trigger) {
        console.log("Command character not found.");
        return;
    }

    // Remove trigger & whitespace from chat message
    const commandName = msg.substr(1).trim();
    const username = userstate.username;

    switch(commandName) {
        case "open":
            race_plugin.open(channel);
            break;

        case "join":
        case "enter":
            race_plugin.join(channel, username);
            break;

        case "unjoin":
            race_plugin.unjoin(channel, username);
            break;

        case "start":
            race_plugin.start(channel);
            break;

        case "forfeit":
        case "quit":
            race_plugin.forfeit(channel, username);
            break;

        case "done":
            race_plugin.done(channel);
            break;

        case "end":
            race_plugin.end(channel);
            break;

        case "restart":
            race_plugin.restart(channel);
            break;

        case "racers":
            race_plugin.shoutout(channel);
            break;

        case "test":
            race_plugin.test(channel);
            break;

        case "debug":
            race_plugin.debug(channel);
            break;

        default:
            console.log(msg);
            break;
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
