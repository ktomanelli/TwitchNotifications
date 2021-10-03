const axios = require('axios');
const crypto = require('crypto');
const Client = require('./models/Client');
require('dotenv').config();

const baseUrl = 'https://id.twitch.tv/oauth2';
const redirectUrl = 'https://kylefrominternet.stream/auth';
const url = `
https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=86bqvqw8f722hn3refzoqntfobzc5c&redirect_uri=https://kylefrominternet.stream/auth&scope=user_read
`;

const getAppToken = async () =>
  axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&grant_type=client_credentials`
  );

const getClientToken = async code =>
  axios.post(
    `${baseUrl}/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUrl}`
  );

const getUserFromName = async (token, userName) =>
  axios.get(`https://api.twitch.tv/helix/users?login=${userName}`, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

const getUserFromToken = async token =>
  axios.get(`https://api.twitch.tv/helix/users`, {
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${token}`,
    },
  });

const verifyRequest = (req, res, buf, encoding) => {
  req.twitch_eventsub = false;
  if (req.headers && req.headers?.['twitch-eventsub-message-signature']) {
    req.twitch_eventsub = true;
    const id = req.headers['twitch-eventsub-message-id'];
    const timestamp = req.headers['twitch-eventsub-message-timestamp'];
    const hmacMessage = `${id}${timestamp}${buf}`;
    const [algo, signature] = req.headers[
      'twitch-eventsub-message-signature'
    ].split('=');
    req.calculatedSig = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(hmacMessage)
      .digest('hex');
    req.twitch_signature = signature;

    if (req.twitch_signature !== req.calculatedSig) {
      console.log('unauthorized');
      res.sendStatus(401);
    } else {
      console.log('authorized');
    }
  }
};

const refreshToken = async id => {
  const client = Client.all[id];
  try {
    const resp = await axios.post(
      `${baseUrl}/token?grant_type=refresh_token&refresh_token=${client.data.refresh_token}&client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET}`
    );
    if (resp.data.access_token) {
      client.data = resp.data;
      return resp.data.access_token;
    }
    return null;
  } catch (e) {
    console.log('error refreshing token');
    console.log(e);
  }
};

module.exports = {
  getClientToken,
  getAppToken,
  getUserFromName,
  getUserFromToken,
  verifyRequest,
  refreshToken,
};
