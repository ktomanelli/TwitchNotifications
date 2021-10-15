const axios = require('axios');
const { getAppToken } = require('../auth');

class EventService {
  constructor(cache) {
    this.cache = cache;
  }

  sendEvent = (id, type, data) => {

    const client = this.cache.get(id);
    // console.log(client)
    if (client.clients) {
        client.clients.forEach(res =>
            res.write(`data: ${JSON.stringify({type, data })}\n\n`));
    }
  };

  listTwitchEventSub = token =>
    axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });

  deleteTwitchEventSub = (token, subId) =>
  axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subId}`, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

  deleteAllSubs = async (subscriptions) => {
    for(const id of subscriptions){
      const tokenResp = await getAppToken();
      const token = tokenResp.data.access_token;      
      await this.deleteTwitchEventSub(token, id);
    }
  }

  twitchEventSub = (userId, token) =>
    axios.post(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        type: 'channel.follow',
        version: '1',
        condition: {
          broadcaster_user_id: userId,
        },
        transport: {
          method: 'webhook',
          callback: 'https://api.kylefrominternet.stream/twitch/webhook',
          secret: process.env.WEBHOOK_SECRET,
        },
      },
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
}

module.exports = EventService;
