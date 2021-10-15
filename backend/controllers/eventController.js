const { default: axios } = require('axios');
const Client = require('../models/Client');

class EventController {
  constructor(cache, eventService) {
    this.eventService = eventService;
    this.cache = cache;
  }

  initEventSub = async (req, res) => {
    const { id, uuid } = req.params;
    const client = await Client.findOne({ _id: id }).exec();

    if (client) {
      const headers = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      };
      res.writeHead(200, headers);

      this.cache.addClient(id, uuid, res);

      req.on('close', async () => {
        const {uuid} = req.params
        const client = this.cache.get(id);
        this.cache.closeClient(id, uuid)
        if(client.clients.length === 0 ){
          await this.eventService.deleteAllSubs(client.subscriptions);
        }
      });
    } else {
      res.sendStatus(400);
    }
  };

  sendEvent = (req, res) => {
    const { id } = req.params;
    if (id) {
      const { data } = req.body;
      this.eventService.sendEvent(id, data.subscription.type, data);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  };
}

module.exports = EventController;
