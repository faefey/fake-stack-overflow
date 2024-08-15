import {useState, useEffect} from 'react';
import PrevNext from './prevnext.js'

import {formatTime} from '../helper.js';

/**
 * Page showing all questions.
 * @param {Object} props
 * @param {*} props.questionList List of all questions.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 * @param {*} props.sortByNewest Handle function to sort questions by newest.
 * @param {*} props.sortByActive Handle function to sort questions by active.
 * @param {*} props.sortByUnanswered Handle function to sort questions by unanswered.
 * @param {*} props.question Handle function to display clicked question.
 */
export default function QuestionsPage({questionList, logout, askQuestion, sortByNewest, sortByActive, sortByUnanswered, question}) {
  const [shown, setShown] = useState({i: 0, j: 5});

  // start from beginning of questions again
  useEffect(() => {
    setShown({i: 0, j: 5});
  }, [questionList]);

  // handle function to go to previous questions
  function handlePrev() {
    setShown({i: shown.i - 5, j: shown.j - 5});
  }

  // handle function to go to next questions
  function handleNext(len) {
    if(shown.j >= len)
      setShown({i: 0, j: 5});
    else
      setShown({i: shown.i + 5, j: shown.j + 5});
  }

  return (
    <div className="page">
      <QuestionsTop search={questionList.search} sort={questionList.sort} questions={questionList.fquestions} logout={logout} askQuestion={askQuestion} 
      sortByNewest={sortByNewest} sortByActive={sortByActive} sortByUnanswered={sortByUnanswered} />
      <Questions search={questionList.search} questions={questionList.fquestions.slice(shown.i, shown.j)} question={question} shown={shown} len={questionList.fquestions.length} prev={handlePrev} next={handleNext} />
    </div>
  );
}

/**
 * Top of questions page.
 * @param {Object} props
 * @param {*} props.search Whether or not the list of questions resulted from a search.
 * @param {*} props.sort Number indicating the current sort.
 * @param {*} props.questions Questions to be shown.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 * @param {*} props.sortByNewest Handle function to sort questions by newest.
 * @param {*} props.sortByActive Handle function to sort questions by active.
 * @param {*} props.sortByUnanswered Handle function to sort questions by unanswered.
 */
function QuestionsTop({search, sort, questions, logout, askQuestion, sortByNewest, sortByActive, sortByUnanswered}) {
  return (
    <div id="top">
      <QuestionsTop1 search={search} logout={logout} askQuestion={askQuestion} />
      <QuestionsTop2 sort={sort} questions={questions} sortByNewest={sortByNewest} sortByActive={sortByActive} sortByUnanswered={sortByUnanswered} />
    </div>
  );
}

/**
 * First half of top of questions page.
 * @param {Object} props
 * @param {*} props.search Whether or not the list of questions resulted from a search.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 */
function QuestionsTop1({search, logout, askQuestion}) {
  return (
    <div id="top1">
      <h1 id="allquestions">{search?"Search Results":"All Questions"}</h1>
      {logout !== null && <button className="click" onClick={askQuestion}>Ask Question</button>}
    </div>
  );
}

/**
 * Second half of top of questions page.
 * @param {Object} props
 * @param {*} props.sort Number indicating the current sort.
 * @param {*} props.questions Questions to be shown.
 * @param {*} props.sortByNewest Handle function to sort questions by newest.
 * @param {*} props.sortByActive Handle function to sort questions by active.
 * @param {*} props.sortByUnanswered Handle function to sort questions by unanswered.
 */
function QuestionsTop2({sort, questions, sortByNewest, sortByActive, sortByUnanswered}) {
  return (
    <div id="top2">
      <p className="qnum">{questions.length} question{questions.length === 1?"":"s"}</p>
      <div id="buttons">
        <button id="newest" className="controls" style={{backgroundColor: sort === 1?"lightgray":"white"}} onClick={sortByNewest}>Newest</button>
        <button id="active" className="controls" style={{backgroundColor: sort === 2?"lightgray":"white"}} onClick={sortByActive}>Active</button>
        <button id="unanswered" className="controls" style={{backgroundColor: sort === 3?"lightgray":"white"}} onClick={sortByUnanswered}>Unanswered</button>
      </div>
    </div>
  );
}

/**
 * List of questions.
 * @param {Object} props
 * @param {*} props.search Whether or not the list of questions resulted from a search.
 * @param {*} props.questions Sliced questions to be shown.
 * @param {*} props.question Handle function to display clicked question.
 * @param {*} props.shown Question indices currently shown.
 * @param {*} props.len Length of whole list of questions.
 * @param {*} props.prev Handle function to go to previous questions.
 * @param {*} props.next Handle function to go to next questions.
 */
export function Questions({search, questions, question, shown, len, prev, next}) {
  if(questions.length === 0 && search)
    return (
      <h1 id="noquestionsfound">No Questions Found</h1>
    );
  else {
    let i = 0;
    let questionList = questions.map(q => (
      <div className="q" key={i++}>
        <QuestionInfo q={q} question={question} />
        <QuestionTags q={q} />
      </div>
    ));
    return (
      <div id="qlist">
        {questionList}
        <PrevNext i={shown.i} show={5} len={len} prev={prev} next={next} />
      </div>
    );
  }
}

/**
 * Information about a single question.
 * @param {Object} props
 * @param {*} props.q A single question.
 * @param {*} props.question Handle function to display clicked question.
 */
function QuestionInfo({q, question}) {
  return (
    <div className="qinfo">
      <p className="qstats">{q.answers.length} answer{q.answers.length === 1?"":"s"}<br/>{q.views} view{q.views === 1?"":"s"}<br/>{q.votes} vote{q.votes === 1?"":"s"}</p>
      <h1 onClick={() => question(q)}>{q.title}</h1>
      <p className="atime"><span style={{color: "red"}}>{q.asked_by}</span> asked {formatTime(Date.parse(q.ask_date_time))}</p>
      <p className="qsummary">{q.summary}</p>
    </div>
  );
}

/**
 * Tags of a single question.
 * @param {Object} props
 * @param {*} props.q A single question.
 */
export function QuestionTags({q}) {
  const tags = q.tags.map(t => <button key={t.name}>{t.name}</button>);
  return (
    <div className="qtags">
      {tags}
    </div>
  );
}
