import {useState, useEffect} from 'react';
import Vote from './vote.js';
import PrevNext from './prevnext.js';

import {formatTime} from '../helper.js';

/**
 * List of comments.
 * @param {Object} props
 * @param {*} props.type Type of comment (question or answer).
 * @param {*} props.qa A single question or answer.
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 * @param {*} props.comment Handle function to comment on a question or answer.
 */
export default function Comments({type, qa, question, logout, vote, comment}) {
  const [shown, setShown] = useState({i: 0, j: 3});

  const [error, setError] = useState("");

  // start from beginning of comments again
  useEffect(() => {
    if(question.comment)
      setShown({i: 0, j: 3});
  }, [type, qa, question]);

  // handle function to go to previous comments
  function handlePrev() {
    setShown({i: shown.i - 3, j: shown.j - 3});
  }

  //handle function to go to next comments
  function handleNext(len) {
    if(shown.j >= len)
      setShown({i: 0, j: 3});
    else
      setShown({i: shown.i + 3, j: shown.j + 3});
  }

  let i = 0;
  let comments = qa.comments.sort((a, b) => Date.parse(b.com_date_time) - Date.parse(a.com_date_time)).slice(shown.i, shown.j).map(a => (
    <Comment comment={a} question={question} logout={logout} vote={vote} key={i++} />
  ));

  return (
    <div className="clist">
      {comments}
      <div className="actions">
        <PrevNext i={shown.i} show={3} len={qa.comments.length} prev={handlePrev} next={handleNext} />
        {logout !== null && <input className="comment" onKeyDown={e => comment(e.key, type, qa, e.target.value, question, setError)} key={qa.comments.length}></input>}
        {error === "length" && <p className="formerror">A comment can not be more than 140 characters.</p>}
        {error === "reputation" && <p className="formerror">You must have at least 50 reputation points to comment.</p>}
      </div>
    </div>
  );
}

/**
 * A single comment.
 * @param {Object} props
 * @param {*} props.comment A single comment.
 * @param {*} props.question Clicked question.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.vote Handle function to vote on a question, answer, or comment.
 */
function Comment({comment, question, logout, vote}) {
  let text = comment.text.split(/(\[[^[\]]*\]\([^()]*\))|(\n)/g);
  const link = /\[([^[\]]*)\]\(([^()]*)\)/;
  let i = 0;
  text = text.map(x => link.test(x)?<a href={x.replace(link, "$2")} target="_blank" rel="noopener noreferrer" key={i++}>{x.replace(link, "$1")}</a>:(/\n/.test(x)?<br key={i++} />:x));

  return (
    <div className="c">
      <Vote logout={logout} votes={comment.votes} upvote={() => vote("comment", comment, 1, question)} downvote={null} />
      <p className="ctext">{text}</p>
      <p className="atime"><span style={{color: "green"}}>{comment.com_by}</span><br />commented {formatTime(Date.parse(comment.com_date_time))}</p>
    </div>
  );
}
