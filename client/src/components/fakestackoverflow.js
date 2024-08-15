import {useState, useEffect} from 'react';
import axios from 'axios';
import Banner from './banner.js';
import AdminProfile from './adminprofile.js';
import UserProfile from './userprofile.js';
import Navigation from './navigation.js';
import QuestionsPage from './questionspage.js';
import TagsPage from './tagspage.js';
import AskQuestionForm from './askquestionform.js';
import Question from './question.js';
import AnswerQuestionForm from './answerquestionform.js';

import {sortByNewest, sortByActive, sortByUnanswered} from '../helper.js';
import {searchForQuestion} from '../handle.js';

/**
 * Main page of the forum.
 * @param {Object} props
 * @param {*} props.logout Logout function for logging out the user.
 */
export default function FakeStackOverflow({logout}) {
  const [display, setDisplay] = useState({view: "questions", data: {search: false, sort: 1, questions: [], fquestions: []}});

  // get questions from database
  useEffect(() => {
    axios.get('http://localhost:8000/questions')
      .then(res => {
        setDisplay({view: "questions", data: {search: false, sort: 1, questions: res.data, fquestions: sortByNewest(res.data)}});
      })
  }, []);

  // handle function to search for questions
  function handleSearch(key, search) {
    if(key === "Enter") {
      axios.get('http://localhost:8000/data').then(res => {
        let searchResult = searchForQuestion(res.data, search);
        setDisplay({view: "questions", data: {search: true, sort: 1, questions: searchResult, fquestions: sortByNewest(searchResult)}});
      });
    }
  }

  // handle function to view the user's profile
  function handleUserProfile() {
    axios.get('http://localhost:8000/userprofile', {withCredentials: true})
      .then(res => {
        if(res.data.admin)
          setDisplay({view: "adminprofile", data: res.data});
        else
          setDisplay({view: "userprofile", data: {...res.data, questions: sortByNewest(res.data.questions), answers: sortByNewest(res.data.answers), tag: {name: ""}}});
      });
  }

  // handle function to view any user profile
  function handleUser(user) {
    axios.post('http://localhost:8000/userprofile', {email: user.email}, {withCredentials: true})
      .then(res => {
        setDisplay({view: "userprofile", data: {...res.data, questions: sortByNewest(res.data.questions), answers: sortByNewest(res.data.answers), tag: {name: ""}}});
      });
  }

  // handle function to delete the account of a user
  function handleDeleteUser(user, self) {
    if(window.confirm("You are attempting to delete " + user.username + ". Please click OK to continue.")) {
      axios.post('http://localhost:8000/deleteaccount', {email: user.email}, {withCredentials: true})
        .then(res => {
          if(self)
            logout();
          else
            setDisplay({view: "adminprofile", data: res.data});
        });
    }
  }

  // handle function to view a question that the user has answered
  function handleUserAnswers(question) {
    axios.post('http://localhost:8000/useranswers', {id: question._id}, {withCredentials: true})
      .then(res => {
        setDisplay({view: "question", data: {...res.data, edit: true}});
      });
  }

  // handle function to edit a tag that the user has created
  function handleEditTag(tag) {
    axios.post('http://localhost:8000/edittag', {id: tag._id}, {withCredentials: true})
      .then(res => {
        if(res.data === "tag")
          alert("This tag is in use by another user and can not be edited.");
        else
          setDisplay({view: "userprofile", data: {...display.data, tag: res.data}});
      });
  }

  // handle function to update a tag that the user has created
  function handleUpdateTag(key, tag) {
    if(key === "Enter") {
      axios.post('http://localhost:8000/updatetag', tag, {withCredentials: true})
        .then(res => {
          if(res.data === "tag")
            alert("The tag name entered already exists. Please enter a different name.");
          else
            setDisplay({view: "userprofile", data: {...res.data, tag: {name: ""}}});
        })
    }
  }

  // handle function to delete a tag that the user has created
  function handleDeleteTag(tag) {
    axios.post('http://localhost:8000/deletetag', {id: tag._id}, {withCredentials: true})
      .then(res => {
        if(res.data === "tag")
          alert("This tag is in use by another user and can not be deleted.");
        else
          setDisplay({view: "userprofile", data: {...res.data, tag: {name: ""}}});
      });
  }

  // handle function to display questions page
  function handleQuestionsPage() {
    axios.get('http://localhost:8000/questions').then(res => {
      setDisplay({view: "questions", data: {search: false, sort: 1, questions: res.data, fquestions: sortByNewest(res.data)}});
    });
  }

  // handle function to display tags page
  function handleTagsPage() {
    axios.get('http://localhost:8000/data').then(res => {
      setDisplay({view: "tags", data: {...res.data, tag: {name: ""}}});
    });
  }

  // handle function to display ask question form
  function handleAskQuestion() {
    setDisplay({view: "askquestion", data: {...display.data, edit: false}});
  }

  // handle function to edit a question that the user has asked
  function handleEditQuestion(question) {
    axios.post('http://localhost:8000/editquestion', {id: question._id})
      .then(res => {
        setDisplay({view: "askquestion", data: {...res.data, edit: true}});
      });
  }

  // handle function to delete a question that the user has asked
  function handleDeleteQuestion(question) {
    axios.post('http://localhost:8000/deletequestion/', {id: question._id}, {withCredentials: true})
      .then(res => {
        setDisplay({view: "userprofile", data: res.data});
      });
  }

  // handle function to sort questions by newest
  function handleSortByNewest() {
    setDisplay({view: "questions", data: {search: display.data.search, sort: 1, questions: display.data.questions, fquestions: sortByNewest(display.data.questions)}});
  }

  // handle function to sort questions by active
  function handleSortByActive() {
    setDisplay({view: "questions", data: {search: display.data.search, sort: 2, questions: display.data.questions, fquestions: sortByActive(display.data.questions)}});
  }

  // handle function to sort questions by unanswered
  function handleSortByUnanswered() {
    setDisplay({view: "questions", data: {search: display.data.search, sort: 3, questions: display.data.questions, fquestions: sortByUnanswered(display.data.questions)}});
  }

  // handle function to display clicked question
  function handleQuestion(question) {
    axios.get('http://localhost:8000/posts/question/' + question._id)
      .then(res => {
        setDisplay({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), edit: false}});
      });
  }

  // handle function to vote on a question, answer, or comment
  function handleVote(type, vote, change, question) {
    axios.post('http://localhost:8000/vote', {type: type, id: vote._id, change: change, qid: question._id}, {withCredentials: true})
      .then(res => {
        if(res.data === "reputation")
          alert("You must have at least 50 reputation points to vote on a question or answer.");
        else
          setDisplay({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), edit: display.data.edit}});
      });
  }

  // handle function to comment on a question or answer
  function handleComment(key, type, qa, nc, question, setE) {
    if(key === "Enter" && nc !== "") {
      if(nc.length > 140)
        setE("length");
      else {
        axios.post('http://localhost:8000/comments', {type: type, id: qa._id, comment: {text: nc, com_by: "", com_date_time: new Date(), votes: 0}, qid: question._id}, {withCredentials: true})
          .then(res => {
            if(res.data === "reputation")
              setE("reputation");
            else
              setDisplay({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), comment: true, edit: display.data.edit}});
          });
      }
    }
  }

  // handle function to display answer question form
  function handleAnswerQuestion() {
    setDisplay({view: "answerquestion", data: {...display.data, edit: false}});
  }

  // handle function to edit an answer that the user provided
  function handleEditAnswer(answer) {
    axios.post('http://localhost:8000/editanswer', {id: answer._id})
      .then(res => {
        setDisplay({view: "answerquestion", data: {...display.data, answer: res.data, edit: true}});
      });
  }

  // handle function to delete an answer that the user provided
  function handleDeleteAnswer(answer, question) {
    axios.post('http://localhost:8000/deleteanswer', {id: answer._id, qid: question._id}, {withCredentials: true})
      .then(res => {
        setDisplay({view: "question", data: {...res.data, answers: sortByNewest(res.data.answers), edit: true}});
      });
  }

  // show next page based on user input
  switch(display.view) {
    case "adminprofile":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <AdminProfile userInfo={display.data} userProfile={handleUser} deleteUser={handleDeleteUser} />
        </section>
      );
    case "userprofile":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <UserProfile userInfo={display.data} search={handleSearch} editQuestion={handleEditQuestion} userAnswers={handleUserAnswers} editTag={handleEditTag} updateTag={handleUpdateTag} deleteTag={handleDeleteTag} />
        </section>
      );
    case "questions":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <QuestionsPage questionList={display.data} logout={logout} askQuestion={handleAskQuestion} sortByNewest={handleSortByNewest} sortByActive={handleSortByActive} sortByUnanswered={handleSortByUnanswered} question={handleQuestion} />
        </section>
      );
    case "tags":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <TagsPage model={display.data} logout={logout} askQuestion={handleAskQuestion} search={handleSearch} />
        </section>
      );
    case "askquestion":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <AskQuestionForm setDisplay={setDisplay} question={display.data} deleteQuestion={handleDeleteQuestion} />
        </section>
      );
    case "question":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <Question question={display.data} logout={logout} askQuestion={handleAskQuestion} answerQuestion={handleAnswerQuestion} vote={handleVote} comment={handleComment} editAnswer={handleEditAnswer} deleteAnswer={handleDeleteAnswer} />
        </section>
      );
    case "answerquestion":
      return (
        <section className="fakeso">
          <Banner search={handleSearch} userProfile={handleUserProfile} logout={logout} />
          <Navigation view={display.view} questionsPage={handleQuestionsPage} tagsPage={handleTagsPage} />
          <AnswerQuestionForm setDisplay={setDisplay} question={display.data} />
        </section>
      );
    default:
  }
}
