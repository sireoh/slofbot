const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new client instance with the necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Ensure this is enabled in the Developer Portal
  ],
});

module.exports = {
  client
}
