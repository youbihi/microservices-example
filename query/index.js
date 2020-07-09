const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const blogposts = {};

const handleEvent = (type, data) => {
  if (type === 'BlogpostCreated') {
    const { id, title } = data;

    blogposts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, blogpostId, status } = data;

    const blogpost = blogposts[blogpostId];
    blogpost.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, blogpostId, status } = data;

    const blogpost = blogposts[blogpostId];
    const comment = blogpost.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get('/blogposts', (req, res) => {
  res.send(blogposts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
  console.log('Query Service, Event received:', req.body.type);
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  const res = await axios.get('http://event-bus-srv:4005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    handleEvent(event.type, event.data);
  }
});
