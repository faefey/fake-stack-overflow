import Vote from './vote.js';
import {QuestionTags} from './questionspage.js';
import Answers from './answers.js';
import Comments from './comments.js';

import {formatTime} from '../helper.js';

/**
 * Page showing a single question, its answers, and associated comments.
 * @param {Object} props
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 * @param {*} props.answerQuestion Handle function to display answer question form.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 * @param {*} props.comment Handle function to comment on a question or answer.
 * @param {*} props.editAnswer Handle function to edit an answer that the user provided.
 * @param {*} props.deleteAnswer Handle function to delete an answer that the user provided.
 */
export default function Question({question, logout, askQuestion, answerQuestion, vote, comment, editAnswer, deleteAnswer}) {
  return (
    <div className="page">
      <QuestionTop question={question} logout={logout} askQuestion={askQuestion} vote={vote} />
      <Comments type={"question"} qa={question} question={question} logout={logout} vote={vote} comment={comment} />
      <Answers question={question} logout={logout} answerQuestion={answerQuestion} vote={vote} comment={comment} editAnswer={editAnswer} deleteAnswer={deleteAnswer} />
    </div>
  );
}

/**
 * Top of page for a single question.
 * @param {Object} props
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 */
function QuestionTop({question, logout, askQuestion, vote}) {
  return (
    <div id="qtop">
      <Vote logout={logout} votes={question.votes} upvote={() => vote("question", question, 1, question)} downvote={() => vote("question", question, -1, question)} />
      <QuestionTop1 question={question} logout={logout} askQuestion={askQuestion} />
      <QuestionTop2 question={question} />
      <QuestionTags q={question} />
    </div>
  );
}

/**
 * First half of top of page for a single question.
 * @param {Object} props
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 */
function QuestionTop1({question, logout, askQuestion}) {
  return (
    <div id="qtop1">
      <h1 id="qanswers">{question.answers.length} answer{question.answers.length === 1?"":"s"}</h1>
      <h1 id="qtitle">{question.title}</h1>
      {logout !== null && <button className="click" onClick={askQuestion}>Ask Question</button>}
    </div>
  );
}

/**
 * Second half of top of page for a single question.
 * @param {Object} props
 * @param {*} props.question Clicked question.
 */
function QuestionTop2({question}) {
  let text = question.text.split(/(\[[^[\]]*\]\([^()]*\))|(\n)/g);
  const link = /\[([^[\]]*)\]\(([^()]*)\)/;
  let i = 0;
  text = text.map(x => link.test(x)?<a href={x.replace(link, "$2")} target="_blank" rel="noopener noreferrer" key={i++}>{x.replace(link, "$1")}</a>:(/\n/.test(x)?<br key={i++} />:x));

  return (
    <div id="qtop2">
      <h1 id="qviews">{question.views} view{question.views === 1?"":"s"}</h1>
      <p id="qtext">{text}</p>
      <p id="qasktime" className="atime"><span style={{color: "red"}}>{question.asked_by}</span><br />asked {formatTime(Date.parse(question.ask_date_time))}</p>
    </div>
  );
}
