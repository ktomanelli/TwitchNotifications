const axios = require('axios');

class EventService{
    constructor(cache){
        this.cache = cache
    }

    sendEvent = (id, type, data) => {
        const res = this.cache.get(id);
        if(res){
            res.write(`data: ${JSON.stringify({type, data})}\n\n`);
        }
    }

    listTwitchEventSub = token =>
    axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
  
    twitchEventSub = (userId, token) =>
        axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
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