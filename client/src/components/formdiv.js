/**
 * Generic div element for a form question.
 * @param {Object} props
 * @param {*} props.h1 Title of question on form.
 * @param {*} props.p Description of question on form.
 * @param {*} props.rows Number of rows in text box.
 * @param {*} props.text Text inputted so far.
 * @param {*} props.onchange Function to update state of fields.
 * @param {*} props.error Error message.
 */
export default function FormDiv({h1, p, rows, text, onchange, error}) {
  return (
    <div className="formdiv">
      <h1>{h1}</h1>
      {p !== "" && <p>{p}</p>}
      {rows === "1" && <input type="text" defaultValue={text} onChange={(e) => onchange(e)} key={h1}></input>}
      {rows !== "1" && <textarea rows={rows} defaultValue={text} onChange={(e) => onchange(e)} key={h1}></textarea>}
      {error !== "" && <p className="formerror">{error}</p>}
    </div>
  );
}
