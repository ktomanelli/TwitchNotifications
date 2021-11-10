const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { urlencoded } = require('express');
const {
  getClientToken,
  getUser,
  verifyRequest,
  refreshToken,
  getAppToken,
  getUserFromName,
} = require('./auth');
const EventController = require('./controllers/eventController');
const EventService = require('./services/EventService');
const Cache = require('./cache');
const Client = require('./models/Client');
require('dotenv').config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qnss4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);
const app = express();

const cache = new Cache();
const eventService = new EventService(cache);
const eventController = new EventController(cache, eventService);
app.use(cors())

app.use(
  express.json({
    verify: verifyRequest,
  })
);
app.use(urlencoded({ extended: true }));

app.get('/event/:id/:uuid', (req, res) => {
  eventController.initEventSub(req, res);
});

app.post('/event/:id', (req, res) => {
  const id = req.body.event.broadcaster_user_id;
  if (id) {
    eventService.sendEvent(id, req.body);
    res.sendStatus(200)
  }});

app.get('/twitch/webhook/list', async (req, res) => {
  try {
    const tokenResp = await getAppToken();
    const token = tokenResp.data.access_token;
    const resp = await eventService.listTwitchEventSub(token);
    res.status(200).json(resp.data);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.delete('/twitch/webhook', async (req, res) => {
  try {
    const {subId} = req.body;
    const tokenResp = await getAppToken();
    const token = tokenResp.data.access_token;
    await eventService.deleteTwitchEventSub(token, subId);
    res.sendStatus(200)
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// init twitch event sub
app.get('/twitch/webhook/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const tokenResp = await getAppToken();
      const token = tokenResp.data.access_token;
      if (token) {
        console.log('sending twitch event sub');
        const twitchSub = await eventService.twitchEventSub(id, token);
        const subid = twitchSub.data.data[0].id;
        cache.new(id, subid);
        res.status(200).json(twitchSub.data.data[0]);
      } else {
        throw new Error('Unable to initialize twitch event subscription');
      }
    }else{
      throw new Error('ID not specified');
    }
  } catch (e) {
    if(e?.response?.status===409){
      res.sendStatus(409)
      console.log('subscription already exists')
    } else{
      res.sendStatus(500);
      console.log(e);
    }
  }
});

// twitch callback
app.post('/twitch/webhook', (req, res) => {
  const { challenge } = req.body;
  if (challenge) {
    res.type('text/plain');
    res.send(challenge);
  } else {
    const id = req.body.event.broadcaster_user_id;
    if (id) {
      console.log(req.body)
      eventService.sendEvent(id, req.body);
    }
    console.log('received message from twitch');
    res.sendStatus(200);
  }
});

app.post('/auth', async (req, res) => {
  try {
    const { code } = req.body;
    if (code) {
      try {
        const resp = await getClientToken(code);
        const { data } = resp;
        const token = data.access_token;

        const userResp = await getUserFromName(token, 'kylefrominternet');
        const user = userResp.data.data[0];
        const { id } = user;
        const client = await new Promise((resolve,reject)=>{
          Client.findByIdAndUpdate(id, { $set: { _id: id, user, data: resp.data }}, { upsert: true  }, (err,data)=>{
            if(err){
              console.log(err)
              reject(err);
            }else{
              if(data){
                resolve(data);
              }else{
                resolve({
                  _id:id,
                  user
                })
              }
            }
          })

        })

        res.status(200).json({client})
      } catch (e) {
        console.log(e);
        throw new Error('error in getting token or userid from twitch');
      }
    } else {
      throw new Error('no code in request');
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('listening on 3000'));
