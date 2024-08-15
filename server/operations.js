const Account = require('./models/accounts.js');
const Question = require('./models/questions.js');
const Tag = require('./models/tags.js');
const Answer = require('./models/answers.js');
const Comment = require('./models/comments.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Registers a new user account.
 * @param {*} account Account information.
 * @returns Server message.
 */
exports.register = async (account) => {
  try {
    account.password = await bcrypt.hash(account.password, saltRounds);
    if((await Account.findOne({email: account.email}).exec()) === null) {
      await (new Account(account)).save();
      return "success";
    }
    else
      return "email";
  }
  catch(err) {
    console.log("Could not register: " + err);
    return "error";
  }
}

/**
 * Logs in a user after verifying account information.
 * @param {*} account Account information.
 * @returns Server message.
 */
exports.login = async (account) => {
  try {
    let info = await Account.findOne({email: account.email}).exec();
    if(info) {
      let match = await bcrypt.compare(account.password, info.password);
      if(match)
        return "success";
      else
        return "password";
    }
    else
      return "email";
  }
  catch(err) {
    console.log("Could not login: " + err);
    return "error";
  }
}

/**
 * Gets user profile associated with given user email.
 * @param {*} email User email.
 * @returns User profile.
 */
exports.get_user_profile = async (email) => {
  try {
    let account = await Account.findOne({email: email}, {password: 0}).populate({path: "questions", populate: {path: "tags", model: "Tag"}}).populate("tags").exec();
    let answered = await Question.find({answers: {$in: account.answers}}).populate("tags").exec();
    let all_questions = await this.get_questions();

    if(account.admin) {
      let users = await Account.find({}, {password: 0}).populate({path: "questions", populate: {path: "tags", model: "Tag"}}).populate("tags").exec();
      return {...account._doc, answers: answered, all_questions: all_questions, users: users};
    }
    else
      return {...account._doc, answers: answered, all_questions: all_questions};
  }
  catch(err) {
    console.log("Could not get account: " + err);
  }
}

/**
 * Removes the account associated with given user email.
 * @param {*} user_email User email.
 * @param {*} admin_email Admin email.
 * @returns Admin profile.
 */
exports.remove_account = async (user_email, admin_email) => {
  try {
    let account = await Account.findOne({email: user_email}, {password: 0}).populate("questions").populate("tags").populate("answers").exec();
    await Promise.all(account.tags.map(t => this.remove_tag(user_email, t._id)));
    await Promise.all(account.answers.map(a => this.remove_answer(user_email, a._id, 0)));
    await Promise.all(account.questions.map(q => this.remove_question(user_email, q._id)));
    await Account.deleteOne({email: user_email}).exec();
    return await this.get_user_profile(admin_email);
  }
  catch(err) {
    console.log("Could not remove account: " + err);
  }
}

/**
 * Gets all questions.
 * @returns All questions.
 */
exports.get_questions = async () => {
  try {
    return await Question.find({}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not get questions: " + err);
  }
}

/**
 * Gets all tags.
 * @returns All tags.
 */
exports.get_tags = async () => {
  try {
    return await Tag.find({}).exec();
  }
  catch(err) {
    console.log("Could not get tags: " + err);
  }
}

/**
 * Gets all answers.
 * @returns All answers.
 */
exports.get_answers = async () => {
  try {
    return await Answer.find({}).exec();
  }
  catch(err) {
    console.log("Could not get answers: " + err);
  }
}

/**
 * Gets a specific question with the given id for viewing purposes.
 * @param {*} id Question id.
 * @returns Specified question.
 */
exports.view_question = async (id) => {
  try {
    await Question.updateOne({_id: id}, {$inc: {views: 1}}).exec();
    return await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not view question: " + err);
  }
}

/**
 * Gets a specific question with the given id for editing purposes.
 * @param {*} id Question id.
 * @returns Specified question.
 */
exports.edit_question = async (id) => {
  try {
    return await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not get question: " + err);
  }
}

/**
 * Gets a specific question with the given id and differentiates between answers from and not from the user.
 * @param {*} email User email.
 * @param {*} id Question id.
 * @returns Specified question.
 */
exports.get_user_answers = async (email, id) => {
  try {
    let question = await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
    let account = await Account.findOne({email: email}).populate({path: "answers", populate: {path: "comments", model: "Comment"}}).exec();

    let user_answers = [];
    let not_user_answers = [];

    question.answers.forEach(a => {
      if(account.answers.some(b => b._id.toString() === a._id.toString()))
        user_answers.push(a);
      else
        not_user_answers.push(a);
    });

    user_answers.sort((a, b) => b.ans_date_time - a.ans_date_time);
    not_user_answers.sort((a, b) => b.ans_date_time - a.ans_date_time);

    return {...question._doc, answers: [...user_answers, ...not_user_answers], split: user_answers.length};
  }
  catch(err) {
    console.log("Could not get question: " + err);
  }
}

/**
 * Gets a specific answer with the given id for editing purposes.
 * @param {*} id Answer id.
 * @returns Specified answer.
 */
exports.edit_answer = async (id) => {
  try {
    return await Answer.findOne({_id: id}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not get answer: " + err);
  }
}

/**
 * Gets a specific tag with the given id for editing purposes.
 * @param {*} email User email.
 * @param {*} id Tag id.
 * @returns Specified tag.
 */
exports.edit_tag = async (email, id) => {
  try {
    let tag = await Tag.findOne({_id: id}).exec();
    let used = await Question.find({tags: tag}).exec();
    let account = await Account.findOne({email: email}).populate("questions").exec();

    used = used.filter(u => account.questions.find(q => q._id.toString() === u._id.toString()) === undefined);

    if(used.length === 0)
      return await Tag.findOne({_id: id}).exec();
    else
      return "tag";
  }
  catch(err) {
    console.log("Could not get tag: " + err);
  }
}

/**
 * Updates vote count of a specific item.
 * @param {*} email User email.
 * @param {*} type Type of vote (question, answer, or comment).
 * @param {*} qid Question id.
 * @param {*} id Id of item that was voted on.
 * @param {*} change Amount of increase/decrease.
 * @returns Question that was interacted with.
 */
exports.vote = async (email, type, qid, id, change) => {
  try {
    let account = await Account.findOne({email: email}).exec();

    if(!account.admin && type !== "comment" && account.reputation < 50)
      return "reputation";

    if(type === "question")
      await Question.updateOne({_id: id}, {$inc: {votes: change}}).exec();
    else if(type === "answer")
      await Answer.updateOne({_id: id}, {$inc: {votes: change}}).exec();
    else
      await Comment.updateOne({_id: id}, {$inc: {votes: change}}).exec();

    if(type !== "comment") {
      if(change === 1)
        await Account.updateOne({email: email}, {$inc: {reputation: 5}}).exec();
      else
        await Account.updateOne({email: email}, {$inc: {reputation: -10}}).exec();
    }

    return await Question.findOne({_id: qid}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not change vote by " + change + ": " + err);
  }
}

/**
 * Adds a question to database.
 * @param {*} email User email.
 * @param {*} question Question to be added.
 * @param {*} tags Tags of question to be added.
 * @returns Added question.
 */
exports.add_question = async (email, question, tags) => {
  try {
    let account = await Account.findOne({email: email}).exec();
    let found = await Promise.all(tags.map(t => Tag.findOne({name: t}).exec()));

    if(!account.admin && account.reputation < 50) {
      for(let i = 0; i < found.length; i++) {
        if(found[i] === null)
          return "reputation";
      }
    }

    await Promise.all(tags.map(t => Tag.updateOne({name: t}, {$set: {name: t}}, {upsert: true}).exec()));
    tags = await Promise.all(tags.map(t => Tag.findOne({name: t}).exec()));
    question.tags = tags;
    question.asked_by = (await Account.findOne({email: email}).exec()).username;
    let q = await (new Question(question)).save();
    await Account.updateOne({email: email}, {$push: {questions: q}}).exec();
    tags = tags.filter(t => found.find(f => f !== null && f.name === t.name) === undefined);
    await Promise.all(tags.map(t => Account.updateOne({email: email, tags: {$ne: t}}, {$push: {tags: t}}).exec()));
    return q;
  }
  catch(err) {
    console.log("Could not add question: " + err);
  }
}

/**
 * Adds an answer to database.
 * @param {*} email User email.
 * @param {*} id Question id.
 * @param {*} answer Answer to be added.
 * @returns Question of added answer.
 */
exports.add_answer = async (email, id, answer) => {
  try {
    answer.ans_by = (await Account.findOne({email: email}).exec()).username;
    let a = await (new Answer(answer)).save();
    await Question.updateOne({_id: id}, {$push: {answers: a}}).exec();
    await Account.updateOne({email: email}, {$push: {answers: a}}).exec();
    return await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not add answer: " + err);
  }
}

/**
 * Adds a comment to database.
 * @param {*} email User email.
 * @param {*} type Type of comment (question or answer).
 * @param {*} qid Question id.
 * @param {*} id Id of item that comment will be added to.
 * @param {*} comment Comment to be added.
 * @returns Question of added comment.
 */
exports.add_comment = async (email, type, qid, id, comment) => {
  try {
    let account = await Account.findOne({email: email}).exec();

    if(!account.admin && account.reputation < 50)
      return "reputation";

    comment.com_by = account.username;

    let c = await (new Comment(comment)).save();
    if(type === "question")
      await Question.updateOne({_id: id}, {$push: {comments: c}}).exec();
    else
      await Answer.updateOne({_id: id}, {$push: {comments: c}}).exec();
    
    return await Question.findOne({_id: qid}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not add comment: " + err);
  }
}

/**
 * Updates question in database.
 * @param {*} email User email.
 * @param {*} question Question to be updated.
 * @param {*} tags Tags of question to be updated.
 * @returns Updated question.
 */
exports.update_question = async (email, question, tags) => {
  try {
    let found = await Promise.all(tags.map(t => Tag.findOne({name: t}).exec()));
    await Promise.all(tags.map(t => Tag.updateOne({name: t}, {$set: {name: t}}, {upsert: true}).exec()));
    tags = await Promise.all(tags.map(t => Tag.findOne({name: t}).exec()));
    await Question.updateOne({_id: question._id}, {...question, tags: tags}).exec();
    tags = tags.filter(t => found.find(f => f !== null && f.name === t.name) === undefined);
    await Promise.all(tags.map(t => Account.updateOne({email: email, tags: {$ne: t}}, {$push: {tags: t}}).exec()));
    return await Question.findOne({_id: question._id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not update question: " + err);
  }
}

/**
 * Updates an answer in database.
 * @param {*} id Question id.
 * @param {*} answer Answer to be updated.
 * @returns Question of answer to be updated.
 */
exports.update_answer = async (id, answer) => {
  try {
    await Answer.updateOne({_id: answer._id}, answer).exec();
    return await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not update question: " + err);
  }
}

/**
 * Updates a tag in database.
 * @param {*} email User email.
 * @param {*} tag Tag to be updated.
 * @returns User profile.
 */
exports.update_tag = async (email, tag) => {
  try {
    if((await Tag.findOne({name: tag.name}).exec()) !== null)
      return "tag";
    await Tag.updateOne({_id: tag._id}, tag).exec();
    return await this.get_user_profile(email);
  }
  catch(err) {
    console.log("Could not update tag: " + err);
  }
}

/**
 * Removes a question from database.
 * @param {*} email User email.
 * @param {*} id Question id.
 * @returns User profile.
 */
exports.remove_question = async (email, id) => {
  try {
    let question = await Question.findOne({_id: id}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
    await Account.updateOne({email: email}, {$pull: {questions: question._id}}).exec();
    await Promise.all(question.answers.map(a => this.remove_answer(email, a._id, 0)));
    await Comment.deleteMany({_id: {$in: question.comments}}).exec();
    await Question.deleteOne({_id: id}).exec();
    return await this.get_user_profile(email);
  }
  catch(err) {
    console.log("Could not remove question: " + err);
  }
}

/**
 * Removes a tag from database.
 * @param {*} email User email.
 * @param {*} id Tag id.
 * @returns User profile.
 */
exports.remove_tag = async (email, id) => {
  try {
    let tag = await Tag.findOne({_id: id}).exec();
    let used = await Question.find({tags: tag}).exec();
    let account = await Account.findOne({email: email}).populate("questions").exec();

    used = used.filter(u => account.questions.find(q => q._id.toString() === u._id.toString()) === undefined);
    if(used.length === 0) {
      await Account.updateOne({email: email}, {$pull: {tags: tag._id}}).exec();
      await Question.updateMany({tags: tag}, {$pull: {tags: tag._id}}).exec();
      await Tag.deleteOne({_id: id}).exec();
      return await this.get_user_profile(email);
    }
    else
      return "tag";
  }
  catch(err) {
    console.log("Could not remove tag: " + err);
  }
}

/**
 * Removes an answer from database.
 * @param {*} email User email.
 * @param {*} id Answer id.
 * @param {*} qid Question id.
 * @returns Question of removed answer.
 */
exports.remove_answer = async (email, id, qid) => {
  try {
    let answer = await Answer.findOne({_id: id}).populate("comments").exec();
    await Account.updateOne({email: email}, {$pull: {answers: answer._id}}).exec();
    await Question.updateOne({answers: answer}, {$pull: {answers: answer._id}}).exec();
    await Comment.deleteMany({_id: {$in: answer.comments}}).exec();
    await Answer.deleteOne({_id: id}).exec();
    if(qid !== 0)
      return await Question.findOne({_id: qid}).populate("tags").populate({path: "answers", populate: {path: "comments", model: "Comment"}}).populate("comments").exec();
  }
  catch(err) {
    console.log("Could not remove answer: " + err);
  }
}
