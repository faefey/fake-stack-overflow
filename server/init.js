// Set up database with initial test data and include an admin user.
// Script should take admin credentials as arguments as described in README.md.
// Start the mongoDB service as a background process before running the script.

let userArgs = process.argv.slice(2);

let Comment = require('./models/comments');
let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Account = require('./models/accounts');

// connect to database
let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function tagCreate(name) {
  return (new Tag({name: name})).save();
}

function commentCreate(text, com_by, com_date_time, votes) {
  return (new Comment({text: text, com_by: com_by, com_date_time: com_date_time, votes: votes})).save();
}

function answerCreate(text, comments, ans_by, ans_date_time, votes) {
  return (new Answer({text: text, comments: comments, ans_by: ans_by, ans_date_time: ans_date_time, votes: votes})).save();
}

function questionCreate(title, summary, text, tags, comments, answers, asked_by, ask_date_time, views, votes) {
  return (new Question({title: title, summary: summary, text: text, tags: tags, comments: comments, answers: answers, asked_by: asked_by, ask_date_time: ask_date_time, views: views, votes: votes})).save();
}

// use bcrypt to encrypt passwords when creating accounts in database
let bcrypt = require('bcrypt');
let saltRounds = 10;
let admin = true;
async function accountCreate(username, email, password, reg_date_time, reputation, questions, tags, answers) {
  password = await bcrypt.hash(password, saltRounds);
  if(admin) {
    admin = false;
    return (new Account({admin: true, username: username, email: email, password: password, reg_date_time: reg_date_time, reputation: reputation, questions: questions, tags: tags, answers: answers})).save();
  }
  return (new Account({username: username, email: email, password: password, reg_date_time: reg_date_time, reputation: reputation, questions: questions, tags: tags, answers: answers})).save();
}

const populate = async () => {
  await accountCreate(userArgs[0], userArgs[0] + '@gmail.com', userArgs[1], new Date('2023-04-05'), 0, [], [], []);
  let t1 = await tagCreate('coding');
  let t2 = await tagCreate('program');
  let c1 = await commentCreate('This is a good question.', 'testuser', new Date('2023-04-12'), 0);
  let c2 = await commentCreate('This is a bad question.', 'testuser', new Date('2023-04-11'), 0);
  let c3 = await commentCreate('This is a good answer.', 'testuser', new Date('2023-04-10'), 0);
  let c4 = await commentCreate('This is a bad answer.', 'testuser', new Date('2023-04-09'), 0);
  let a1 = await answerCreate('The answer is...', [c3, c4], 'testuser', new Date('2023-04-08'), 0);
  let q1 = await questionCreate('First Question', 'Summary of first question.', 'Text of first question.', [t1, t2], [c1, c2], [a1], 'testuser', new Date('2023-04-07'), 10, 0);
  await accountCreate('testuser', 'testuser@gmail.com', 'password', new Date('2023-04-06'), 60, [q1], [t1, t2], [a1]);

  if(db) db.close();
  console.log('Done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('Processing...');
