// Run this script to launch the server.
// The server runs on localhost port 8000.

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const operations = require('./operations.js');

// connect to database
const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database.');
});

// set up middleware
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.argv[2],
  cookie: {},
  resave: false,
  saveUninitialized: false
}));

// registers the user
app.post('/register', async (req, res) => {
  operations.register(req.body).then((data) => res.send(data));
});

// logs in the user
app.post('/login', (req, res) => {
  if(req.session.email)
    res.send('success');
  else
    operations.login(req.body)
      .then((data) => {
        if(data === 'success')
          req.session.email = req.body.email;
        res.send(data);
      });
});

// logs out the user
app.post('/logout', (req, res) => {
  req.session.destroy(err => console.log(err));
});

// provides the user's profile
app.get('/userprofile', (req, res) => {
  operations.get_user_profile(req.session.email).then((data) => res.send(data));
});

// provides the requested user's profile
app.post('/userprofile', (req, res) => {
  req.session.user_email = req.body.email;
  operations.get_user_profile(req.body.email).then((data) => res.send(data));
});

// deletes the requested user's account
app.post('/deleteaccount', (req, res) => {
  operations.remove_account(req.body.email, req.session.email).then((data) => res.send(data));
});

// provides questions, tags, and answers
app.get('/data', async (req, res) => {
  let data = {questions: [], tags: [], answers: []};
  await operations.get_questions().then((questions) => data.questions = questions);
  await operations.get_tags().then((tags) => data.tags = tags);
  await operations.get_answers().then((answers) => data.answers = answers);
  res.send(data);
});

// provides questions
app.get('/questions', (req, res) => {
  operations.get_questions()
    .then((data) => res.send(data))
    .catch((err) => res.send('No questions found.'));
});

// provides tags
app.get('/tags', (req, res) => {
  operations.get_tags()
    .then((data) => res.send(data))
    .catch((err) => res.send('No tags found.'));
});

// provides answers
app.get('/answers', (req, res) => {
  operations.get_answers()
    .then((data) => res.send(data))
    .catch((err) => res.send('No answers found.'));
});

// provides a question to be viewed
app.get('/posts/question/:id', (req, res) => {
  operations.view_question(req.params.id)
    .then((data) => res.send(data))
    .catch((err) => res.send('Question not found.'));
});

// provides a question to be edited
app.post('/editquestion', (req, res) => {
  operations.edit_question(req.body.id).then((data) => res.send(data));
});

// provides the question of an answer to be edited
app.post('/useranswers', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.get_user_answers(email, req.body.id).then((data) => res.send(data));
});

// provides an answer to be edited
app.post('/editanswer', (req, res) => {
  operations.edit_answer(req.body.id).then((data) => res.send(data));
});

// provides a tag to be edited
app.post('/edittag', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.edit_tag(email, req.body.id).then((data) => res.send(data));
});

// updates a question in database after being edited
app.post('/updatequestion', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.update_question(email, req.body.question, req.body.tags).then((data) => res.send(data));
});

// updates an answer in database after being edited
app.post('/updateanswer', (req, res) => {
  operations.update_answer(req.body.id, req.body.answer).then((data) => res.send(data));
});

// updates a tag in database after being edited
app.post('/updatetag', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.update_tag(email, req.body).then((data) => res.send(data));
});

// deletes a question in database
app.post('/deletequestion', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.remove_question(email, req.body.id).then((data) => res.send(data));
});

// deletes a tag in database
app.post('/deletetag', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.remove_tag(email, req.body.id).then((data) => res.send(data));
});

// deletes an answer in database
app.post('/deleteanswer', (req, res) => {
  let email = req.session.email;
  if(req.session.user_email)
    email = req.session.user_email;
  operations.remove_answer(email, req.body.id, req.body.qid).then((data) => res.send(data));
});

// changes vote count of item
app.post('/vote', (req, res) => {
  operations.vote(req.session.email, req.body.type, req.body.qid, req.body.id, req.body.change).then((data) => res.send(data));
});

// adds a question to database
app.post('/questions', (req, res) => {
  operations.add_question(req.session.email, req.body.question, req.body.tags)
    .then((data) => res.send(data))
    .catch((err) => res.send('Could not add question.'));
});

// adds an answer to database
app.post('/answers', (req, res) => {
  operations.add_answer(req.session.email, req.body.id, req.body.answer)
    .then((data) => res.send(data))
    .catch((err) => res.send('Could not add answer.'));
});

// adds a comment to database
app.post('/comments', (req, res) => {
  operations.add_comment(req.session.email, req.body.type, req.body.qid, req.body.id, req.body.comment).then((data) => res.send(data));
});

// start server
const hostname = '127.0.0.1';
const port = 8000;
const server = app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// disconnect from database and close server on SIGINT
process.on('SIGINT', () => {
  if(db) {
    db.close()
      .then((result) => console.log('DB connection closed.'))
      .catch((err) => console.log(err));
  }
  console.log('Server closed. Database instance disconnected.');
  server.close()
});
