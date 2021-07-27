const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

class MessageService {
  constructor() {
    this.messages = [];
  }

  async find() {
    return this.messages;
  }

  async create(data) {
    const message = {
      id: this.messages.length,
      ...data,
    };
    this.messages.push(message);
    return message;
  }
}

const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.configure(express.rest());
app.configure(socketio());

app.use('/messages', new MessageService());

app.use(express.errorHandler());

app.on('connection', (connection) => {
  app.channel('everybody').join(connection);
});

app.publish(() => app.channel('everybody'));

app.listen(3030).on('listening', () => {
  console.log('Feathers server is listening on localhost:3030');
});

app.service('messages').create({
  text: 'Bleh Server 1',
});

/*
const main = async () => {
  await app.service('messages').create({
    text: 'Bleh 1',
  });
  await app.service('messages').create({
    text: 'Bleh 2',
  });
  await app.service('messages').create({
    text: 'Bleh 3',
  });
  const messages = await app.service('messages').find();
  console.log('All messages', messages);
};

main();
*/
