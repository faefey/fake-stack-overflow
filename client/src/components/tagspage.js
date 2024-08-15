import {searchForQuestion} from "../handle.js";

/**
 * Page showing all tags.
 * @param {Object} props
 * @param {*} props.model Tag and other related data.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 * @param {*} props.search Handle function to search for questions.
 */
export default function TagsPage({model, logout, askQuestion, search}) {
  return (
    <div className="page">
      <TagsTop model={model} logout={logout} askQuestion={askQuestion} />
      <Tags model={model} search={search} editTag={null} updateTag={null} deleteTag={null} />
    </div>
  );
}

/**
 * Top of tags page.
 * @param {Object} props
 * @param {*} props.model Tag and other related data.
 * @param {*} props.logout Logout function for logging out the user.
 * @param {*} props.askQuestion Handle function to display ask question form.
 */
function TagsTop({model, logout, askQuestion}) {
  return (
    <div id="ttop">
      <h1 id="tnum">{model.tags.length} Tag{model.tags.length === 1?"":"s"}</h1>
      <h1>All Tags</h1>
      {logout !== null && <button className="click" onClick={askQuestion}>Ask Question</button>}
    </div>
  );
}

/**
 * Boxes of tags.
 * @param {Object} props
 * @param {*} props.model Tag and other related data.
 * @param {*} props.search Handle function to search for questions.
 * @param {*} props.editTag Handle function to edit a tag that the user has created.
 * @param {*} props.updateTag Handle function to update a tag that the user has created.
 * @param {*} props.deleteTag Handle function to delete a tag that the user has created.
 */
export function Tags({model, search, editTag, updateTag, deleteTag}) {
  if(model.tags.length === 0) {
    return (
      <h1 id="notagsfound">No Tags Found</h1>
    );
  }
  else {
    let tags = model.tags.map(t => <TagBox model={model} tag={t} search={search} editTag={editTag} updateTag={updateTag} deleteTag={deleteTag} key={t.name} />);
    return (
      <div id="tlist">
        {tags}
      </div>
    );
  }
}

/**
 * A single tag in a box.
 * @param {Object} props
 * @param {*} props.model Tag and other related data.
 * @param {*} props.tag A single tag.
 * @param {*} props.search Handle function to search for questions.
 * @param {*} props.editTag Handle function to edit a tag that the user has created.
 * @param {*} props.updateTag Handle function to update a tag that the user has created.
 * @param {*} props.deleteTag Handle function to delete a tag that the user has created.
 */
function TagBox({model, tag, search, editTag, updateTag, deleteTag}) {
  let n = searchForQuestion(model, "[" + tag.name + "]").length;
  return (
    <div className="tbox">
      {model.tag.name !== tag.name && <p className="tlink" onClick={() => search("Enter", "[" + tag.name + "]")}>{tag.name}</p>}
      {model.tag.name === tag.name && <input id="updatetag" defaultValue={tag.name} onKeyDown={e => updateTag(e.key, {_id: tag._id, name: e.target.value})}></input>}
      <p className="tquestions">{n} question{n === 1?"":"s"}</p>
      {editTag !== null && <button id="edittag" className="click" onClick={() => editTag(tag)}>Edit</button>}
      {deleteTag !== null && <button id="deletetag" className="click" onClick={() => deleteTag(tag)}>Delete</button>}
    </div>
  );
}
