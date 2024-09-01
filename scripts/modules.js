const axios = require('axios');
require('dotenv').config();

async function getAppAccessToken() {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting app access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function createSubscription() {
  try {
    const accessToken = await getAppAccessToken();
    console.log('Access Token:', accessToken);

    const response = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: '1',
      condition: {
        broadcaster_user_id: process.env.BROADCASTER_ID
      },
      transport: {
        method: 'webhook',
        callback: `${process.env.REDIRECT_URI}/webhook`,
        secret: process.env.WEBHOOK_SECRET
      }
    }, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Subscription created:', response.data);
  } catch (error) {
    console.error('Error creating subscription:', error.response ? error.response.data : error.message);
  }
}

async function deleteSubscription(subscriptionId) {
  try {
    const accessToken = await getAppAccessToken();
    const response = await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Subscription deleted:', response.data);
  } catch (error) {
    console.error('Error deleting subscription:', error.response ? error.response.data : error.message);
  }
}

module.exports = {
  createSubscription,
  deleteSubscription
};