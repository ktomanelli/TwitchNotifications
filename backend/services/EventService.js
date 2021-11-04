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

  listTwitchEventSub = async (token,id=null) =>{
    const subsResp = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    const subs = subsResp.data;
    if(id){
      return subs.data.filter(item=>item.condition.broadcaster_user_id===id);
    }else{
      return subs;
    }
  }

  deleteTwitchEventSub = async (token, subscriptions) => {
    const twitchSubs = await this.listTwitchEventSub(token);
    let subs = subscriptions;
    if(!Array.isArray(subscriptions)) subs = [subscriptions];
    const validSubs = twitchSubs.data.filter(item=> subs.includes(item.id));
    for(const sub of validSubs){
      if(sub.id){
        axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
          headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
  }

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

    createNewEventEventSubInCache = async (id) => {
      const tokenResp = await getAppToken();
      const token = tokenResp.data.access_token;            
      const subs = await this.listTwitchEventSub(token, id)
      const subsciptionIds = subs.map(item => item.id);
      this.cache.new(id, subsciptionIds)
    }
}

module.exports = EventService;
