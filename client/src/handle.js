import axios from 'axios';

import {sortByNewest} from './helper.js';

/**
 * Registers a user if there are no errors in the fields of the form.
 * @param {*} setD Function to change currently displayed content.
 * @param {*} f Fields of form.
 * @param {*} setFE Function to set field errors of form.
 */
export function register(setD, f, setFE) {
  // keep track of and accumulate errors with these variables
  let v = true;
  let fieldErrors= {username: "", email: "", password: "", reenter: ""};

  if(f.username.length === 0) {
    v = false;
    fieldErrors.username = "Please enter a username.";
  }

  if(f.email.length === 0) {
    v = false;
    fieldErrors.email = "Please enter an email.";
  }
  else if(!(/.+@.+\..+/.test(f.email))) {
    v = false;
    fieldErrors.email = "Email is invalid.";
  }

  if(f.password.length === 0) {
    v = false;
    fieldErrors.password = "Please enter a password.";
  }
  else if((new RegExp(f.username)).test(f.password)) {
    v = false;
    fieldErrors.password = "Password can not contain username.";
  }
  else if(fieldErrors.email === "" && (new RegExp(f.email.slice(0, f.email.indexOf('@')))).test(f.password)) {
    v = false;
    fieldErrors.password = "Password can not contain email id.";
  }

  if(f.reenter !== f.password) {
    v = false;
    fieldErrors.reenter = "Passwords do not match.";
  }

  // inform user of any errors in certain fields of the form
  setFE(fieldErrors);

  // if there are no errors, attempt to register the user
  if(v) {
    let account = {username: f.username, email: f.email, password: f.password};
    axios.post('http://localhost:8000/register', account)
      .then(res => {
        if(res.data === "success")
          setD("login");
        else if(res.data === "email")
          setFE({...fieldErrors, email: "Email is already in use."});
        else
          alert("Server error. Please try again.");
      });
  }
}

/**
 * Logs in a user if there are no errors in the fields of the form.
 * @param {*} setD Function to change currently displayed content.
 * @param {*} f Fields of form.
 * @param {*} setFE Function to set field errors of form.
 */
export function login(setD, f, setFE) {
  // keep track of and accumulate errors with these variables
  let v = true;
  let fieldErrors= {username: "", email: "", password: "", reenter: ""};

  if(f.email.length === 0) {
    v = false;
    fieldErrors.email = "Please enter an email.";
  }
  else if(!(/.+@.+\..+/.test(f.email))) {
    v = false;
    fieldErrors.email = "Email is invalid.";
  }

  if(f.password.length === 0) {
    v = false;
    fieldErrors.password = "Please enter a password.";
  }

  // inform user of any errors in certain fields of the form
  setFE(fieldErrors);

  // if there are no errors, attempt to log in the user
  if(v) {
    let account = {username: f.username, email: f.email, password: f.password};
    axios.post('http://localhost:8000/login', account, {withCredentials: true})
      .then(res => {
        if(res.data === "success")
          setD("loggedin");
        else if(res.data === "email")
          setFE({...fieldErrors, email: "Email is not registered."});
        else if(res.data === "password")
          setFE({...fieldErrors, password: "Password is incorrect."});
        else
          alert("Server error. Please try again.");
      });
  }
}

/**
 * Search for questions in the given model/data based on a search input.
 * @param {*} m Model/data with questions.
 * @param {*} v Value of search input.
 * @returns Questions corresponding to the search input.
 */
