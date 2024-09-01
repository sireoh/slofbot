const express = require('express');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config();

// Handle incoming Twitch webhook events
router.post('/webhook', (req, res) => {
  const signature = req.headers['twitch-eventsub-message-signature'];
  const timestamp = req.headers['twitch-eventsub-message-timestamp'];
  const hmac = crypto.createHmac('sha256', process.env.SECRET)
                     .update(timestamp + ':' + JSON.stringify(req.body))
                     .digest('hex');

  if (signature !== `sha256=${hmac}`) {
    return res.status(403).send('Forbidden');
  }

  const event = req.body;
  console.log('Received event:', event);

  if (event && event.data && event.data.reward && event.data.reward.title) {
    const rewardTitle = event.data.reward.title;
    const userName = event.data.user_name;
    const amount = event.data.reward.cost;

    const channel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      channel.send(`Channel Point Redeemed! ${userName} redeemed ${rewardTitle} for ${amount} points.`);
    }
  }

  res.sendStatus(200);
});


module.exports = router;