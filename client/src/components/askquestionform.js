import {useState} from 'react';
import FormDiv from './formdiv.js';

import {postQuestion} from '../handle.js';

/**
 * Form to be filled out when asking a question.
 * @param {Object} props
 * @param {*} props.setDisplay Function to change currently displayed content.
 * @param {*} props.question Question to be edited.
 * @param {*} props.deleteQuestion Handle function to delete a question that the user has asked.
 */
export default function AskQuestionForm({setDisplay, question, deleteQuestion}) {
  const [fields, setFields] = useState({
    questionTitle: question.edit ? question.title : "",
    questionSummary: question.edit ? question.summary : "",
    questionText: question.edit ? question.text : "",
    tags: question.edit ? question.tags.map(t => t.name).join(" ") : ""
  });

  const [fieldErrors, setFieldErrors] = useState({
    questionTitle: "",
    questionSummary: "",
    questionText: "",
    tags: ""
  });

  // // handle function to update question title state
  function handleQuestionTitleChange(e) {
    setFields({...fields, questionTitle: e.target.value});
  }

  // handle function to update question summary state
  function handleQuestionSummaryChange(e) {
    setFields({...fields, questionSummary: e.target.value});
  }

  // handle function to update question text state
  function handleQuestionTextChange(e) {
    setFields({...fields, questionText: e.target.value});
  }

  // handle function to update tags state
  function handleTagsChange(e) {
    setFields({...fields, tags: e.target.value});
  }

  // handle function to post question
  function handlePostQuestion() {
    postQuestion(setDisplay, fields, setFieldErrors, question);
  }

  return (
    <div className="page">
      <form className="form">
        <FormDiv h1={"Question Title*"} p={"Limit title to 50 characters or less."} rows={"2"} text={fields.questionTitle} onchange={handleQuestionTitleChange} error={fieldErrors.questionTitle} />
        <FormDiv h1={"Question Summary*"} p={"Limit summary to 140 characters or less."} rows={"3"} text={fields.questionSummary} onchange={handleQuestionSummaryChange} error={fieldErrors.questionSummary} />
        <FormDiv h1={"Question Text*"} p={"Add details."} rows={"10"} text={fields.questionText} onchange={handleQuestionTextChange} error={fieldErrors.questionText} />
        <FormDiv h1={"Tags*"} p={"Add keywords separated by whitespace."} rows={"1"} text={fields.tags} onchange={handleTagsChange} error={fieldErrors.tags} />
        <button id="postquestion" className="click" type="button" onClick={handlePostQuestion}>Post Question</button>
        {question.edit && <button id="deletequestion" className="click" type="button" onClick={() => deleteQuestion(question)}>Delete Question</button>}
        <p className="mandatoryfield">* indicates mandatory fields</p>
      </form>
    </div>
  );
}
