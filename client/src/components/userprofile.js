import {useState} from 'react';
import {Questions} from './questionspage.js';
import {Tags} from './tagspage.js';

/**
 * User profile, which includes all of the user's asked questions, answered questions, and created tags.
 * @param {Object} props
 * @param {*} props.userInfo Information about the user.
 * @param {*} props.search Handle function to search for questions.
 * @param {*} props.editQuestion Handle function to edit a question that the user has asked.
 * @param {*} props.userAnswers Handle function to view a question that the user has answered.
 * @param {*} props.editTag Handle function to edit a tag that the user has created.
 * @param {*} props.updateTag Handle function to update a tag that the user has created.
 * @param {*} props.deleteTag Handle function to delete a tag that the user has created.
 */
export default function UserProfile({userInfo, search, editQuestion, userAnswers, editTag, updateTag, deleteTag}) {
  const [display, setDisplay] = useState("asked");

  const [shown, setShown] = useState({i: 0, j: 5});

  // handle function to go to previous items
  function handlePrev() {
    setShown({i: shown.i - 5, j: shown.j - 5});
  }

  // handle function to go to next items
  function handleNext(len) {
    if(shown.j >= len)
      setShown({i: 0, j: 5});
    else
      setShown({i: shown.i + 5, j: shown.j + 5});
  }

  return (
    <div className="page">
      <UserInfo userInfo={userInfo} />
      <UserControls display={display} setDisplay={setDisplay} />
      {display === "asked" && <Questions search={true} questions={userInfo.questions} question={editQuestion} shown={shown} len={userInfo.questions.length} prev={handlePrev} next={handleNext} />}
      {display === "answered" && <Questions search={true} questions={userInfo.answers} question={userAnswers} shown={shown} len={userInfo.answers.length} prev={handlePrev} next={handleNext} />}
      {display === "created" && <Tags model={{questions: userInfo.all_questions, tags: userInfo.tags, tag: userInfo.tag, edit: userInfo.edit}} search={search} editTag={editTag} updateTag={updateTag} deleteTag={deleteTag} />}
    </div>
  );
}

/**
 * View of information about the user.
 * @param {Object} props
 * @param {*} props.userInfo Information about the user.
 */
export function UserInfo({userInfo}) {
  let time = Date.now() - Date.parse(userInfo.reg_date_time);
  let years = Math.floor(time / (1000*60*60*24*365));
  time = time % (1000*60*60*24*365);
  let months = Math.floor(time / (1000*60*60*24*30));
  time = time % (1000*60*60*24*30);
  let days = Math.floor(time / (1000*60*60*24));
  
  return (
    <div id="userinfo">
      <h1 id="username">{userInfo.username}</h1>
      <h1 id="email">{userInfo.email}</h1>
      <p id="rtime">{"Been a member for " + years + " year" + (years===1?"":"s") + ", " + months + " month" + (months===1?"":"s") + ", " + days + " day" + (days===1?"":"s")}</p>
      <p id="reputation">{"Reputation: " + userInfo.reputation}</p>
    </div>
  );
}

/**
 * Buttons that the user uses to go to previous and next items.
 * @param {Object} props
 * @param {*} props.display Current items being shown (asked questions, answered questions, or created tags).
 * @param {*} props.setDisplay Function to show different types of items.
 */
function UserControls({display, setDisplay}) {
  return (
    <div id="usercontrols">
      <button className="controls" style={{backgroundColor: display === "asked"?"lightgray":"white"}} onClick={() => setDisplay("asked")}>Questions Asked</button>
      <button id="questionsanswered" className="controls" style={{backgroundColor: display === "answered"?"lightgray":"white"}} onClick={() => setDisplay("answered")}>Questions Answered</button>
      <button className="controls" style={{backgroundColor: display === "created"?"lightgray":"white"}} onClick={() => setDisplay("created")}>Tags Created</button>
    </div>
  );
}
