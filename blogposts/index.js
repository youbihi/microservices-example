const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const blogposts = {};

app.get('/blogposts', (req, res) => {
  res.send(blogposts);
});

app.post('/blogposts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  blogposts[id] = {
    id,
    title,
  };

  console.log('blogposte Service, Event Created:', 'BlogpostCreated');

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'BlogpostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(blogposts[id]);
});

app.post('/events', (req, res) => {
  console.log('blogposte Service: Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on 4000');
});
