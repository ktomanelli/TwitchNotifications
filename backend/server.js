const express = require('express');
const mongoose = require('mongoose');
const { urlencoded } = require('express');
const {
  getClientToken,
  getUser,
  verifyRequest,
  refreshToken,
  getAppToken,
  getUserFromName,
} = require('./auth');
const {
  initEventSub,
  twitchEventSub,
  listTwitchEventSub,
  sendEvent,
} = require('./controllers/eventController');
const Client = require('./models/Client');
require('dotenv').config();

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qnss4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);
const app = express();

app.set('view engine', 'ejs');

app.use(
  express.json({
    verify: verifyRequest,
  })
);
app.use(urlencoded({ extended: true }));

// app.get('/live', (req, res) => {
//   res.redirect(
//     'https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=86bqvqw8f722hn3refzoqntfobzc5c&redirect_uri=https://kylefrominternet.stream/auth&scope=user_read'
//   );
// });

// app.get('/live/:id', (req, res) => {
//   const { id } = req.params;
//   if (id) {
//     res.render('live.ejs', { id });
//   } else {
//     res.redirect('/live');
//   }
// });

app.get('/event/:id', (req, res) => {
  initEventSub(req, res);
});

app.post('/event/:id', (req, res) => {
  const { id } = req.params;
  if (id) {
    sendEvent(id, req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.get('/twitch/webhook/list', async (req, res) => {
  try {
    const tokenResp = await getAppToken();
    const token = tokenResp.data.access_token;
    const resp = await listTwitchEventSub(token);
    res.status(200).json(resp.data);
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
        await twitchEventSub(id, token);
        res.sendStatus(200);
      } else {
        throw new Error('Unable to initialize twitch event subscription');
      }
    }
    throw new Error('ID not specified');
  } catch (e) {
    res.sendStatus(500);
    console.log(e);
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
      sendEvent(id, req.body);
    }
    console.log(req.body);
    res.sendStatus(200);
  }
});

app.get('/auth', async (req, res) => {
  try {
    const { code } = req.query;
    if (code) {
      try {
        const resp = await getClientToken(code);
        const { data } = resp;
        const token = data.access_token;

        const userResp = await getUserFromName(token, 'hasanabi');
        const user = userResp.data.data[0];
        const { id } = user;

        // eslint-disable-next-line no-new
        const client = new Client({ _id: id, user, data: resp.data });
        client.save();

        res.redirect(`/live/${id}`);
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

// app.get('/', async (req, res) => {
//   res.redirect('https://twitch.tv/kylefrominternet');
// });

app.listen(3000, () => console.log('listening on 3000'));
