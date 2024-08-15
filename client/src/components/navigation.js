/**
 * Navigation menu on the left.
 * @param {Object} props
 * @param {*} props.view Current page.
 * @param {*} props.questionsPage Handle function to display questions page.
 * @param {*} props.tagsPage Handle function to display tags page.
 */
export default function Navigation({view, questionsPage, tagsPage}) {
  return (
    <div id="navmenu">
      <ul id ="nav">
        <li id="qnav" style={{backgroundColor: view === "questions"?"lightgray":"white"}} onClick={questionsPage}>Questions</li>
        <li id="tnav" style={{backgroundColor: view === "tags"?"lightgray":"white"}} onClick={tagsPage}>Tags</li>
      </ul>
    </div>
  );
}
