require('dotenv').config();  // Load environment variables from .env file
const { Client, Intents } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const {
    initialTokenExchange,
    createSubscription,
 } = require('./scripts/modules');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Initialize Discord Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

app.use("/api", routes); 

// Start the Express server and set up the Discord client
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log in to Discord
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  initialTokenExchange()
  .then(() => console.log('Initial token exchange complete'))
  .catch(error => console.error('Error:', error));
  
  createSubscription()
  .then(() => console.log('Subscription process complete'))
  .catch(error => console.error('Error:', error));
});
client.login(process.env.DISCORD_TOKEN);
