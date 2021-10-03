const { default: axios } = require('axios');
const Client = require('../models/Client');

const initEventSub = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findOne({ _id: id }).exec();

  if (client) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    };
    res.writeHead(200, headers);

    client.res = res;

    req.on('close', () => {
      Client.all[id].close();
    });
  } else {
    res.redirect(
      'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=86bqvqw8f722hn3refzoqntfobzc5c&redirect_uri=https://kylefrominternet.stream/auth&scope=user_read'
    );
  }
};

const sendEvent = (id, body) => {
  Client.all[id].res.write(`data: ${JSON.stringify(body)}\n\n`);
};

const listTwitchEventSub = token =>
  axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

const twitchEventSub = (userId, token) =>
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
        callback: 'https://kylefrominternet.stream/twitch/webhook',
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

module.exports = {
  initEventSub,
  sendEvent,
  listTwitchEventSub,
  twitchEventSub,
};