export function searchForQuestion(m, v) {
  v = v.toLowerCase();

  let questions = [];

  // if search input is not empty, find relevant questions and sort them
  if(v !== "") {
    let words = v.replace(/\[[^[\]]*\]/g, " ").trim();
    if(words.length > 0)
      words = words.split(/\s+/);
    else
      words = [];

    let tags = v.match(/\[[^[\]]*\]/g);
    if(tags === null)
      tags = [];
    else
      tags = tags.map(a => a.slice(1,-1));

    questions = m.questions.filter(a => (
      (words.find(b => (a.title.toLowerCase().search("\\b" + b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b") !== -1) || 
      (a.text.toLowerCase().search("\\b" + b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b") !== -1)) !== undefined) || 
      (tags.find(c => a.tags.find(d => d.name.toLowerCase() === c) !== undefined) !== undefined)
    ));

    questions.sort((a, b) => Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time));
  }

  return questions;
}

/**
 * Adds or updates a user's question if there are no errors in the fields of the form.
 * @param {*} setD Function to change currently displayed content.
 * @param {*} f Fields of form.
 * @param {*} setFE Function to set field errors of form.
 * @param {*} question Question to be updated.
 */
export function postQuestion(setD, f, setFE, question) {
  // keep track of and accumulate errors with these variables
  let v = true;
  let fieldErrors = {questionTitle: "", questionSummary: "", questionText: "", tags: ""};

  if(f.questionTitle.length === 0) {
    v = false;
    fieldErrors.questionTitle = "Input can not be empty.";
  }
  else if(f.questionTitle.length > 50) {
    v = false;
    fieldErrors.questionTitle = "Input can not be more than 50 characters.";
  }

  if(f.questionSummary.length === 0) {
    v = false;
    fieldErrors.questionSummary = "Input can not be empty.";
  }
  else if(f.questionSummary.length > 140) {
    v = false;
    fieldErrors.questionSummary = "Input can not be more than 140 characters.";
  }

  if(f.questionText.length === 0) {
    v = false;
    fieldErrors.questionText = "Input can not be empty.";
  }
  else {
    let links = f.questionText.match(/\[[^[\]]*\]\(.*\)/g);
    if(links !== null) {
      let names = links.map(l => l.replace(/\(.*\)/, "").slice(1, -1));
      links = links.map(l => l.replace(/\[[^[\]]*\]/, "").slice(1, -1));

      if(names.filter(n => n !== "").length !== names.length) {
        v = false;
        fieldErrors.questionText = "Hyperlink names can not be empty.";
      }
      else if(links.filter(l => l !== "").length !== links.length) {
        v = false;
        fieldErrors.questionText = "Hyperlinks can not be empty.";
      }
      else if(links.filter(l => l.slice(0, 8) === "https://" || l.slice(0, 7) === "http://").length !== links.length) {
        v = false;
        fieldErrors.questionText = "Hyperlinks must start with https:// or http://."
      }
    }
  }
  
  let t = [];
  if(f.tags.length === 0) {
    v = false;
    fieldErrors.tags = "Input can not be empty.";
  }
  else if(f.tags.indexOf('[') !== -1 || f.tags.indexOf(']') !== -1) {
    v = false;
    fieldErrors.tags = "Tags can not contain brackets.";
  }
  else {
    t = f.tags.trim().split(/\s+/);
    if(t.length > 5) {
      v = false;
      fieldErrors.tags = "Maximum number of tags is 5.";
    }
    else if(t.filter(a => a.length > 10).length !== 0) {
      v = false;
      fieldErrors.tags = "Tags can not be more than 10 characters long.";
    }
  }

  // inform user of any errors in certain fields of the form
  setFE(fieldErrors);

  // if there are no errors, attempt to add or update the user's question
  if(v) {
    if(question.edit) {
      t = [...new Set(t.map(a => a.toLowerCase()))];
      let uq = {question: {_id: question._id, title: f.questionTitle, summary: f.questionSummary, text: f.questionText}, tags: t};

      axios.post('http://localhost:8000/updatequestion', uq, {withCredentials: true})
        .then(res => {
          setD({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), edit: false}});
        });
    }
    else {
      let nq = {
        title: f.questionTitle,
        summary: f.questionSummary,
        text: f.questionText,
        tags: [],
        comments: [],
        answers: [],
        asked_by: "",
        ask_date_time: new Date(),
        views: 0,
        votes: 0
      };

      t = [...new Set(t.map(a => a.toLowerCase()))];

      (async () => {
        let res = await axios.post('http://localhost:8000/questions', {question: nq, tags: t}, {withCredentials: true});
        if(res.data === "reputation")
          alert("You need at least 50 reputation to create new tags.");
        else {
          await axios.get('http://localhost:8000/questions')
          .then(res => {
            setD({view: "questions", data: {search: false, sort: 1, questions: res.data, fquestions: sortByNewest(res.data), i: 0, j: 5}});
          });
        }
      })();
    }
  }
}

/**
 * Adds or updates a user's answer if there are no errors in the fields of the form.
 * @param {*} setD Function to change currently displayed content.
 * @param {*} q Question of answer to be updated.
 * @param {*} f Fields of form.
 * @param {*} setFE Function to set field errors of form.
 */
export function postAnswer(setD, q, f, setFE) {
  // keep track of and accumulate errors with these variables
  let v = true;
  let fieldErrors = {username: "", answerText: ""};

  if(f.answerText.length === 0) {
    v = false;
    fieldErrors.answerText = "Input can not be empty.";
  }
  else {
    let links = f.answerText.match(/\[[^[\]]*\]\(.*\)/g);
    if(links !== null) {
      let names = links.map(l => l.replace(/\(.*\)/, "").slice(1, -1));
      links = links.map(l => l.replace(/\[[^[\]]*\]/, "").slice(1, -1));

      if(names.filter(n => n !== "").length !== names.length) {
        v = false;
        fieldErrors.answerText = "Hyperlink names can not be empty.";
      }
      else if(links.filter(l => l !== "").length !== links.length) {
        v = false;
        fieldErrors.answerText = "Hyperlinks can not be empty.";
      }
      else if(links.filter(l => l.slice(0, 8) === "https://" || l.slice(0, 7) === "http://").length !== links.length) {
        v = false;
        fieldErrors.answerText = "Hyperlinks must start with https:// or http://."
      }
    }
  }

  // inform user of any errors in certain fields of the form
  setFE(fieldErrors);

  // if there are no errors, attempt to add or update the user's answer
  if(v) {
    if(q.edit) {
      let ua = {id: q._id, answer: {_id: q.answer._id, text: f.answerText}};

      axios.post('http://localhost:8000/updateanswer', ua, {withCredentials: true})
        .then(res => {
          setD({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), edit: false}});
        });
    }
    else {
      let na = {
        text: f.answerText,
        comments: [],
        ans_by: "",
        ans_date_time: new Date(),
        votes: 0
      };

      axios.post('http://localhost:8000/answers', {id: q._id, answer: na}, {withCredentials: true})
        .then(res => {
          setD({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), i: 0, j: 5}});
        });
    }
  }
}
