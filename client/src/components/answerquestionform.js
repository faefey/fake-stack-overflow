import {useState} from 'react';
import FormDiv from './formdiv.js';

import {postAnswer} from '../handle.js';

/**
 * Form to be filled out when answering a question.
 * @param {Object} props
 * @param {*} props.setDisplay Function to change currently displayed content.
 * @param {*} props.question Question of answer to be edited.
 */
export default function AnswerQuestionForm({setDisplay, question}) {
  const [fields, setFields] = useState({
    answerText: question.edit ? question.answer.text : ""
  });

  const [fieldErrors, setFieldErrors] = useState({
    answerText: ""
  });

  // handle function to update answer text state
  function handleAnswerTextChange(e) {
    setFields({...fields, answerText: e.target.value});
  }

  // handle function to post answer to question
  function handlePostAnswer() {
    postAnswer(setDisplay, question, fields, setFieldErrors);
  }

  return (
    <div className="page">
      <form className="form">
        <FormDiv h1={"Answer Text*"} p={""} rows={"10"} text={fields.answerText} onchange={handleAnswerTextChange} error={fieldErrors.answerText} />
        <button id="postanswer" className="click" type="button" onClick={handlePostAnswer}>Post Answer</button>
        <p className="mandatoryfield">* indicates mandatory fields</p>
      </form>
    </div>
  );
}
