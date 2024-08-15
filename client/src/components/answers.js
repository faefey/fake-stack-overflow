import {useState} from 'react';
import Vote from './vote.js';
import Comments from './comments.js';
import PrevNext from './prevnext.js';

import {formatTime} from '../helper.js';

/**
 * List of answers to a question.
 * @param {Object} props
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.answerQuestion Handle function to display answer question form.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 * @param {*} props.comment Handle function to comment on a question or answer.
 * @param {*} props.editAnswer Handle function to edit an answer that the user provided.
 * @param {*} props.deleteAnswer Handle function to delete an answer that the user provided.
 */
export default function Answers({question, logout, answerQuestion, vote, comment, editAnswer, deleteAnswer}) {
  const [shown, setShown] = useState({i: 0, j: 5});

  // handle function to go to previous answers
  function handlePrev() {
    setShown({i: shown.i - 5, j: shown.j - 5});
  }

  // handle function to go to next answers
  function handleNext(len) {
    if(shown.j >= len)
      setShown({i: 0, j: 5});
    else
      setShown({i: shown.i + 5, j: shown.j + 5});
  }

  let i = 0;
  let answers = question.answers;

  if(!question.edit)
    answers.sort((a, b) => Date.parse(b.ans_date_time) - Date.parse(a.ans_date_time));

  answers = answers.slice(shown.i, shown.j).map(a => (
    <div key={i++}>
      <Answer answer={a} question={question} logout={logout} vote={vote} ind={shown.i + i} editAnswer={editAnswer} deleteAnswer={deleteAnswer} />
      <Comments type={"answer"} qa={a} question={question} logout={logout} vote={vote} comment={comment} />
    </div>
  ));

  return (
    <div id="alist">
      {answers}
      <PrevNext i={shown.i} show={5} len={question.answers.length} prev={handlePrev} next={handleNext} />
      {logout !== null && <button id="answerquestion" className="click" onClick={answerQuestion}>Answer Question</button>}
    </div>
  );
}

/**
 * A single answer to a question.
 * @param {Object} props
 * @param {*} props.answer A single answer.
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 * @param {*} props.ind Index of answer.
 * @param {*} props.editAnswer Handle function to edit an answer that the user provided.
 * @param {*} props.deleteAnswer Handle function to delete an answer that the user provided.
 */
function Answer({answer, question, logout, vote, ind, editAnswer, deleteAnswer}) {
  let text = answer.text.split(/(\[[^[\]]*\]\([^()]*\))|(\n)/g);
  const link = /\[([^[\]]*)\]\(([^()]*)\)/;
  let i = 0;
  text = text.map(x => link.test(x)?<a href={x.replace(link, "$2")} target="_blank" rel="noopener noreferrer" key={i++}>{x.replace(link, "$1")}</a>:(/\n/.test(x)?<br key={i++} />:x));

  return (
    <div className="a">
      <Vote logout={logout} votes={answer.votes} upvote={() => vote("answer", answer, 1, question)} downvote={() => vote("answer", answer, -1, question)} />
      <p className="atext">{text}</p>
      <p className="atime"><span style={{color: "green"}}>{answer.ans_by}</span><br />answered {formatTime(Date.parse(answer.ans_date_time))}</p><br />
      {question.edit && ind < question.split && <button id="editanswer" className="click" onClick={() => editAnswer(answer)}>Edit</button>}
      {question.edit && ind < question.split && <button id="deleteanswer" className="click" onClick={() => deleteAnswer(answer, question)}>Delete</button>}
    </div>
  );
}
